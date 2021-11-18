var express = require('express');
var router = express.Router();
var request = require('request');
var FormData = require('form-data');
var fs = require('fs');

router.post('/', function (req, res, next) {
    fs.writeFileSync(`../public/assets/${req.files.file.name}`, JSON.stringify(req.files.file, null, 2) , 'utf-8');
    const formData = new FormData();
    formData.append('file', new File(req.files.file));
    request.post(
        'http://localhost:8080/rest/v0/analyzer',
        {form: {key: 'value'}},
        (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }

        });
});

module.exports = router;
