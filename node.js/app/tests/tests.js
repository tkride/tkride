
const conf = require('../../serverSettings.json');
const path = require('path');
const app_dir = path.dirname(require.main.filename);


const loadTests = (req, res) => {
    console.log(`----------------------- loadTests ${req.socket.remoteAddress} --------------------------`);
    let file = 'TKRide.tests.html';
    let filePath = path.join(app_dir, conf.www_path, file);
    res.sendFile(filePath);
}

module.exports = { loadTests };