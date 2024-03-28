const express = require('express')
const route = express.Router()
const controllers = require('../controllers/index')

route.get('/', controllers.homepage)

module.exports = route