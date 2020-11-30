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
    const tokenized = tokenize(this.#query);
    let newTokens = [];
    for (let i = 0; i < tokenized.length; i++) {
      if (i > 0 && new Token(tokenized[i]).type !== 'operator' && new Token(tokenized[i - 1]).type !== 'operator')
        newTokens.push('\\1');
      newTokens.push(tokenized[i]);
    }
    return newTokens.map(token => new Token(token));
  }

  #getPostfixQuery = () => {
    let s = [], result = [], tokens = this.#tokenize();
    for (const token of tokens) {
      if (token.type === 'operator') {
        if (s.length > 0 && (token.priority > s[s.length - 1].priority || token.value[0] === '\\')) {
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

  and(a, b) {
    a = [...new Set(a.map(arr => parseInt(arr.docId)))]
    b = [...new Set(b.map(arr => parseInt(arr.docId)))]
    let res = new Set(), i = 0, j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) {
        res.add({ docId: a[i], positions: new Set() });
        i++; j++;
      } else if (a[i] < b[j]) {
        i++;
      } else {
        j++;
      }
    }
    return [...res];
  }

  near(a, b, k) {
    let answer = [];
    let i = 0, j = 0;
    a = a.map(o => ({ docId: parseInt(o.docId), positions: [...o.positions] }));
    b = b.map(o => ({ docId: parseInt(o.docId), positions: [...o.positions] }));
    while (i !== a.length && j !== b.length) {
      if (a[i].docId === b[j].docId) {
        let l = [];
        let pp1 = [...a[i].positions];
        let pp2 = [...b[j].positions];
        let ii = 0, jj = 0;
        while (ii !== pp1.length) {
          while (jj !== pp2.length) {
            if (Math.abs(pp1[ii] - pp2[jj]) <= k) l.push(pp2[jj])
            else if (pp2[jj] > pp1[ii]) break;
            jj++;
          }
          while (l !== [] && Math.abs(l[0] - pp1[ii]) > k) l.unshift();
          for (let ps of l) answer.push({ docId: a[i].docId, positions: [pp1[ii], ps] })
          ii++;
        }
        i++; j++;
      } else if (a[i].docId < b[j].docId) i++;
      else j++;
    }
    return answer;
  }

  run() {
    let postfix = this.#getPostfixQuery();
    let s = [];

    for (const token of postfix) {
      if (token.type === 'operator') {
        if (token.value === 'and' || token.value === 'و') {
          var a = s.pop();
          var b = s.pop();
          s.push(this.and(a, b));
        } else if (token.value[0] === '\\') {
          let k = parseInt(token.value.replace('\\', ''));
          var a = s.pop();
          var b = s.pop();
          s.push(this.near(a, b, k));
        }
      } else {
        s.push(this.#index.get(token.value));
      }
    }
    if (s.length > 1) throw new Error("Wrong Query");
    return s.pop();
  }
}
module.exports = Query;