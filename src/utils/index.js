/**
 * @param { 'success' | 'error' } status
 * @param { string } message
 * @param { Object } data
 * @returns { ResponsePattern }
 */
function buildResponsePattern (status, message = '', data = {}) {
  if (
    status !== 'success' &&
    status !== 'error'
  ) {
    throw new Error('The status must be one of "success" or "error"')
  }

  return {
    ...data,
    status,
    message
  }
}

/**
 * Normalize string value. If the value if not a valid string, then returns the same value
 * @param { string } value
 * @returns { string }
 */
function normalizeStr (value) {
  if (!value || typeof value !== 'string') {
    return value
  }

  return value.trim().toLocaleLowerCase()
}

/**
 * Parses a JSON string, constructing the JavaScript value or
 * object described by the string
 * @param { string } str - The JSON string
 * @param { * } fallback - The value returned in fail case
 * @returns { * } - The JSON string parsed or fallback value
 */
function jsonParse (str, fallback) {
  if (str === null) return fallback

  try {
    return JSON.parse(str)
  } catch (_) {
    return fallback
  }
}

/**
 * Returns the intersection of two sets
 * @param { Set } setA - Set Object
 * @param { Set } setB - Set Object
 * @returns { Set }
 */
function intersection (setA, setB) {
  const intersect = new Set()

  for (const elem of setB) {
    if (setA.has(elem)) {
      intersect.add(elem)
    }
  }

  return intersect
}

/**
 * Split a array in chunks with same size
 * @param { Array } arr - The array to be splited
 * @param { number } chunkSize - The size of the chunks
 * @param { number } [untilPart] - The part that stop the split process
 * @returns { Array<Array> }
 */
function chunkArray (arr, chunkSize, untilPart = null) {
  if (!Array.isArray(arr)) {
    throw new Error('The input is not an Array')
  }

  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error('The value of chunk size must be a integer more than zero')
  }

  if (untilPart !== null && (!Number.isInteger(untilPart) || untilPart <= 0)) {
    throw new Error('The value of untilPart must be a integer more than zero')
  }

  const chunks = []
  const arrClone = [...arr] // clone array

  while (arrClone.length) {
    if (untilPart !== null && chunks.length === untilPart) {
      break
    }

    chunks.push(arrClone.splice(0, chunkSize))
  }

  return chunks
}

module.exports = {
  buildResponsePattern,
  normalizeStr,
  jsonParse,
  intersection,
  chunkArray
}
