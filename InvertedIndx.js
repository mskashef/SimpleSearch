const PostingList = require('./PostingList');
const fs = require('fs');
const CSV = require('./CSV');
class InvertedIndex {

  #path
  #store

  constructor(path, store) {
    this.#path = path;
    this.#store = store;
  }

  saveOnDisk(table) {
    let res = [];
    for (const key of table.keys()) {
      res.push({
        word: key,
        docIds: [...table.get(key).getDocIds()]
      })
    }
    fs.writeFileSync(this.#path, CSV.encode(res));
  }

  readFromDisk() {
    let csv = fs.readFileSync(this.#path, { encoding: 'utf8' });
    let readData = CSV.decode(csv), res = new Map();
    for (const item of readData)
      res.set(item.word, new PostingList(this.#store, item.docIds));
    return res;
  }

  add(doc) {
    let tokens = doc.getBody().split(/\s+/);
    let distinctTokens = new Set();
    for (const token of tokens) {
      distinctTokens.add(token.toLowerCase());
    }
    let table = this.readFromDisk();
    for (const token of distinctTokens) {
      if (!table.has(token))
        table.set(token, new PostingList(this.#store));
      table.get(token).add(doc.getDocId());
    }
    for (const list of table.values()) {
      list.sort();
    }
    this.saveOnDisk(table);
    this.readFromDisk();
  }

  get(token) {
    let res = this.readFromDisk();
    res = res.get(token);
    return res ? res : new PostingList(this.#store);
  }
}

module.exports = InvertedIndex;