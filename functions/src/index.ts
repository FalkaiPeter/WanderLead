import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algolia from 'algoliasearch';
admin.initializeApp();

const env = functions.config();
const client = algolia.default(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('Users');
const basicPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/wanderlead-fcd29.appspot.com/o/blank-profile-picture.svg?alt=media&token=ef42ff39-cbf8-4cf8-8b3a-6c45fbc0a2a2';

exports.initUserInFirestore = functions.auth.user().onCreate( (user, context) => {
  const displayName = user.displayName;
  const photoURL = basicPhotoURL;
  const uid = user.uid;
  const email = user.email;
  const batch = admin.firestore().batch();
  const baseRef = admin.firestore().doc(`Users/${user.uid}`);
  const publicRef = admin.firestore().doc(`Users/${user.uid}/other/public`);
  const privateRef = admin.firestore().doc(`Users/${user.uid}/other/private`);
  if(user.displayName === null){
    batch.set(baseRef, {uid, photoURL}, {merge: true});
    batch.set(publicRef, {uid, photoURL, followers: 0, followings: 0, trips: 0, bio: ''}, {merge: true});
  }else {
    batch.set(baseRef, {uid, displayName, photoURL}, {merge: true});
    batch.set(publicRef, {uid, displayName, photoURL, followers: 0, followings: 0, trips: 0, bio: ''}, {merge: true});
  }
  batch.set(privateRef, {uid, email});
  return batch.commit().catch(error => console.log(error));
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

exports.lastLogout = functions.https.onRequest((req,res) => {

  admin.firestore().doc(`LogoutLogs/${req.body}`).set({lastlogout: Date.now()})
  .then( () => console.log(`${req.body} logged out! Timestamp saved to firestore`))
  .catch(error => console.log(error));
})

