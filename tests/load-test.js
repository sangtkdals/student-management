import http from "k6/http";
import { check, sleep } from "k6";

// 테스트 옵션 설정
export const options = {
  scenarios: {
    // Spike Test 시나리오: 1000명의 사용자가 동시에 몰리는 상황
    spike: {
      executor: "per-vu-iterations", // 각 VU가 지정된 횟수만큼 반복
      vus: 1000, // 가상 사용자 1000명
      iterations: 1, // 각 사용자당 1번만 요청
      maxDuration: "20s", // 20초 안에 모든 요청이 완료되어야 함
    },
  },
  thresholds: {
    // 테스트 성공/실패 기준 정의
    http_req_failed: ["rate<0.01"], // HTTP 요청 실패율이 1% 미만이어야 함
    http_req_duration: ["p(95)<500"], // 95%의 요청이 500ms 안에 처리되어야 함
  },
};

// 메인 테스트 함수
export default function () {
  // Docker Compose 네트워크 내에서 'backend' 서비스 이름으로 직접 통신합니다.
  const url = "http://backend:8080/api/enrollments";

  // 테스트에 사용할 학생 및 강의 데이터 (실제 환경에 맞게 수정 필요)
  // init.sql의 샘플 데이터를 기반으로, 수강 정원이 50명인 'CSE4001_01' 강의를 대상으로 테스트합니다.
  const courseCode = "CSE4001_01"; // 테스트할 특정 강의 코드

  // 가상 사용자(VU)마다 다른 학생 ID를 부여하여 여러 학생이 동시에 신청하는 상황을 시뮬레이션합니다.
  // __VU는 k6에서 제공하는 가상 사용자 ID (1부터 시작)
  const studentId = `2024${String(__VU).padStart(4, "0")}`;

  const payload = JSON.stringify({
    studentId: studentId,
    courseCode: courseCode,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // 수강 신청 API에 POST 요청을 보냅니다.
  const res = http.post(url, payload, params);

  // 응답 검증
  check(res, {
    "is status 200 (ok)": (r) => r.status === 200,
    "is status 400 (bad request)": (r) => r.status === 400,
  });

  // 다음 요청 전 1초 대기
  sleep(1);
}
