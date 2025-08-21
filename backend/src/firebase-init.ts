import * as admin from 'firebase-admin';

let db: FirebaseFirestore.Firestore | undefined;

export function initFirebaseFromEnv() {
  if (admin.apps.length) return admin;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error('❌ FIREBASE_SERVICE_ACCOUNT_JSON non définie');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase initialisé depuis variable d\'environnement');
  } catch (error) {
    throw new Error('❌ Erreur parsing FIREBASE_SERVICE_ACCOUNT_JSON: ' + error.message);
  }

  db = admin.firestore();
  return admin;
}

export function getDb(): FirebaseFirestore.Firestore {
  if (!db) {
    initFirebaseFromEnv();
  }
  return db as FirebaseFirestore.Firestore;
}