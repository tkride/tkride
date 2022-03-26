
const express = require('express');
const conf = require('../serverSettings.json');
const path = require('path');
const app = express()
const router = express.Router()

const { check_permissions, load_login, load_main, process_query, authenticate, process_ddbb } = require('./controllers/login');

router.get(conf.root_path, check_permissions)
router.post(conf.root_path, authenticate)
router.get('/login', load_login)
router.get('/main', load_main)
router.post('/tsql', process_query)
router.post('/ddbb', process_ddbb)

module.exports = router

