const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.betted = functions.database.ref('/lots/{lotId}/bets/{betId}').onWrite(event => {
    const bet = event.data.val();
    console.log(event.data.key + " поставил ставку " + bet + " сом в " + Date());
})