class Document {
  static #lastId = 1;
  name
  body
  url

  constructor(name, body, url) {
    this.name = name;
    this.body = body;
    this.url = url;
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
  getUrl() {
    return this.url
  }
  toString() {
    return `Document { docId=${this.docId}, name='${this.name}' }`;
  }
}

module.exports = Document;