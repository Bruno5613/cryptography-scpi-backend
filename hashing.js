const crypto = require('crypto');

const hashText = (plainText) => {
    const hash = crypto.createHash('sha512');
    hash.update(plainText);
    return hash.digest('hex')
}

module.exports = {hashText}