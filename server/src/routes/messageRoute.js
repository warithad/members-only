const express = require('express')
const router = express.Router()
const message_controller = require('../controllers/messageController')

router.get('/', message_controller.messages_list_get)
router.post('/create', message_controller.message_create_post)
router.delete('/delete/:id', message_controller.message_delete)