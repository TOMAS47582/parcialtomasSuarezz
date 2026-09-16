const { Router } = require('express');
const { recaudacionPorCancha } = require('../controllers/reportes.controller');

const router = Router();

router.get('/recaudacion', recaudacionPorCancha);

module.exports = router;
