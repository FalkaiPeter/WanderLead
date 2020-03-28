import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algolia from 'algoliasearch';
admin.initializeApp();

const env = functions.config();
const client = algolia.default(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('Users');
const basicPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/wanderlead-fcd29.appspot.com/o/blank-profile-picture.svg?alt=media&token=ef42ff39-cbf8-4cf8-8b3a-6c45fbc0a2a2';

exports.initUserInFirestore = functions.auth.user().onCreate( (user, context) => {
  const userData = { uid: user.uid, photoURL: basicPhotoURL};
  admin.firestore().doc(`Users/${user.uid}/other/private`).set({email:user.email});
  admin.firestore().doc(`Users/${user.uid}/other/public`).set(userData, {merge:true});
  return admin.firestore()
  .doc(`Users/${user.uid}`)
  .set(
    /* if user sign up wia register form, they have no initial displayname on authentication
    if user have no displayName then insert only id and photoURL, cus name wil setted wia authentication service */
    user.displayName === null ?
    userData :
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

exports.lastLogout = functions.https.onRequest((req,res) => {

  admin.firestore().doc(`LogoutLogs/${req.body}`).set({lastlogout: Date.now()})
  .then( () => console.log(`${req.body} logged out! Timestamp saved to firestore`))
  .catch(error => console.log(error));
})

