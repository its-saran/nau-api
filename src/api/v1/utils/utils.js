import fs from 'fs';
import firestore from '../database/firestore-utils.js'
import excel from 'excel4node';

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
    },
    saveExcel: function(data, fileName) {
        console.log('Creating excel file')
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        const dir = 'jobs';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

         const headers = Object.keys(data[0]);
      
        headers.forEach((header, index) => {
          worksheet.cell(1, index + 1).string(header);
        });
      
        data.forEach((obj, rowIndex) => {
          headers.forEach((header, colIndex) => {
            const value = obj[header] || '';
            worksheet.cell(rowIndex + 2, colIndex + 1).string(value.toString());
          });
        });

        const filePath = `${dir}/${fileName}.xlsx`;
        workbook.write(filePath);
        console.log(`Excel file saved at ${filePath}`);
    }
    
}

export default utils;




