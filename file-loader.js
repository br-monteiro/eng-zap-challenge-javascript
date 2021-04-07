const fs = require('fs')
const readline = require('readline')

/**
 * Check if the file exists
 * @param { string } filePath - The path of file
 * @return { Boolean }
 */
function fileExists (filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return false
  }

  try {
    return fs.existsSync(filePath)
  } catch (_) {
    return false
  }
}

/**
 * Create a readline interface for the file
 * @param { string } filePath - The path of file
 * @returns { readline.Interface }
 */
function creadReaderInterface (filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('The `path` must to be a valid string')
  }

  if (!fileExists(filePath)) {
    throw new Error('File not found')
  }

  return readline.createInterface({
    input: fs.createReadStream(filePath)
  })
}

const filePath = process.argv[2]
const reader = creadReaderInterface(filePath)

reader.on('line', line => {
  console.log('## -> ', line)
})
