const express = require('express')
const route = express.Router()
const controllers = require('../controllers/index')

route.get('/', controllers.homepage)
route.get('/chat', controllers.chatpage)

module.exports = route