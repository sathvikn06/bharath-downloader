const archiver = require('archiver');
const archive = archiver('zip');
console.log(archive ? "ZIP created" : "Failed");
