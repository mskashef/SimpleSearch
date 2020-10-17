const fs = require('fs');
const Query = require('./Query');
const Document = require('./Document');
const DocumentStore = require('./DocumentStore');
const InvertedIndex = require('./InvertedIndx');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const docNames = ['fruits', 'animals', 'food'];
const store = new DocumentStore();
const index = new InvertedIndex('files/disk/data.csv', store);

for (const name of docNames) {
  let body = fs.readFileSync(`files/store/${name}.txt`).toString();
  let doc = new Document(name, body);
  store.add(doc);
  index.add(doc);
}

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