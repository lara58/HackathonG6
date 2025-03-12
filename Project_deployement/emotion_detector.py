import cv2
import numpy as np
import random
from tensorflow.keras.models import load_model
from PIL import Image


class EmotionDetector:
    def __init__(self, model_path="emotion_model_vf.h5", dummy_mode=False):
        self._is_dummy = dummy_mode
        self.emotions = ['colère', 'dégoût', 'peur', 'joie', 'neutre', 'tristesse', 'surprise']

        if dummy_mode:
            print("Mode fictif activé - aucun modèle ne sera chargé")
            return

        try:
            print(f"🔄 Chargement du modèle Keras : {model_path}")
            self.model = load_model(model_path)
            print("✅ Modèle chargé avec succès !")
        except Exception as e:
            print(f"❌ Erreur lors du chargement du modèle : {e}")
            self._is_dummy = True

    def preprocess(self, face_image):
        """
        Prépare l’image du visage pour être traitée par le modèle.
        """
        face_pil = Image.fromarray(cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB))
        face_pil = face_pil.resize((48, 48))  # Adapter à la taille attendue par le modèle
        face_gray = face_pil.convert("L")  # Convertir en niveaux de gris
        face_array = np.array(face_gray) / 255.0  # Normaliser entre 0 et 1
        face_array = np.expand_dims(face_array, axis=0)  # Ajouter une dimension batch
        face_array = np.expand_dims(face_array, axis=-1)  # Ajouter une dimension canal
        return face_array

    def predict(self, face_image):
        """
        Prédit l’émotion dominante du visage détecté.
        """
        if self._is_dummy:
            return random.choice(self.emotions), random.uniform(0.7, 0.95)

        try:
            inputs = self.preprocess(face_image)
            scores = self.model.predict(inputs)[0]
            max_idx = np.argmax(scores)
            confidence = scores[max_idx]
            emotion = self.emotions[max_idx]
            return emotion, confidence

        except Exception as e:
            print(f"❌ Erreur lors de la prédiction : {e}")
            return random.choice(self.emotions), random.uniform(0.7, 0.95)


def run_realtime_emotion_detection():
    """
    Capture vidéo en temps réel et détection des émotions faciales.
    """
    cap = cv2.VideoCapture(0)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    detector = EmotionDetector()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            face_roi = frame[y:y+h, x:x+w]
            emotion, confidence = detector.predict(face_roi)

            # Dessiner un rectangle et afficher l’émotion détectée
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.putText(frame, f"{emotion} ({confidence:.2f})", (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

        cv2.imshow('Real-time Emotion Detection', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    run_realtime_emotion_detection()
