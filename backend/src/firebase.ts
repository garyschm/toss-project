import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';
import { ServiceAccount } from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';

// Client-side Firebase imports
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH as string;

if (!serviceAccountPath) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')) as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Client-side Firebase Initialization

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, 
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID 
}

const clientApp = initializeApp(firebaseConfig);

const auth = initializeAuth(clientApp, {
  persistence: reactNativePersistence(AsyncStorage)
});

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send('Token is missing');
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(403).send('Unauthorized');
  }
};

export { auth, verifyToken, db };
//export default verifyToken;
