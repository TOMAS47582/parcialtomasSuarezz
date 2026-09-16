require('dotenv').config();

const express = require('express');
const cors = require('cors');

const canchasRoutes = require('./routes/canchas.routes');
const reservasRoutes = require('./routes/reservas.routes');
const reportesRoutes = require('./routes/reportes.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/canchas', canchasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/reportes', reportesRoutes);


app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado.' });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

