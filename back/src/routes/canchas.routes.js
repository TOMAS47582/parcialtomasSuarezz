const { Router } = require('express');
const { listarCanchas } = require('../controllers/canchasController');

const router = Router();

router.get('/', listarCanchas);

module.exports = router;

