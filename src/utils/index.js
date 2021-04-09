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
 * Normalize string value.
 * @param { string } value
 * @returns { string }
 */
function normalizeStr (value) {
  if (!value || typeof value !== 'string') {
    return ''
  }

  return value.trim().toLocaleLowerCase()
}

module.exports = {
  buildResponsePattern,
  normalizeStr
}
