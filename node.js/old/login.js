
// IMPORTS
const conf = require('../../serverSettings.json');
const router = require('../../router');
const controller = require('../controllers/login');

var login = {};
login.path = 'login';

// CONSTANTS

// PUBLIC

login.init = () =>  {
    console.log(login.path, ' init');

    router.bind(`/${login.path}`, conf.POST, controller.login);
    router.bind(`/`, conf.GET, controller.login);
}

module.exports = login;

