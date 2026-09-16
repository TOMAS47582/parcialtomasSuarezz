function mapSqlError(err) {
  const numero = err?.number;

  if (numero === 50002) {
    return { status: 404, mensaje: err.message };
  }

  if (typeof numero === 'number' && numero >= 50000 && numero < 60000) {
    return { status: 400, mensaje: err.message };
  }

  return { status: 500, mensaje: 'Error interno del servidor.' };
}

module.exports = mapSqlError;