import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import serviceAccount from '../../../../secrets/career-mapr.json' assert { type: "json" };

initializeApp({credential: cert(serviceAccount)});
const db = getFirestore();


const firestore = {
  addData: async function(collectionName, data) {
    try {
      const batch = db.batch(); // create a batch write operation
      data.forEach(item => {
        const cmId = item.cmId
        const docRef = db.collection(collectionName).doc(cmId); // use cmId as the document ID
        batch.set(docRef, item); // set the data for the new document
      });
      await batch.commit(); // commit the batch write operation
      console.log(`Added ${data.length} documents to collection "${collectionName}"`);
    } catch (error) {
      console.error("Error adding documents: ", error);
    }
  }
};


export default firestore;







// const docRef = db.collection('jobs');
// await docRef.doc('job1').set(job);


// const snapshot = await docRef.get();
// snapshot.forEach((doc) => {
//   data.push({ id: doc.id, ...doc.data() });
// });

// console.log(data)


