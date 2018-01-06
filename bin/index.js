#! /usr/bin/env node

const pathToFile = process.argv[2],
      password = process.argv[3],
      workingDir = process.argv[4];

if (!pathToFile || !password || !workingDir) {
  console.log("Please, specify path to .jks file, password and path to a working directory.");
  console.log("Example:");
  console.log("  jks-key-extractor /path/to/file.jks my_password /tmp/working_dir");
  return; 
}

const path = require('path'),
      fs = require('fs'),
      jksreader = require('jksreader');

if (!fs.existsSync(workingDir)){
  fs.mkdirSync(workingDir);
}

var contents = fs.readFileSync(pathToFile),
    parsedContent = jksreader.parse(contents),
    key = jksreader.decode(parsedContent.material[0].key, password);

var keyPath = path.join(workingDir, 'key.der');
fs.writeFileSync(keyPath, key);
console.log("Written file: " + keyPath);

for (var i = 0; i < parsedContent.material[0].certs.length; i++) {
  var cert = parsedContent.material[0].certs[i],
      certPath = path.join(workingDir, 'cert' + i + '.der');

  fs.writeFileSync(certPath, cert);
  console.log("Written file: " + certPath);
}
