import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
admin.initializeApp();

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch.default(APP_ID, ADMIN_KEY);
const index = client.initIndex('users_search');

exports.addToAlgolia = functions.firestore.document('Users/{userId}').onCreate( snap => {
  console.log(snap.data())
  const data = snap.data();
  const objectID = snap.id;

  return index.saveObject({...data, objectID});

})

exports.updateAlgolia = functions.firestore.document('Users/{userId}').onUpdate( change => {
  const newData = change.after.data();
  const objectID = change.after.id;
  return index.saveObject({...newData, objectID});
});

exports.removeUserDataOnDelete = functions.auth.user().onDelete(async (user) => {
  const userDoc = admin.firestore().doc(`Users/${user.uid}`)
  // deleteing userdoc all subcollections
  await userDoc.listCollections()
  .then(collections => {collections.forEach(async collection => {
      const docs = await collection.listDocuments();
      docs.forEach(doc => doc.delete());
    })
  })
  // delete userDoc
  await userDoc.delete();
  await admin.firestore().doc(`last_logout/${user.uid}`).delete();
  return index.deleteObject(user.uid);
});




