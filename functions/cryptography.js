const CryptoJS = require('crypto-js');

function encrypt(token) {
    return CryptoJS.AES.encrypt(token, process.env.SECRET_KEY).toString();
}

function decrypt(token) {
    return CryptoJS.AES.decrypt(token, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };