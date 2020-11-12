const unicode = require('./Unicoder');
class Token {
  #value
  constructor(value) {
    this.#value = value;
  }
  get value() {
    return this.#value;
  }
  get unicodeValue() {
    return unicode(this.#value);
  }
  get type() {
    return ['and', 'or', 'not'].includes(this.value) ? 'operator' : 'word';
  }
  get priority() {
    return ['and', 'or'].includes(this.value) ? 0 : 1;
  }
  toString() {
    return `${this.#value}`;
  }
}
module.exports = Token;