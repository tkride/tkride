
// IMPORTS

const conf = require('../../serverSettings.json');
const router = require('../../router');
const controller = require('../controllers/TSQL/TSQL');

// PROPERTIES

var TSQL = {};
TSQL.path = 'tsql';

// PUBLIC

TSQL.init = () => {
    console.log(TSQL.path, ' init');
    router.bind(`/${TSQL.path}`, conf.POST, controller.test);
}

module.exports = TSQL;