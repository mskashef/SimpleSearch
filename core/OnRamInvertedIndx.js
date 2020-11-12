const PostingList = require('./PostingList');
const fs = require('fs');
const CSV = require('./CSV');
const unicode = require('./Unicoder');
const Tokenizer = require('./Tokenizer');
class OnRamInvertedIndex {

  #store
  #table

  constructor(store) {
    this.#store = store;
    this.#table = new Map();
  }
  #getBlackListRegex = () => new RegExp(`//(${['and', 'or', 'not'].join('|')})`);

  #isBadToken = token => (!token || token === undefined || token.length === 0 || token === null || token.trim() === "" || !/(\w+|[ا-ی]+)/.test(token) || this.#getBlackListRegex().test(token));

  add(doc) {
    let tokens = Tokenizer.tokenize(doc.getBody());
    let distinctTokens = new Set();
    for (const token of tokens) {
      distinctTokens.add(token.toLowerCase().trim());
    }
    for (const token of distinctTokens) {
      if (this.#isBadToken(token)) continue;
      if (!this.#table.has(token))
        this.#table.set(token, new PostingList(this.#store));
      this.#table.get(token).add(doc.getDocId());
    }
  }

  get(token) {
    let res = this.#table.get(token);
    return res ? res : new PostingList(this.#store);
  }
}

module.exports = OnRamInvertedIndex;