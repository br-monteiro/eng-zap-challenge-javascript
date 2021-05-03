const AbstractHandler = require('./abstract-handler')
const { edinho } = require('../../config')
const { setData, getData } = require('../../storage')
const { isBoundingBoxHtr } = require('../../utils')

class SetDataEdinho extends AbstractHandler {
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

      const isAvailableForSale = businessType === 'SALE' && price <= edinho.maxSaleValue
      const isAvailableForRental = this.isAvailableForRental(data)
      const isAvailableToUpdate = this.isAvailableToUpdate(data)

      if (
        isAvailableToUpdate &&
        (isAvailableForRental || isAvailableForSale)
      ) {
        apikey = 'edinho'
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

    rentalTotalPrice = isBoundingBoxHtr(lat, lon) ? rentalTotalPrice * 1.5 : rentalTotalPrice

    return rentalTotalPrice <= edinho.maxRentalValue &&
      monthlyCondoFee < (rentalTotalPrice * 0.3)
  }
}

module.exports = SetDataEdinho
