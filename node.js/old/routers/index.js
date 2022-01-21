const express = require('express');
const conf = require('../../serverSettings.json');
const router = express.Router()
const fs = require('fs');

const remove_exension = (filename) => {
    return filename.split('.').shift();
}

fs.readdirSync(__dirname).filter((filename) => {
    let name = remove_exension(filename)
    let skip = ['index', 'TSQL'].includes(name)
    if(!skip) {
        console.log('ROUTE ==> ', name);
        router.use(`/${name}`, require(`./${name}`))
    }
})
const path = require('path');
const app_dir = path.dirname(require.main.filename);
// router.get('*', (req, res) => {
//     let filePath = path.join(app_dir, conf.public_path, conf.templates_path, req.url);
//     console.log('URL:', filePath);
//     res.sendFile(filePath);
//     // res.status(404);
//     // res.send(conf.ERROR_404)
// })

module.exports = router