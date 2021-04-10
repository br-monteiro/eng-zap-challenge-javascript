/**
 * @typedef { 'info' | 'warning' | 'error' | 'debug' } LogType
 */

/**
 * @typedef ResponsePattern
 * @property { string } message
 * @property { 'success' | 'error' } status
 */

/**
 * @typedef InputData
 * @property { string } id
 * @property { number } usableAreas
 * @property { string } listingType
 * @property { string } createdAt
 * @property { string } updatedAt
 * @property { string } listingStatus
 * @property { number } parkingSpaces
 * @property { number } bathrooms
 * @property { boolean } owner
 * @property { Array<String> } images
 * @property { InputDataAddress } address
 * @property { InputDataPricing } pricingInfos
 */

/**
 * @typedef InputDataAddress
 * @property { string } city
 * @property { string } neighborhood
 * @property { InputDataAddressGeoLocation } geoLocation
 */

/**
 * @typedef InputDataAddressGeoLocation
 * @property { string } precision
 * @property { InputDataAddressGeoLocationLocation } location
 */

/**
 * @typedef InputDataAddressGeoLocationLocation
 * @property { number } lon
 * @property { number } lat
 */

/**
 * @typedef InputDataPricing
 * @property { string } [period]
 * @property { string } yearlyIptu
 * @property { string } price
 * @property { string } [rentalTotalPrice]
 * @property { 'RENTAL' | 'SALE' } businessType
 * @property { string } monthlyCondoFee
 */

/**
 * @typedef DataStorage
 * @property { object } storage
 * @property { object } filters
 * @property { import('../lru-cache') } cache
 */

/**
 * @typedef FilterDetail
 * @property { string } key
 * @property { string } value
 */
