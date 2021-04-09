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

module.exports = {
  buildResponsePattern,
  normalizeStr,
  jsonParse
}
