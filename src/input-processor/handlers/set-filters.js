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

    const updateFilter = this.prepareUpdateFilter(apikey, dataId)

    updateFilter('city', this.getCity(data), this.getCity(oldData))
    updateFilter('usableAreas', this.getUsableAreas(data), this.getUsableAreas(oldData))
    updateFilter('parkingSpaces', this.getParkingSpaces(data), this.getParkingSpaces(oldData))
    updateFilter('bathrooms', this.getBathrooms(data), this.getBathrooms(oldData))
    updateFilter('bedrooms', this.getBebrooms(data), this.getBebrooms(oldData))
    updateFilter('monthlyCondoFee', this.getMonthlyCondoFee(data), this.getMonthlyCondoFee(oldData))
    updateFilter('price', this.getPrice(data), this.getPrice(oldData))
    updateFilter('rentalTotalPrice', this.getRentalTotalPrice(data), this.getRentalTotalPrice(oldData))
    updateFilter('businessType', this.getBusinessType(data), this.getBusinessType(oldData))
    updateFilter('neighborhood', this.getNeighborhood(data), this.getNeighborhood(oldData))

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
   * Insert or update a filter on storage
   * @param { string } apikey - The APIKey value
   * @param { string } dataId - The ID of the data
   * @returns { (filterName:String, value:String, oldValue:String) => {} }
   */
  prepareUpdateFilter (apikey, dataId) {
    const saveFilter = this.prepareSetFilter(apikey, dataId)
    const deleteFilter = this.prepareRemoveFilter(apikey, dataId)

    return function (filterName, value, oldValue) {
      deleteFilter(filterName, oldValue)
      saveFilter(filterName, value)
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
