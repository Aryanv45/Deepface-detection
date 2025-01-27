import cv2
import numpy as np
import tensorflow as tf
import librosa

# Load the models
image_model_1 = tf.keras.models.load_model('./models/deepfake.h5')
image_model_2 = tf.keras.models.load_model('./models/deepfake.keras')
image_model_3 = tf.keras.models.load_model('./models/deepfake2.keras')

video_model_1 = tf.keras.models.load_model('./models/deepfake.h5')
video_model_2 = tf.keras.models.load_model('./models/deepfake.keras')
video_model_3 = tf.keras.models.load_model('./models/deepfake2.keras')

live_video_model_1 = tf.keras.models.load_model('./models/deepfake.h5')
live_video_model_2 = tf.keras.models.load_model('./models/deepfake.keras')
live_video_model_3 = tf.keras.models.load_model('./models/deepfake2.keras')

audio_model = tf.keras.models.load_model('./models/audio_classifier.h5')

def crop_face(img_arr):
    img_arr = cv2.cvtColor(img_arr, cv2.COLOR_BGR2RGB)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(img_arr, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) > 0:
        x, y, w, h = faces[0]

        margin = 200
        x_margin = max(0, x - margin)
        y_margin = max(0, y - margin)
        w_margin = min(img_arr.shape[1], w + 2 * margin)
        h_margin = min(img_arr.shape[0], h + 2 * margin)
        
        cropped_face = img_arr[y_margin:y_margin+h_margin, x_margin:x_margin+w_margin]
        cropped_face = cv2.resize(cropped_face, (224, 224)) / 255.0
        return cropped_face
    
    return -1

def predict_image(img_path):
    img_arr = cv2.imread(img_path)
    face = crop_face(img_arr)
    if not isinstance(face, np.ndarray):
        return -1
    input = np.expand_dims(face, axis=0)
    pred = image_model_1.predict(input)  # Specify the model to use
    res = np.argmax(pred)
    return int(res)

def predict_video(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Unable to open video")
        return -1

    count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        count += 1
        if not count % 3 == 0:
            continue
        
        face = crop_face(frame)
        if not isinstance(face, np.ndarray):
            continue
    
        data = np.expand_dims(face, axis=0)
        pred = np.argmax(video_model_1.predict(data))  # Specify the model to use
        if pred == 1:
            return 1

    cap.release()
    return 0

def predict_live_video_frame(file_path):
    return predict_video(file_path)

def preprocess_audio(file_path):
    y, sr = librosa.load(file_path, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs = (mfccs - np.mean(mfccs)) / np.std(mfccs)
    mfccs = np.expand_dims(mfccs, axis=0)
    mfccs = np.expand_dims(mfccs, axis=-1)
    return mfccs

def predict_audio(file_path):
    audio_features = preprocess_audio(file_path)
    predictions = audio_model.predict(audio_features)
    is_fake = predictions[0][0] > 0.5
    return is_fake