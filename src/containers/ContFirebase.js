/* ---------------------- MODULOS IMPORTADOS ------------------------ */
import admin from 'firebase-admin';
import config from '../config.js';
import moment from 'moment';

admin.initializeApp({
  credential: admin.credential.cert(config.firebase)
});

const firebaseDB = admin.firestore();

/* ------------------------ CLASE CONTENEDOR ------------------------ */
class ContFirebase {
    constructor(collectionName) {
        this.collection = firebaseDB.collection(collectionName);
    }

    async getAll() {
        try {
            const objects = []
            const snapshot = await this.collection.get();

            snapshot.forEach(doc => {
                objects.push({ id: doc.id, ...doc.data() })
            })

            return objects;
        } catch (error) {
            throw new Error(`getAll() error: ${error}`);
        }
    }

    async save(obj) {
        try {
            const saved = await this.collection.add({ ...obj, timestamp: moment().format('DD/MM/YY HH:mm:ss') });
            return saved.id;
        } catch (error) {
            throw new Error(`save(obj) error: ${error}`);
        }
    }
        
}

/* ---------------------- MODULOS EXPORTADOS ------------------------ */
export default ContFirebase;