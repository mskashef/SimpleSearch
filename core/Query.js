const Token = require('./Token');
const { tokenize } = require('./Tokenizer');
class Query {
  #query
  #index
  #store
  constructor(query, index, store) {
    this.#query = query;
    this.#index = index;
    this.#store = store;
  }

  #convertNotToAndNot = (query) => {
    let fixed = [];
    for (const token of query) {
      if (token === 'not' && fixed.length > 0 && fixed[fixed.length - 1] !== 'and' && fixed[fixed.length - 1] !== 'or')
        fixed.push('and');
      fixed.push(token);
    }
    return fixed;
  }

  #tokenize = () => {
    const tokenized = this.#convertNotToAndNot(tokenize(this.#query));
    return tokenized.map(token => new Token(token));
  }

  #getPostfixQuery = () => {
    let s = [], result = [], tokens = this.#tokenize();
    for (const token of tokens) {
      if (token.type === 'operator') {
        if (s.length > 0 && (token.priority > s[s.length - 1].priority || token.value === 'not')) {
          s.push(token);
        } else {
          while (s.length > 0 && token.priority <= s[s.length - 1].priority)
            result.push(s.pop());
          s.push(token);
        }
      } else {
        result.push(token);
      }
    }
    while (s.length > 0) {
      result.push(s.pop());
    }
    return result;
  }

  run() {
    let postfix = this.#getPostfixQuery();

    let s = [];

    for (const token of postfix) {
      if (token.type === 'operator') {
        switch (token.value) {
          case 'not':
            var a = s.pop().postingList;
            s.push({
              token: null,
              postingList: a.not()
            });
            break;
          case 'and':
            var a = s.pop().postingList;
            var b = s.pop().postingList;
            s.push({
              token: null,
              postingList: a.and(b)
            });
            break;
          case 'or':
            var a = s.pop().postingList;
            var b = s.pop().postingList;
            s.push({
              token: null,
              postingList: a.or(b)
            });
            break;
          default:
        }
      } else {
        s.push({
          token: token,
          postingList: this.#index.get(token.value)
        });
      }
    }
    if (s.length > 1) throw new Error("Wrong Query");
    return s.pop().postingList;
  }
}
module.exports = Query;