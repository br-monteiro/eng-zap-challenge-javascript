/**
 * @param { 'success' | 'error' } status
 * @param { string } message
 * @param { Object } data
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

module.exports = {
  buildResponsePattern
}
