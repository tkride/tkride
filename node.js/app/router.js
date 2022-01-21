
const express = require('express');
const conf = require('../serverSettings.json');
const path = require('path');
const app = express()
const router = express.Router()

const { check_permissions, load_login, load_main, process_query, authenticate } = require('./controllers/login');

router.get(conf.root_path, check_permissions)
router.post(conf.root_path, authenticate)
router.get('/login', load_login)
router.get('/main', load_main)
router.post('/tsql', process_query)

module.exports = router

