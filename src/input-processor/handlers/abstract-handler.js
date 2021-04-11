const { getData } = require('../../storage')
const { normalizeStr } = require('../../utils')
class AbstractHandler {
  constructor () {
    /**
     * @type { AbstractHandler }
     */
    this.nextHandler = null
  }

  /**
   * Set the next handler
   * @param { AbstractHandler } handler - The next handler to be executed
   * @return { AbstractHandler }
   */
  setNext (handler) {
    this.nextHandler = handler

    return handler
  }

  /**
   * @param { InputData } data - The data object
   * @param { string } apikey - The APIKey
   * @param { string } dataId - The id of data in storage
   * @param { InputData } oldData - The old register of the data in storage
   * @return { AbstractHandler }
   */
  handle (data, apikey = null, dataId = null, oldData = null) {
    if (this.nextHandler) {
      return this.nextHandler.handle(data, apikey, dataId, oldData)
    }

    return null
  }

  /**
   * @param { string } apikey - The APIKey value
   * @param { InputData } data - The data object
   */
  isAvailableToUpdate (apikey, data) {
    const id = normalizeStr(data && data.id)
    /**
     * @type { InputData }
     */
    const item = getData(apikey, id)

    if (item === null) return true

    return new Date(item.updatedAt) < new Date(data.updatedAt)
  }
}

module.exports = AbstractHandler
