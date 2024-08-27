const { FirebaseApp, initializeApp } = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const firebaseConfig = {
    // Replace with your Firebase project configuration
    apiKey: "AIzaSyAUQ_EtdUsA6H3hBiOwpcDiEYwCEgFDe0Q",
    authDomain: "freshiouzneeladri-8db85.firebaseapp.com",
    projectId: "freshiouzneeladri-8db85",
    storageBucket: "freshiouzneeladri-8db85.appspot.com",
    messagingSenderId: "426283899530",
    appId: "1:426283899530:web:b135397973162b398e2b73",
};

// Initialize Firebase app
initializeApp(firebaseConfig);

const db = getFirestore();

exports.onRequest = async (request, response) => {
    if (request.method === 'POST') {
        const data = JSON.parse(request.body);

        try {
            const docRef = await db.collection('products').add(data);
            response.status(200).send('Product added successfully');
        } catch (error) {
            response.status(500).send('Failed to add product');
        }
    } else if (request.method === 'PUT') {
        const data = JSON.parse(request.body);
        const id = data.id;

        try {
            const docRef = await db.collection('products').doc(id).update(data);
            response.status(200).send('Product updated successfully');
        } catch (error) {
            response.status(500).send('Failed to update product');
        }
    } else {
        response.status(405).send('Method not allowed');
    }
};