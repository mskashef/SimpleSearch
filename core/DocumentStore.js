class DocumentStore {
  #docs
  constructor() {
    this.#docs = new Map();
  }

  add(doc) {
    this.#docs.set(doc.getDocId() + '', doc);
  }
  getAll() {
    return this.#docs.values();
  }
  get(id) {
    return this.#docs.get(id + '');
  }
}
module.exports = DocumentStore;