import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 100, // 100명의 가상 사용자
  duration: "30s", // 30초 동안 테스트 수행
};

export default function () {
  // 1. 공지사항 목록 조회
  const listRes = http.get("http://backend:8080/api/announcements");
  check(listRes, { "list status was 200": (r) => r.status == 200 });

  // 1초 대기
  sleep(1);

  // 2. 특정 게시글 상세 조회 (1 ~ 10000 사이의 랜덤 ID)
  const postId = Math.floor(Math.random() * 10000) + 1;
  const detailRes = http.get(`http://backend:8080/api/announcements/${postId}`);
  check(detailRes, { "detail status was 200": (r) => r.status == 200 });

  // 1초 대기
  sleep(1);
}
