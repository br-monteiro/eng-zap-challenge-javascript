const AbstractHandler = require('./abstract-handler')
const { setData, getData } = require('../../storage')

class SetDataVivaReal extends AbstractHandler {
  /**
   * @param { InputData } data - The data object
   * @return { AbstractHandler }
   */
  handle (data) {
    try {
      let id = null
      let apikey = null
      let oldData = null

      const businessType = data.pricingInfos.businessType
      const price = Number(data.pricingInfos.price)

      const isAvailableForSale = businessType === 'SALE' && price <= 700000
      const isAvailableForRental = this.isAvailableForRental(data)
      const isAvailableToUpdate = this.isAvailableToUpdate(data)

      if (
        isAvailableToUpdate &&
        (isAvailableForRental || isAvailableForSale)
      ) {
        apikey = 'viva-real'
        oldData = getData(apikey, data.id)

        id = setData(apikey, data)
      }

      return super.handle(data, apikey, id, oldData)
    } catch (error) {
      return super.handle(data)
    }
  }

  /**
   * Check if the data is available for rental
   * @param { InputData } data
   * @returns { boolean }
   */
  isAvailableForRental (data) {
    const businessType = data.pricingInfos.businessType
    const monthlyCondoFee = Number(data.pricingInfos.monthlyCondoFee)
    let rentalTotalPrice = Number(data.pricingInfos.rentalTotalPrice)

    if (
      businessType !== 'RENTAL' ||
      isNaN(monthlyCondoFee) ||
      isNaN(rentalTotalPrice)
    ) {
      return false
    }

    const lat = data.address.geoLocation.location.lat
    const lon = data.address.geoLocation.location.lon

    rentalTotalPrice = this.isBoundingBoxZap(lat, lon) ? rentalTotalPrice * 1.5 : rentalTotalPrice

    return rentalTotalPrice <= 4000 &&
      monthlyCondoFee < (rentalTotalPrice * 0.3)
  }

  /**
   * Check if the Lat and Long is inside of Zap BoundingBox
   * @param { number } lat
   * @param { number } lon
   * @returns { boolean }
   */
  isBoundingBoxZap (lat, lon) {
    const minLat = -23.568704
    const maxLat = -23.546686
    const minLon = -46.693419
    const maxLon = -46.641146

    return (lat <= minLat && lat >= maxLat) && (lon <= minLon && lon >= maxLon)
  }
}

module.exports = SetDataVivaReal
