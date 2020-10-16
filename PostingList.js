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
    const currentDocIds = this.getDocIds();
    return new PostingList(
      this.#universe,
      [...currentDocIds, ...other.getDocIds()]
    );
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