const AbstractHandler = require('./abstract-handler')

class ValidateLatLon extends AbstractHandler {
  /**
   * @param { InputData } data - The data object
   * @return { AbstractHandler }
   */
  handle (data) {
    try {
      const { geoLocation } = data.address
      const lat = geoLocation.location.lat
      const lon = geoLocation.location.lon

      if (lat === 0 || lon === 0) {
        return null
      }

      return super.handle(data)
    } catch (_) {
      return null
    }
  }
}

module.exports = ValidateLatLon
