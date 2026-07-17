from flask import Flask, send_from_directory
import os
import firebase_admin
from firebase_admin import credentials

# Path to the Firebase Service Account private key JSON
key_path = "serviceAccountKey.json"

if os.path.exists(key_path):
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK successfully initialized.")
else:
    print("Warning: 'serviceAccountKey.json' not found. Please copy your downloaded service account key here to connect.")

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    # Serve the app locally on port 8000
    print("Starting Flask web server on http://127.0.0.1:8000 ...")
    app.run(host='127.0.0.1', port=8000, debug=True)
