const { getPool } = require('../config/db');
const mapSqlError = require('../utils/mapSqlError');

async function recaudacionPorCancha(req, res) {
  try {
    const pool = await getPool();
    const resultado = await pool.request().execute('usp_RecaudacionPorCancha');
    res.json(resultado.recordset);
  } catch (err) {
    const { status, mensaje } = mapSqlError(err);
    res.status(status).json({ error: mensaje });
  }
}

module.exports = { recaudacionPorCancha };
