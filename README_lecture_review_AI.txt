
==============================================
강의평 AI 실행 가이드 (lecture_review AI Guide)
==============================================

이 문서는 '강의평 감정 분석 AI' 프로젝트를 실행하기 위해
다른 사용자도 동일하게 환경을 구성할 수 있도록 돕습니다.

----------------------------------------------
1. Python 버전
----------------------------------------------
Python 3.9 ~ 3.11 권장  
(Windows / Linux / Mac 모두 가능)

----------------------------------------------
2. 가상환경 생성하기 (venv)
----------------------------------------------

프로젝트 최상위 폴더에서 실행:

    python -m venv venv

가상환경 활성화:

윈도우:
    venv\Scripts\Activate.ps1

맥 / 리눅스:
    source venv/bin/activate

가상환경이 활성화되면 프롬프트 앞에 (venv) 가 붙습니다.

----------------------------------------------
3. 필요한 라이브러리 설치
----------------------------------------------

requirements.txt가 프로젝트에 포함되어 있다면:

    pip install -r requirements.txt

requirements.txt가 없는 경우:

    pip install numpy pandas scikit-learn tensorflow keras matplotlib h5py

----------------------------------------------
4. 폴더 구조
----------------------------------------------

폴더 구조는 다음과 같아야 합니다:

    ai/
     └─ lecture_review/
         ├─ predict.py
         ├─ train_model.py
         ├─ models/
         │    └─ model.h5
         └─ data/
              └─ reviews_extended.csv

※ model.h5 파일이 없으면 predict.py는 실행되지 않습니다.

----------------------------------------------
5. 예측 실행 방법
----------------------------------------------

가상환경을 활성화한 후, lecture_review 폴더로 이동:

    cd ai/lecture_review

예측 실행:

    python predict.py

문장을 인자로 받는 버전이라면:

    python predict.py "강의가 이해가 잘 됐어요!"

----------------------------------------------
6. 가상환경 종료
----------------------------------------------

윈도우 / 맥 / 리눅스 공통:

    deactivate

----------------------------------------------
7. 문제 해결
----------------------------------------------

에러: ModuleNotFoundError: No module named 'numpy'
 → pip install numpy

에러: Cannot open model.h5
 → models/model.h5 위치 확인

에러: Permission Denied (PowerShell 실행 문제)
 → 관리자 권한으로 PowerShell 실행

----------------------------------------------

End of Document
