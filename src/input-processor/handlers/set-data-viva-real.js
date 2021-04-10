const AbstractHandler = require('./abstract-handler')
const { setData, setFilter } = require('../../storage')

class SetDataVivaReal extends AbstractHandler {
  /**
   * @param { InputData } data - The data object
   * @return { AbstractHandler }
   */
  handle (data) {
    try {
      const apikey = 'viva-real'
      const businessType = data.pricingInfos.businessType
      const rentalTotalPrice = Number(data.pricingInfos.rentalTotalPrice)
      const price = Number(data.pricingInfos.price)

      const isAvailableForSale = businessType === 'SALE' && price <= 700000
      const isAvailableForRental = this.isAvailableForRental(data)

      if ((isAvailableForRental || isAvailableForSale)) {
        const monthlyCondoFee = Number(data.pricingInfos.monthlyCondoFee)
        const usableAreas = Number(data.usableAreas)
        const parkingSpaces = Number(data.parkingSpaces)
        const bathrooms = Number(data.bathrooms)
        const bedrooms = Number(data.bedrooms)
        const id = setData(apikey, data)
        const { city, neighborhood } = data.address

        setFilter(apikey, 'businessType', id, businessType.toLocaleLowerCase())

        if (!isNaN(usableAreas)) setFilter(apikey, 'usableAreas', id, usableAreas)
        if (!isNaN(parkingSpaces)) setFilter(apikey, 'parkingSpaces', id, parkingSpaces)
        if (!isNaN(bathrooms)) setFilter(apikey, 'bathrooms', id, bathrooms)
        if (!isNaN(bedrooms)) setFilter(apikey, 'bedrooms', id, bedrooms)
        if (city) setFilter(apikey, 'city', id, city)
        if (neighborhood) setFilter(apikey, 'neighborhood', id, neighborhood)
        if (monthlyCondoFee) setFilter(apikey, 'monthlyCondoFee', id, monthlyCondoFee)

        if (isAvailableForRental) {
          setFilter(apikey, 'price', id, rentalTotalPrice)
        } else {
          setFilter(apikey, 'price', id, price)
        }
      }

      return super.handle(data)
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
    const rentalTotalPrice = Number(data.pricingInfos.rentalTotalPrice)
    const monthlyCondoFee = Number(data.pricingInfos.monthlyCondoFee)

    return businessType === 'RENTAL' &&
      rentalTotalPrice <= 4000 &&
      monthlyCondoFee > 0 &&
      monthlyCondoFee < (rentalTotalPrice * 0.3)
  }

  isBoundingBoxZap (lat, lon) {
    const minLat = -23.568704
    const maxLat = -23.546686
    const minLon = -46.693419
    const maxLon = -46.641146

    return (lat <= minLat && lat >= maxLat) && (lon <= minLon && lon >= maxLon)
  }
}

module.exports = SetDataVivaReal
