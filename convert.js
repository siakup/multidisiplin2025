const postmanToOpenApi = require('postman-to-openapi');
const fs = require("fs");
const path = require("path");

const inputFile = './postman/Electricity_Bills_API.postman_collection.json';
const outputFile = './public/swagger.yaml';

// Pastikan folder public ada
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

postmanToOpenApi(inputFile, null, { output: outputFile, format: 'yaml' })
  .then(() => {
    console.log('Swagger YAML berhasil dibuat di: public/swagger.yaml');
  })
  .catch(err => {
    console.error('Gagal convert:', err);
  });
