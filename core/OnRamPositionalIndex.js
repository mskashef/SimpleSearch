const PostingList = require('./PostingList');
const fs = require('fs');
const CSV = require('./CSV');
const unicode = require('./Unicoder');
const Tokenizer = require('./Tokenizer');
class OnRamPositionalIndex {

  #store
  #table
  #indexMap

  constructor(store) {
    this.#store = store;
    this.#table = new Map();
    this.#indexMap = new Map()
  }

  #getBlackListRegex = () => new RegExp(`//(${['and', 'or', 'not'].join('|')})`);

  #isBadToken = token => (!token || token === undefined || token.length === 0 || token === null || token.trim() === "" || !/(\w+|[ا-ی]+)/.test(token) || this.#getBlackListRegex().test(token));

  add(doc) {
    let tokens = Tokenizer.tokenize(doc.getBody());
    let i = 0;
    for (const token of tokens) {
      if (this.#isBadToken(token)) continue;
      if (!this.#table.has(token))
        this.#table.set(token, []);
      let cur = this.#table.get(token);

      if (!this.#indexMap.has(token))
        this.#indexMap.set(token, new Map())
      let indexMapperGet = this.#indexMap.get(token);

      if (doc.getDocId() >= cur.length) {
        cur.push({ docId: doc.getDocId(), positions: new Set() })
        if (!indexMapperGet.has(token))
          indexMapperGet.set(doc.getDocId(), cur.length - 1)
      }

      let index = this.#indexMap.get(token).get(doc.getDocId());
      let pl = this.#table.get(token)[index];
      pl.positions.add(i);
      i++;
    }
  }

  get(token) {
    let res = this.#table.get(token);
    return res ? res : [];
  }
}

module.exports = OnRamPositionalIndex;