
const express = require('express');
const conf = require('../serverSettings.json');
const path = require('path');
const app = express()
const router = express.Router()

const { load_login, load_main, process_query, login_user, process_ddbb } = require('./controllers/login');

router.get(conf.root_path, load_main)
router.get('/login', load_login)
router.post(conf.root_path, login_user)
router.post('/tsql', process_query)
router.post('/ddbb', process_ddbb)

module.exports = router

