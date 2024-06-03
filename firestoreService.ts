import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../toss-project/firebaseConfig';

// Function to get user data by ID
export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
  }
};

// Function to create or update user data
export const setUserData = async (userId: string, data: any) => {
  try {
    await setDoc(doc(db, 'users', userId), data, { merge: true });
    console.log('Document successfully written!');
  } catch (error) {
    console.error('Error writing document:', error);
  }
};
