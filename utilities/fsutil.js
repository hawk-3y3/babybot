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
},
	fsReadFile(path) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, 'utf8', function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    },
}