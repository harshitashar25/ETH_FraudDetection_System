const crypto = require('crypto');
const fs = require('fs');

/**
 * Compute SHA-256 hash of a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} Hex string hash with 0x prefix
 */
function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve('0x' + hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * Compute SHA-256 hash from buffer
 * @param {Buffer} buffer - File buffer
 * @returns {string} Hex string hash with 0x prefix
 */
function sha256Buffer(buffer) {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return '0x' + hash.digest('hex');
}

module.exports = {
  sha256File,
  sha256Buffer
};

