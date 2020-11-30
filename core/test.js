const Query = require('./Query');
const Document = require('./Document');
const DocumentStore = require('./DocumentStore');
const InvertedIndex = require('./InvertedIndx');
const OnRamInvertedIndex = require('./OnRamInvertedIndx');
const OnRamPositionalIndex = require('./OnRamPositionalIndex');

let index = new OnRamPositionalIndex();

index.add(new Document("doc1", "body1, is Msk ali  eaesad..sdfsdfi", "url"));
console.log(index.get('ali'));