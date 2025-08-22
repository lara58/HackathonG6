from flask import Flask, request, jsonify, render_template
import base64
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import uuid  # Import de uuid pour générer des identifiants uniques
import time 
from datetime import datetime
from pymongo import MongoClient 
from collections import deque


# Initialisation de l'application Flask
app = Flask(__name__)

emotion_tracker = {}
emotion_history = deque(maxlen=10)  # Stocke les émotions des 2 dernières secondes (si analyse = 5 FPS, alors 10 = 2 sec)

# Chargement du modèle Keras
MODEL_PATH = "emotion_model_vf.h5"

# Connexion MongoDB
MONGO_URI = "mongodb://localhost:27017/"  # Modifie avec ton URI si nécessaire
client = MongoClient(MONGO_URI)
db = client["emotion_recognition"]  # Nom
collection = db["emotions"]  # Collection

def save_to_mongo(user_id, emotion, accuracy):
    print(f"pas ok")
    """ Enregistre une émotion stable dans MongoDB. """
    try:
        doc = {
            "user_id": user_id,
            "emotion": emotion,
            "accuracy": accuracy,
            "timestamp": datetime.utcnow()
        }
        collection.insert_one(doc)
        print(f"✅ Emotion enregistrée en BDD : {emotion} (Accuracy: {accuracy:.2f})")
    except Exception as e:
        print(f"❌ Erreur lors de l'enregistrement en BDD : {e}")

try:
    print(f"🔄 Chargement du modèle Keras : {MODEL_PATH}")
    model = load_model(MODEL_PATH)
    print("✅ Modèle chargé avec succès !")
except Exception as e:
    print(f"❌ Erreur lors du chargement du modèle : {e}")
    model = None

# Chargement du détecteur de visages OpenCV
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

if face_cascade.empty():
    print("⚠️ Erreur : Impossible de charger le modèle de détection des visages.")

# Liste des émotions reconnues par le modèle
EMOTIONS = ['colère', 'dégoût', 'peur', 'joie', 'neutre', 'tristesse', 'surprise']

@app.route('/test', methods=['GET'])
def test_page():
    """ Affiche la page HTML pour l’analyse en temps réel. """
    return render_template('realtime_test.html')

@app.route('/analyze-frame', methods=['POST'])
def analyze_emotion():
    """ Analyse une image Base64 envoyée depuis le frontend et retourne l’émotion détectée. """
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'Aucune image fournie'}), 400

        # Générer un identifiant utilisateur unique
        user_id = str(uuid.uuid4()) 

        # Vérifier si 'emotions' est présent dans le JSON
        emotions_test = data.get('emotions', 'Non spécifié')
        print(f"📩 Données reçues - userId: {user_id}, emotions: {emotions_test}")

        # Décodage de l'image Base64
        image_b64 = data['image'].split(',')[1] if ',' in data['image'] else data['image']
        image_data = base64.b64decode(image_b64)
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({'error': 'Impossible de décoder l’image'}), 400

        # Détection des visages
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            print(f"🚨 Aucun visage détecté - userId: {user_id}")
            return jsonify({'message': 'No face detected', 'faces_detected': 0, 'userId': user_id}), 200

        # Extraction du premier visage détecté
        x, y, w, h = faces[0]
        face_roi = image[y:y + h, x:x + w]

        # Prétraitement de l’image pour le modèle
        face_pil = Image.fromarray(cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB))
        face_pil = face_pil.resize((48, 48))  # Adapter à la taille attendue par le modèle
        face_gray = face_pil.convert("L")  # Convertir en niveaux de gris si nécessaire
        face_array = np.array(face_gray) / 255.0  # Normaliser entre 0 et 1
        face_array = np.expand_dims(face_array, axis=0)  # Ajouter une dimension batch
        face_array = np.expand_dims(face_array, axis=-1)  # Ajouter une dimension canal

        # Passage au modèle pour prédiction
        predictions = model.predict(face_array)
        scores = predictions[0]

        # Obtention de l’émotion dominante et de sa confiance (accuracy)
        top_emotion_index = np.argmax(scores)
        top_emotion = EMOTIONS[top_emotion_index]
        accuracy = float(scores[top_emotion_index])  

        emotion_history.append(top_emotion)
        most_common_emotion = max(set(emotion_history), key=emotion_history.count)
        if emotion_history.count(most_common_emotion) >= 6:
            save_to_mongo(user_id, most_common_emotion, accuracy)

        if accuracy > 0.8:
            current_time = time.time()
            if top_emotion in emotion_tracker:
                start_time = emotion_tracker[top_emotion]
                duration = current_time - start_time
                if duration >= 5:  
                    print(f"📌 Emotion stable détectée : {top_emotion} ({accuracy:.2f}) pendant {duration:.1f}s")
                    del emotion_tracker[top_emotion]
                    save_to_mongo(user_id, top_emotion, accuracy)
            else:
                emotion_tracker[top_emotion] = current_time  

        return jsonify({
            'userId': user_id,  
            'emotion': top_emotion,
            'accuracy': accuracy,
            'all_emotions': {EMOTIONS[i]: float(scores[i]) for i in range(len(EMOTIONS))},
            'faces_detected': len(faces),
            'face_location': {'x': int(x), 'y': int(y), 'width': int(w), 'height': int(h)}
        })

    except Exception as e:
        print(f"❌ Erreur : {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
