const admin = require("firebase-admin");
const fs = require('fs').promises;
class CloudStorage  {
    constructor(){
        this.bucket = admin.storage().bucket();
    }
    
    async uploadFile(filename) {
        console.log("uploading file: " + filename)
        try {
            this.bucket.upload(filename, function (err) {
                if (err) {
                    console.log(err)
                }
            });
        }
        catch (err) {
            console.log(err);
            throw err
        }
    }

    async getFileByName(filename) {
        try {
            const file = this.bucket.file(filename);
            if (file) {
                let response = await file.getSignedUrl({
                    action: 'read',
                    expires: '06-09-2420'
                });
                return response[0];
            } else {
                return null;
            }
        }
        catch (err) {
            console.log(err);
            throw (err);
        }
    }
}

module.exports = CloudStorage;