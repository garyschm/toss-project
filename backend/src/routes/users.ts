import admin from 'firebase-admin';
import { Router } from 'express';
import { db } from '../firebase'; // Import Firestore instance

const router = Router();

// Create a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await db.collection('users').add({
      username,
      email,
      password, // In a real-world app, make sure to hash passwords before storing them
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).send({ message: 'User registered successfully', id: newUser.id });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: 'Error creating user', error: error.message });
    } else {
      res.status(500).send({ message: 'Unknown error' });
    }
  }
});

// Read a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send(userDoc.data());
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: 'Error fetching user', error: error.message });
    } else {
      res.status(500).send({ message: 'Unknown error' });
    }
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, username, password } = req.body;
  try {
    await db.collection('users').doc(id).update({
      email,
      username,
      password, // In a real-world app, handle password hashing before updating
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: 'Error updating user', error: error.message });
    } else {
      res.status(500).send({ message: 'Unknown error' });
    }
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('users').doc(id).delete();
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: 'Error deleting user', error: error.message });
    } else {
      res.status(500).send({ message: 'Unknown error' });
    }
  }
});

export default router;
