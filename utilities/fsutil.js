const fs = require('fs');

module.exports = {
    fsWriteFile(path, data) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(path, data, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
}
}