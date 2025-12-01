# train_model.py

import os
import random
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Embedding, Bidirectional, LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# ===== 0. 시드 고정 (재현성 조금이라도 확보) =====
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)

# 1. 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "reviews_extended.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# 2. 데이터 로드
df = pd.read_csv(DATA_PATH)

# 결측치 제거
df = df.dropna(subset=["review_text", "rating"])

texts = df["review_text"].astype(str).tolist()
labels = df["rating"].astype(int) - 1  # 1~5 → 0~4로 변환

# 3. Train / Test split
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.2, random_state=SEED, stratify=labels
)

# 4. 토크나이저 & 시퀀스 변환
vocab_size = 20000
max_len = 100

tokenizer = Tokenizer(num_words=vocab_size, oov_token="<OOV>")
tokenizer.fit_on_texts(X_train)

X_train_seq = tokenizer.texts_to_sequences(X_train)
X_test_seq = tokenizer.texts_to_sequences(X_test)

X_train_pad = pad_sequences(X_train_seq, maxlen=max_len, padding="post", truncating="post")
X_test_pad = pad_sequences(X_test_seq, maxlen=max_len, padding="post", truncating="post")

y_train = tf.convert_to_tensor(y_train, dtype=tf.int32)
y_test = tf.convert_to_tensor(y_test, dtype=tf.int32)

# 5. 모델 정의 (Embedding + BiLSTM)
model = Sequential([
    Embedding(vocab_size, 128, input_length=max_len),
    Bidirectional(LSTM(64, return_sequences=False)),
    Dropout(0.5),
    Dense(64, activation="relu"),
    Dropout(0.5),
    Dense(5, activation="softmax")  # 5 클래스 (1~5점)
])

model.compile(
    loss="sparse_categorical_crossentropy",
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    metrics=["accuracy"]
)

model.summary()

# ===== 6. 콜백 설정 (조기 종료 + 최고 모델 저장) =====
checkpoint_path = os.path.join(MODEL_DIR, "lecture_model_best.h5")

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=5,           # 5 epoch 동안 개선 없으면 stop
    restore_best_weights=True
)

checkpoint = ModelCheckpoint(
    checkpoint_path,
    monitor="val_loss",
    save_best_only=True,
    save_weights_only=False
)

# 7. 학습
history = model.fit(
    X_train_pad,
    y_train,
    epochs=30,             # 5 → 30으로 증가
    batch_size=8,          # 데이터 적으니까 작게
    validation_split=0.2,
    callbacks=[early_stop, checkpoint],
    verbose=1
)

# 8. 테스트셋 평가
test_loss, test_acc = model.evaluate(X_test_pad, y_test, verbose=0)
print(f"Test Accuracy: {test_acc:.4f}")

# 9. 최종 모델 저장 (best 모델 기준으로 다시 로드해서 저장)
if os.path.exists(checkpoint_path):
    best_model = tf.keras.models.load_model(checkpoint_path)
else:
    best_model = model

model_path = os.path.join(MODEL_DIR, "lecture_model.h5")
best_model.save(model_path)
print(f"Model saved to: {model_path}")

# 토크나이저 저장 (json)
tokenizer_json = tokenizer.to_json()
tokenizer_path = os.path.join(MODEL_DIR, "tokenizer.json")
with open(tokenizer_path, "w", encoding="utf-8") as f:
    f.write(tokenizer_json)
print(f"Tokenizer saved to: {tokenizer_path}")
