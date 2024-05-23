const { Firestore } = require('@google-cloud/firestore');
 
async function storeData(id, data) {
  const db = new Firestore();
 
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

async function getHistories() {
  const db = new Firestore();
  const predictionsCollection = db.collection('predictions');
  const snapshot = await predictionsCollection.get();
  const predictions = [];

  snapshot.forEach(doc => {
    predictions.push({ id: doc.id, ...doc.data() });
  });

  return predictions;
}
 
module.exports = { storeData, getHistories }
