var CryptoJS = require("crypto-js");

const key  = "cr#007";
module.exports = {
    encrypt(text){
        var ciphertext = CryptoJS.AES.encrypt(text, key).toString();
        return ciphertext;
    },
    decrypt(text){
        var bytes  = CryptoJS.AES.decrypt(text, key);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }
}