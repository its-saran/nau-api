import fs from 'fs';
import firestore from '../database/firestore-utils.js'

const utils = {
    waitFor: function(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    },
    saveJSON: function(data, filename) {
        const dir = 'jobs';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Write JSON data to file
        const jsonData = JSON.stringify(data, null, 2);

        fs.writeFile(`${dir}/${filename}`, jsonData, 'utf8', (err) => {
            if (err) {
            console.error('An error occurred while writing JSON file:', err);
            } else {
            console.log('JSON file has been created:', `${dir}/${filename}`);
            }
        });
    },
    saveFirestore: function(collectionName, rawData) {
        firestore.addData(collectionName, rawData);
    }
}

export default utils;




