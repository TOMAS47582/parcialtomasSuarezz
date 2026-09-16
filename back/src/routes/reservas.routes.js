const { Router } = require('express');
const {
  listarReservas,
  crearReserva,
  registrarPago,
} = require('../controllers/reservas.controller');

const router = Router();

router.get('/', listarReservas);
router.post('/', crearReserva);
router.put('/:id/pago', registrarPago);

module.exports = router;