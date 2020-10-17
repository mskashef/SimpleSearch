class PostingList {
  #docIds
  #universe
  constructor(store, initialValues = []) {
    this.#docIds = new Set(initialValues);
    this.#universe = store
  }

  getDocIds() {
    return this.#docIds;
  }

  add(id) {
    this.#docIds.add(id);
  }

  sort() {
    this.#docIds = new Set([...this.#docIds].sort());
  }

  size() {
    return this.#docIds.size;
  }

  isEmpty() {
    return this.#docIds.size === 0;
  }

  getDocIds() {
    return this.#docIds;
  }

  and(other) {
    const currentDocIds = this.getDocIds();
    return new PostingList(
      this.#universe,
      [...currentDocIds].filter(x => other.getDocIds().has(x))
    );
  }

  or(other) {
    const currentDocIds = [...this.getDocIds()];
    const otherDocIds = [...other.getDocIds()];
    const res = new PostingList(this.#universe);
    let i = 0, j = 0;
    while (i < currentDocIds.length && j < otherDocIds.length) {
      if (currentDocIds[i] === otherDocIds[j]) {
        res.add(currentDocIds[i]);
        [i, j] = [i + 1, j + 1]
      } else if (currentDocIds[i] < otherDocIds[j]) {
        res.add(currentDocIds[i++]);
      } else {
        res.add(otherDocIds[j++])
      }
    }
    while (i < currentDocIds.length)
      res.add(currentDocIds[i++])

    while (j < otherDocIds.length)
      res.add(otherDocIds[j++])

    return res;

    // return new PostingList(
    //   this.#universe,
    //   [...other.getDocIds(), ...currentDocIds].sort(),
    // );
  }

  not() {
    const currentDocIds = this.getDocIds();
    const universeDocIds = Array.from(this.#universe.getAll()).map(doc => doc.getDocId());
    return new PostingList(
      this.#universe,
      [...universeDocIds].filter(x => !currentDocIds.has(x))
    );
  }

  toString() {
    return `[${[...this.getDocIds()]}]`;
  }
}
module.exports = PostingList;