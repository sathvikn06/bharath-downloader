const archiver = require('archiver');
try {
  const archive = new archiver.ZipArchive();
  console.log("ZipArchive created!");
} catch(e) { console.log("ZipArchive error", e.message); }
