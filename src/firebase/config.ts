import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Variáveis vindas do .env — nunca commitar valores reais
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

function isConfigValid(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

export const app = isConfigValid() ? initializeApp(firebaseConfig) : null;

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

export function assertDb() {
  if (!db) {
    throw new Error(
      "Firebase não configurado. Preencha o arquivo .env com as credenciais do seu projeto (veja .env.example)."
    );
  }
  return db;
}

export function assertAuth() {
  if (!auth) {
    throw new Error(
      "Firebase Auth não configurado. Verifique o .env e se o projeto inicializou corretamente."
    );
  }
  return auth;
}
