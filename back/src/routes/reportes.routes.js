const { Router } = require('express');
const { recaudacionPorCancha } = require('../controllers/reportesController');

const router = Router();

router.get('/recaudacion', recaudacionPorCancha);

module.exports = router;
