const fs = require('fs');
const readline = require('readline');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const Query = require('./Query');
const Document = require('./Document');
const DocumentStore = require('./DocumentStore');
const InvertedIndex = require('./InvertedIndx');
const OnRamInvertedIndex = require('./OnRamInvertedIndx');
const OnRamPositionalIndex = require('./OnRamPositionalIndex');
// const readline = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
const readInterface = readline.createInterface({
  input: fs.createReadStream('files/store/simple.xml'),
  output: null,
  console: false
});

// const docNames = ['alice', 'frankenstein', 'beowulf', 'pride', 'yellow'];
const store = new DocumentStore();
const index = new OnRamPositionalIndex(store);
console.log("Reading from file...")
// let xml_string = fs.readFileSync("files/store/simple.xml", "utf8");
// parser.parseString(xml_string, function (error, result) {
//   if (error === null) {
//     var startTime = (new Date()).getTime();
//     for (const doc of result.feed.doc) {
//       let d = new Document((doc.title?.toString() || ''), (doc.abstract?.toString() || ''), (doc.url?.toString() || ''));
//       store.add(d);
//       index.add(d);
//       if (d.getDocId() % 7520 == 0) {
//         console.clear();
//         console.log(`Documents count: ${result.feed.doc.length}`);
//         console.log(`Indexing... ${(d.getDocId() * 100 / result.feed.doc.length).toFixed(0)} %`);
//       }
//     }
//     console.clear();
//     console.log(`Documents count: ${result.feed.doc.length}`);
//     var endTime = (new Date()).getTime();
//     console.log(`Indexed in ${(endTime - startTime) / 1000} seconds`);
//   }
//   else {
//     console.log(error);
//   }
// });
let c = 0;
let xml = '';
let startedDoc = false;
readInterface.on('line', function (line) {
  line = line.toLocaleLowerCase().trim();

  if (line === '<doc>') {
    startedDoc = true;
    xml = line;
  }
  if (startedDoc) {
    xml += line;
  }
  if (xml.includes('</doc>')) {
    startedDoc = false;
    let body = xml.match(/\<abstract\>.*\<\/abstract\>/g);
    body = body ? body[0].replace('<abstract>', '').replace('</abstract>', '') : '';
    let name = xml.match(/\<title\>.*\<\/title\>/g);
    name = name ? name[0].replace('<title>', '').replace('</title>', '') : '';
    let url = xml.match(/\<url\>.*\<\/url\>/g);
    url = url ? url[0].replace('<url>', '').replace('</url>', '') : '';
    let doc = new Document(name, body, url);
    store.add(doc);
    index.add(doc);
    c++;
  }
  if (c % 7520 === 0) {
    console.clear();
    console.log(`Documents count: ${c}`);
    console.log(`Indexing... ${(c * 100 / 752223).toFixed(0)} %`);
  }
});


// for (const name of docNames) {
//   let body = fs.readFileSync(`files/store/${name}.txt`).toString();
//   let doc = new Document(name, body);
//   store.add(doc);
//   index.add(doc);
// }
console.log("----------- Done -----------")
module.exports = { store, index };


// function getInput() {
//   readline.question('Enter your query: ', query => {
//     if (query === 'quit') {
//       readline.close();
//       return;
//     }
//     let q = new Query(query, index, store);
//     let res;
//     let error = false;
//     try {
//       res = q.run();
//     } catch {
//       error = true;
//     }
//     if (error) {
//       console.log('405 - Wrong Query');
//     } else if (!res || res.isEmpty()) {
//       console.log('404 - Not Found!');
//     } else {
//       console.log([...res.getDocIds()]);
//       for (const docId of [...res.getDocIds()]) {
//         console.log(store.get(docId).toString());
//       }
//     }
//     console.log("---------------------------------------");
//     getInput();
//   });
// }
// getInput();