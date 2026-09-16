const { Router } = require('express');
const { listarCanchas } = require('../controllers/canchas.controller');

const router = Router();

router.get('/', listarCanchas);

module.exports = router;

