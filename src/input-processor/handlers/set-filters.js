const AbstractHandler = require('./abstract-handler')
const { setFilter, removeFilter } = require('../../storage')

class SetFilters extends AbstractHandler {
  /**
   * @param { InputData } data - The data object
   * @param { string } apikey - The APIKey value
   * @param { string } dataId - The ID of the item on storage
   * @param { InputData } oldData - The data object
   * @return { AbstractHandler }
   */
  handle (data, apikey = null, dataId = null, oldData = null) {
    if (!apikey || !dataId) {
      return super.handle(data)
    }

    const saveFilter = this.prepareSetFilter(apikey, dataId)
    const deleteFilter = this.prepareRemoveFilter(apikey, dataId)

    deleteFilter('city', this.getCity(oldData))
    saveFilter('city', this.getCity(data))

    deleteFilter('usableAreas', this.getUsableAreas(oldData))
    saveFilter('usableAreas', this.getUsableAreas(data))

    deleteFilter('parkingSpaces', this.getParkingSpaces(oldData))
    saveFilter('parkingSpaces', this.getParkingSpaces(data))

    deleteFilter('bathrooms', this.getBathrooms(oldData))
    saveFilter('bathrooms', this.getBathrooms(data))

    deleteFilter('bedrooms', this.getBebrooms(oldData))
    saveFilter('bedrooms', this.getBebrooms(data))

    deleteFilter('monthlyCondoFee', this.getMonthlyCondoFee(oldData))
    saveFilter('monthlyCondoFee', this.getMonthlyCondoFee(data))

    deleteFilter('price', this.getPrice(oldData))
    saveFilter('price', this.getPrice(data))

    deleteFilter('rentalTotalPrice', this.getRentalTotalPrice(oldData))
    saveFilter('rentalTotalPrice', this.getRentalTotalPrice(data))

    deleteFilter('businessType', this.getBusinessType(oldData))
    saveFilter('businessType', this.getBusinessType(data))

    deleteFilter('neighborhood', this.getNeighborhood(oldData))
    saveFilter('neighborhood', this.getNeighborhood(data))

    return super.handle(data)
  }

  /**
   * Retruns a function that save filter on storage
   * @param { string } apikey
   * @param { string } dataId
   * @returns { (filterName:String, filterValue:Any) => {} }
   */
  prepareSetFilter (apikey, dataId) {
    return this.abstractPrepareFilterFunctions(apikey, dataId, setFilter)
  }

  /**
   * Retruns a function that save filter on storage
   * @param { string } apikey
   * @param { string } dataId
   * @returns { (filterName:String, filterValue:Any) => {} }
   */
  prepareRemoveFilter (apikey, dataId) {
    return this.abstractPrepareFilterFunctions(apikey, dataId, removeFilter)
  }

  /**
   * Retruns a function that save filter on storage
   * @param { string } apikey
   * @param { string } dataId
   * @param { (apikey:String, filterName:String, filterName:String, filterValue:Any) => {} } fn
   * @returns { (filterName:String, filterValue:Any) => {} }
   */
  abstractPrepareFilterFunctions (apikey, dataId, fn) {
    return function (filterName, filterValue) {
      if (filterName && filterValue && typeof fn === 'function') {
        fn(apikey, filterName, dataId, filterValue)
      }
    }
  }

  /**
   * @param { InputData } data
   */
  getCity (data) {
    try {
      return data.address.city
    } catch (_) {
      return null
    }
  }

  /**
   * @param { InputData } data
   */
  getNeighborhood (data) {
    try {
      return data.address.neighborhood
    } catch (_) {
      return null
    }
  }

  /**
   * @param { InputData } data
   */
  getBusinessType (data) {
    try {
      return data.pricingInfos.businessType
    } catch (_) {
      return null
    }
  }

  /**
   * @param { InputData } data
   */
  getPrice (data) {
    try {
      return Number(data.pricingInfos.price)
    } catch (_) {
      return null
    }
  }

  /**
   * @param { InputData } data
   */
  getRentalTotalPrice (data) {
    try {
      return Number(data.pricingInfos.rentalTotalPrice)
    } catch (_) {
      return null
    }
  }

  /**
   * @param { InputData } data
   */
  getMonthlyCondoFee (data) {
    try {
      return Number(data.pricingInfos.monthlyCondoFee)
    } catch (_) {
      return null
    }
  }

  /**
   * @param { InputData } data
   */
  getUsableAreas (data) {
    try {
      return Number(data.usableAreas)
    } catch (_) {
      return null
    }
  }

  /**
   * @param { InputData } data
   */
  getParkingSpaces (data) {
    try {
      return Number(data.parkingSpaces)
    } catch (_) {
      return null
    }
  }

  /**
   * @param { InputData } data
   */
  getBathrooms (data) {
    try {
      return Number(data.bathrooms)
    } catch (_) {
      return null
    }
  }

  /**
   * @param { InputData } data
   */
  getBebrooms (data) {
    try {
      return Number(data.bedrooms)
    } catch (_) {
      return null
    }
  }
}

module.exports = SetFilters
