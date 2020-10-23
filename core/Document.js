class Document {
  static #lastId = 1;
  name
  body

  constructor(name, body) {
    this.name = name;
    this.body = body;
    this.docId = Document.#lastId++ + '';
  }
  getDocId() {
    return this.docId;
  }
  getName() {
    return this.name;
  }
  getBody() {
    return this.body;
  }
  toString() {
    return `Document { docId=${this.docId}, name='${this.name}' }`;
  }
}

module.exports = Document;