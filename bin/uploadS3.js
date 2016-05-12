'use strict';

const fs = require('fs');

let filename = process.argv[2] || '';

const readFile = (filename) =>
  new Promise ((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const awsS3UploadOptions = {
  ACL: 'public-read',
  Body: '',
  Bucket: 'susandaiute',
  ContentType: 'application/octet-stream',
  Key: 'test/test.bin'
};

readFile(filename)
.then((data) =>
console.log(`${filename} is ${data.length} bytes long`))
.catch(console.error);
