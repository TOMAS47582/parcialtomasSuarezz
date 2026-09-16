const { sql, getPool } = require('../config/db');
const mapSqlError = require('../utils/mapSqlError');

async function listarReservas(req, res) {
  try {
    const pool = await getPool();
    const resultado = await pool.request().execute('usp_ListarReservas');
    res.json(resultado.recordset);
  } catch (err) {
    const { status, mensaje } = mapSqlError(err);
    res.status(status).json({ error: mensaje });
  }
}

async function crearReserva(req, res) {
  const { IdCancha, Cliente, Fecha, Hora } = req.body;

  try {
    const pool = await getPool();
    const resultado = await pool
      .request()
      .input('IdCancha', sql.Int, IdCancha)
      .input('Cliente', sql.NVarChar(100), Cliente)
      .input('Fecha', sql.Date, Fecha)
      .input('Hora', sql.NVarChar(5), Hora)
      .execute('usp_CrearReserva');

    const { IdReserva } = resultado.recordset[0];
    res.status(201).json({ IdReserva, IdCancha, Cliente, Fecha, Hora, Pagada: false });
  } catch (err) {
    const { status, mensaje } = mapSqlError(err);
    res.status(status).json({ error: mensaje });
  }
}

async function registrarPago(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'El id de la reserva debe ser un número entero.' });
  }

  try {
    const pool = await getPool();
    const resultado = await pool
      .request()
      .input('IdReserva', sql.Int, id)
      .execute('usp_RegistrarPago');

    res.json(resultado.recordset[0]);
  } catch (err) {
    const { status, mensaje } = mapSqlError(err);
    res.status(status).json({ error: mensaje });
  }
}

module.exports = { listarReservas, crearReserva, registrarPago };
