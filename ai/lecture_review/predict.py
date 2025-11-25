import os
import json
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

MODEL_PATH = os.path.join(MODEL_DIR, "lecture_model.h5")
TOKENIZER_PATH = os.path.join(MODEL_DIR, "tokenizer.json")

max_len = 100

# 1. 모델 & 토크나이저 로드
model = load_model(MODEL_PATH)

# tokenizer_from_json은 "문자열"을 받아야 함
with open(TOKENIZER_PATH, "r", encoding="utf-8") as f:
    tokenizer_json = f.read()
tokenizer = tokenizer_from_json(tokenizer_json)

def predict_review(review_text: str):
    # 2. 텍스트 → 시퀀스
    seq = tokenizer.texts_to_sequences([review_text])
    pad = pad_sequences(seq, maxlen=max_len, padding="post", truncating="post")

    # 3. 예측
    probs = model.predict(pad)[0]  # shape: (5,)
    pred_class = int(np.argmax(probs))  # 0~4
    rating = pred_class + 1            # 다시 1~5로

    # 감성 라벨 단순 매핑 (1~5 → 부정/중립/긍정)
    if rating <= 2:
        sentiment = "부정"
    elif rating == 3:
        sentiment = "중립"
    else:
        sentiment = "긍정"

    return {
        "rating": rating,
        "sentiment": sentiment,
        "probs": probs.tolist()
    }

if __name__ == "__main__":
    test_text = "교수님이 tmi가 너무 많아서 집중하기 어렵지만 과제나 팀플이 없어서 좋음"
    result = predict_review(test_text)
    print("입력:", test_text)
    print("예측 별점:", result["rating"])
    print("감성:", result["sentiment"])
    print("클래스별 확률:", result["probs"])
