import * as admin from 'firebase-admin';

let db: FirebaseFirestore.Firestore | undefined;

export function initFirebaseFromEnv() {
  if (admin.apps.length) {
    console.log('🔄 Firebase déjà initialisé');
    return admin;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error('❌ FIREBASE_SERVICE_ACCOUNT_JSON non définie');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    console.log('🔧 Initialisation Firebase avec project_id:', serviceAccount.project_id);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialisé avec succès');
  } catch (error) {
    console.error('❌ Erreur initialisation Firebase:', error.message);
    throw error;
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