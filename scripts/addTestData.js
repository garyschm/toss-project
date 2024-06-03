
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '../.env' });

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set");
}

console.log(`Service Account Path: ${serviceAccountPath}`); // Log the path for debugging

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();;

const addTestData = async () => {
  
  // Add test games
  const games = [
    {
      team1: ['mWlktXPmmRePf8SuhA8H', 'm3fJMmWDR1rdVuaS6uWT'],
      team2: ['debLsXGszzI0mR0P3FbN', '94mfbx1rkcUfna9PlVy9'],
      winnerTeam: 'team1',
      team1Score: 14,
      team2Score: 12,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      team1: ['mWlktXPmmRePf8SuhA8H', 'm3fJMmWDR1rdVuaS6uWT'],
      team2: ['debLsXGszzI0mR0P3FbN', '94mfbx1rkcUfna9PlVy9'],
      winnerTeam: 'team2',
      team1Score: 10,
      team2Score: 14,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    }
  ];

  for (const game of games) {
    const res = await db.collection('games').add(game);
    console.log('Added game with ID:', res.id);
  }
};

addTestData().catch(console.error);
