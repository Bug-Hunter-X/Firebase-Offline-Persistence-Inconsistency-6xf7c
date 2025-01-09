// Firebase Bug Solution

// ... (Firebase initialization code)

firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab.
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support all of the features required to enable persistence
      console.log('Persistence failed: Browser unsupported');
    } else {
      console.log('Persistence failed:', err);
    }
  });

db.collection('users').doc(userId).set({
    name: 'John Doe',
    email: 'john.doe@example.com'
  }).then(() => {
    console.log('Data written successfully!');
  }).catch((error) => {
    console.error('Error writing document: ', error);
  });

// Handle potential merge conflicts using .update instead of .set to merge values instead of overwriting
db.collection('users').doc(userId).update({
  name: 'Jane Doe' // this will update only name field
}).then(() => {
  console.log('Data updated successfully!');
}).catch((error) => {
  console.error('Error updating document: ', error);
});

// Listen for data changes to handle data synchronization
const unsub = db.collection('users').onSnapshot((querySnapshot) => {
  querySnapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      console.log('New user: ', change.doc.data());
    }
    if (change.type === 'modified') {
      console.log('Modified user: ', change.doc.data());
    }
    if (change.type === 'removed') {
      console.log('Removed user: ', change.doc.data());
    }
  });
});

// Unsubscribe from listeners when needed to prevent memory leaks
unsub();
