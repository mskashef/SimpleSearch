class CSV {
  /*
    params: 
      - data: a javascript array of key-value-pair objects
        - example:  [{name: 'John', age: 20}, ... ]
  */
  static encode(data) {
    if (typeof data !== 'object') return data;
    let res = '', checkStructure = this.#checkIfAllInSameStructure(data);
    if (checkStructure.ok) {
      res += checkStructure.keys + '\n';
      outer: for (const row of data) {
        let cells = [];
        for (let i = 0; i < checkStructure.keys.length; i++) {
          const key = checkStructure.keys[i];
          let cell = row[key];
          if (!cell || cell === null || cell === undefined || cell.length === 0)
            continue outer;
          cells.push(this.#encodeCell(cell));
        }
        res += `${cells}\n`;
      }
      return res;
    } else {
      throw new Error('All fields of the given data must have the same structure!');
    }
  }
  /*
    params: 
      - data: an string which is in csv format (lines separated with '\n')
        - example:  `name,age
                     Jogn,20
                     Bob,23`
  */
  static decode(data) {
    let rows = data.split(/\n/), keys = [], isFirst = true, res = [];
    outer: for (const row of rows) {
      let cells = row.split(',');
      if (isFirst) {
        keys = cells.map(cell => cell.trim());
        isFirst = false;
        continue;
      }
      let obj = {};
      for (let i = 0; i < cells.length; i++) {
        if (!cells[i] || cells[i].length === 0) continue outer;
        obj[keys[i]] = this.#decodeCell(cells[i].trim());
      }
      if (Object.keys(obj).length > 0)
        res.push(obj);
    }
    return res;
  }

  static #checkIfAllInSameStructure = (data) => {
    if (data.length === 0) return ({ ok: true, keys: [] });
    for (let i = 0; i < data.length - 1; i++) {
      let s1 = new Set(Object.keys(data[i]));
      let s2 = new Set(Object.keys(data[i + 1]));
      if (!this.#checkEquality(s1, s2))
        return ({ ok: false, keys: [] });
    }
    return { ok: true, keys: Object.keys(data[0]) };
  }

  static #encodeCell = (cell) => {
    if (cell instanceof Array)
      return `[${cell.join(' ')}]`;
    else return cell.toString();
  }

  static #decodeCell = (cell) => {
    if (!cell || cell === '' || cell == null || cell == undefined || cell.length === 0)
      return cell;
    if (cell[0] === '[' && cell[cell.length - 1] === ']')
      return cell.slice(1, cell.length - 1).split(' ');
    return cell;
  }

  static #checkEquality = (set1, set2) => {
    let a = [...set1].filter(x => !set2.has(x));
    let b = [...set2].filter(x => !set1.has(x));
    return a.length + b.length === 0;
  }
}
module.exports = CSV;