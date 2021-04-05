class Node {
  constructor (data, key = null) {
    this.data = data
    this.key = key

    /**
     * @type { Node }
     */
    this.prev = null
    /**
     * @type { Node }
     */
    this.next = null
  }
}

module.exports = Node
