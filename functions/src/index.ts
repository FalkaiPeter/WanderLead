import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algolia from 'algoliasearch';
admin.initializeApp();

const env = functions.config();
const client = algolia.default(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('Users');


exports.initUserInFirestore = functions.auth.user().onCreate( (user, context) => {
  const userData = { uid: user.uid, photoURL: user.photoURL};
  return admin.firestore()
  .doc(`Users/${user.uid}`)
  .set(
    user.uid === null ?
    {userData} :
    {...userData, displayName: user.displayName}, {merge: true} );
} );


exports.indexUserOnAlgolia = functions.firestore
.document('Users/{documentId}')
.onCreate( (snap, context) => {
  const data = snap.data();
  const objectId = snap.id;

  return index.saveObject({objectId, ...data});
})


exports.removeUserDataOnDelete = functions.auth.user().onDelete(async (user, context) => {
  // ref to userDoc
  const userDoc = admin.firestore().doc(`Users/${user.uid}`)
  // deleteing userdoc all subcollections
  await userDoc.listCollections()
  .then(collections => {
    collections
    .forEach(async collection => {
      const docs = await collection.listDocuments();
      docs
      .forEach(doc => doc.delete());
    })
  })
  // delete userDoc
  await userDoc.delete();
  // remove user index from algolia
  return index.deleteObject(user.uid);



})

