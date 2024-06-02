// backend/src/routes/auth.ts
import express from 'express';
import { verifyToken } from '../firebase';
//import { auth } from '../firebase'; probably remove

const router = express.Router();

//test route
router.post('/sign-in', /* verifyToken, */ (req, res) => {
  console.log('Received a request to /sign-in');
  const { email, password } = req.body;

  try {
    // Simulate successful response for testing
    const user = { email, password, id: 'test-user-id' }; // Mock user data
    res.status(200).send({ message: 'User signed in successfully', user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(400).send({ message: 'Unknown error occurred' });
    }
  }
});


// Example protected route that requires authentication
// router.post('/sign-in', verifyToken, async (req, res) => {
//   console.log('Received a request to /sign-in');
//   const user = (req as any).user; // The decoded token is attached to req.user by verifyToken middleware

//   try {
//     // If token is verified, send success response with user info
//     res.status(200).send({ message: 'User signed in successfully', user });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(400).send({ message: error.message });
//     } else {
//       res.status(400).send({ message: 'Unknown error occurred' });
//     }
//   }
// });



export default router;
