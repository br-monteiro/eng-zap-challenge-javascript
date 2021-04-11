const logger = require('../logger')('lru-cache/lru-cache')
const Node = require('./node')

class LRUCache {
  /**
   * @param { number } capacity
   */
  constructor (capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      logger.error('The capacity must be a positive integer more than zero')

      throw new Error('The capacity must be a positive integer more than zero')
    }

    this.capacity = capacity
    this.size = 0
    /**
     * @type { Node }
     */
    this.head = null

    /**
     * @type { Node }
     */
    this.tail = null
    this.map = {}
  }

  /**
   * Retuns a value from cache. Otherwise returns null
   * @param { * } key
   * @returns { * | null } - The value from cache
   */
  get (key) {
    /**
     * @type { Node }
     */
    const result = this.map[key]

    if (result === undefined) return null

    if (result === this.tail && this.size > 1) {
      this.tail = this.tail.prev
    }

    if (result === this.head) {
      return result.data
    }

    const oldHead = this.head

    this._bindNeighbor(result)

    this.head = result
    this.head.next = oldHead
    this.head.prev = null
    oldHead.prev = this.head

    return result.data
  }

  /**
   * Set a new data or update a data on chache according the "key"
   * @param { string } key - The key associated to data
   * @param { * } data - The data to be cached
   * @throws { Error } - If the key or data is undefined or null
   */
  put (key, data) {
    if (
      key === undefined ||
      key === null ||
      data === undefined ||
      data === null
    ) {
      logger.error('The "key" and "value" should be different of "undefined" of "null"')

      throw new Error('The "key" and "value" should be different of "undefined" of "null"')
    }

    /**
    * @type { Node }
    */
    const result = this._bindNeighbor(this.map[key])
    const oldHead = this.head

    if (result) {
      if (result === this.tail) {
        this.tail.prev.next = null
      }

      result.prev = null
      result.next = oldHead
      oldHead.prev = result
      this.head = result

      this.head.data = data
    } else {
      if (this._isFull()) {
        const keyOfTail = this.tail && this.tail.key
        const tailPrev = this.tail && this.tail.prev

        this.tail = tailPrev || null
        if (this.tail) this.tail.next = null

        if (keyOfTail) delete this.map[keyOfTail]
      }

      const node = new Node(data, key)

      node.next = oldHead
      if (oldHead) oldHead.prev = node

      this.head = node
      this.map[key] = node

      this._updateSize()

      if (this.size === 1) {
        this.tail = this.head
      }
    }
  }

  /**
   * Remove an item from cache and returns true, otherwise returns false
   * @param { string } key - The key associates with value
   * @returns { boolean }
   */
  remove (key) {
    if (
      key === undefined ||
      key === null
    ) {
      logger.error('The "key" should be different of "undefined" of "null"')

      throw new Error('The "key" should be different of "undefined" of "null"')
    }

    const result = this.map[key]

    if (result === undefined) {
      return false
    }

    if (
      result === this.head ||
      result === this.tail
    ) {
      if (result === this.head) {
        this.head = this.tail.next

        if (this.head) this.tail.prev = null
      }

      if (result === this.tail) {
        this.tail = this.tail.prev

        if (this.tail) this.tail.next = null
      }
    } else {
      this._bindNeighbor(result)
    }

    delete this.map[key]

    this.size -= 1

    logger.info('item removed from cache', { key, data: result.data })

    return true
  }

  /**
   * Remove all values from cache. Returns true in success case, otherwise returns false
   * @returns { boolean }
   */
  removeAll () {
    if (this.size === 0) return false

    this.head = null
    this.tail = null
    this.map = {}
    this.size = 0

    logger.info('cache cleaned')

    return true
  }

  /**
   * Bind the neighbor of node
   * @param { Node } node - The reference node
   * @returns { Node }
   */
  _bindNeighbor (node) {
    if (!node) return node

    const nodePrev = node.prev
    const nodeNext = node.next

    if (nodePrev) nodePrev.next = nodeNext
    if (nodeNext) nodeNext.prev = nodePrev

    return node
  }

  /**
   * Checks whether maximum capacity has been reached
   * @returns { boolean }
   */
  _isFull () {
    return this.size + 1 > this.capacity
  }

  /**
   * Update the size of cache according the capacity
   * @returns { number }
   */
  _updateSize () {
    this.size = this._isFull() ? this.size : this.size + 1
    return this.size
  }
}

module.exports = LRUCache
