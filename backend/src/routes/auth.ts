// backend/src/routes/auth.ts
import express from 'express';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const router = express.Router();

// // Sign-up route
// router.post('/sign-up', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
//     res.status(201).send({ message: 'User created', user });
//   } catch (error) {
//     res.status(400).send({ message: 'Error creating user', error });
//   }
// });

// Sign-in route
router.post('/sign-in', async (req, res) => {
  console.log('Received a request to /sign-in');
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    res.status(200).send({ message: 'User signed in successfully', user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(400).send({ message: 'Unknown error occurred' });
    }
  }
});

export default router;
