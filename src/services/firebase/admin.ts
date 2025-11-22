import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | undefined;

function ensureAdminApp() {
  if (!adminApp) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase admin credentials.");
    }

    adminApp = getApps().length
      ? getApp()
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
  }
}

export function getFirebaseAdminApp() {
  ensureAdminApp();
  return adminApp as App;
}

export function getAdminAuth() {
  const appInstance = getFirebaseAdminApp();
  return getAuth(appInstance);
}

export function getAdminFirestore() {
  const appInstance = getFirebaseAdminApp();
  return getFirestore(appInstance);
}
