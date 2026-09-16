const API_URL = "http://localhost:3000/api";

const formulario = document.querySelector("#form-reserva");
const comboCanchas = document.querySelector("#cancha");
const listaReservas = document.querySelector("#lista-reservas");
const tablaRecaudacion = document.querySelector("#tabla-recaudacion");
const mensaje = document.querySelector("#mensaje");

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(valor);



async function cargarCanchas() {
  try {
    const resp = await fetch(`${API_URL}/canchas`);
    const canchas = await resp.json();

    selectCancha.innerHTML = '<option value="" disabled selected>Elegí una cancha</option>';

    canchas.forEach((cancha) => {
      const opcion = document.createElement('option');
      opcion.value = cancha.IdCancha;
      opcion.textContent = `${cancha.Nombre} - ${formateador.format(cancha.PrecioPorHora)}/h`;
      selectCancha.appendChild(opcion);
    });
  } catch (err) {
    console.error('Error cargando canchas:', err);
    selectCancha.innerHTML = '<option value="" disabled selected>No se pudieron cargar las canchas</option>';
  }
}



async function cargarReservas() {
  try {
    const resp = await fetch(`${API_URL}/reservas`);
    const reservas = await resp.json();

    if (reservas.length === 0) {
      listaReservas.innerHTML = '<p>Todavía no hay reservas cargadas.</p>';
      return;
    }

    listaReservas.innerHTML = '';

    reservas.forEach((reserva) => {
      const card = document.createElement('div');
      card.className = 'reserva-card';

      const fecha = reserva.Fecha.slice(0, 10);
      const estadoTexto = reserva.Pagada ? 'Pagada' : 'Pendiente';
      const estadoClase = reserva.Pagada ? 'pagada' : 'pendiente';

      card.innerHTML = `
        <div class="reserva-info">
          <span class="reserva-cliente">${reserva.Cliente}</span>
          <span class="reserva-detalle">${reserva.NombreCancha} · ${fecha} · ${reserva.Hora}</span>
        </div>
        <span class="estado ${estadoClase}">${estadoTexto}</span>
      `;

      if (!reserva.Pagada) {
        const boton = document.createElement('button');
        boton.className = 'btn-pago';
        boton.textContent = 'Registrar pago';
        boton.addEventListener('click', () => registrarPago(reserva.IdReserva));
        card.appendChild(boton);
      }

      listaReservas.appendChild(card);
    });
  } catch (err) {
    console.error('Error cargando reservas:', err);
    listaReservas.innerHTML = '<p>No se pudieron cargar las reservas.</p>';
  }
}

async function registrarPago(idReserva) {
  try {
    const resp = await fetch(`${API_URL}/reservas/${idReserva}/pago`, { method: 'PUT' });
    const data = await resp.json();

    if (!resp.ok) {

      console.error(`Error ${resp.status} al registrar el pago:`, data.error);
      return;
    }

    await Promise.all([cargarReservas(), cargarRecaudacion()]);
  } catch (err) {
    console.error('Error registrando el pago:', err);
  }
}



async function cargarRecaudacion() {
  try {
    const resp = await fetch(`${API_URL}/reportes/recaudacion`);
    const filas = await resp.json();

    tablaRecaudacionBody.innerHTML = '';

    filas.forEach((fila) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${fila.Nombre}</td>
        <td>${fila.CantidadReservas}</td>
        <td>${formateador.format(fila.TotalCobrado)}</td>
        <td class="pendiente-valor">${formateador.format(fila.TotalPendiente)}</td>
      `;
      tablaRecaudacionBody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error cargando la recaudación:', err);
    tablaRecaudacionBody.innerHTML = '<tr><td colspan="4">No se pudo cargar la recaudación.</td></tr>';
  }
}



formReserva.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  mensajeReserva.textContent = '';
  mensajeReserva.className = 'mensaje';

  const nuevaReserva = {
    IdCancha: Number(selectCancha.value),
    Cliente: document.getElementById('cliente').value.trim(),
    Fecha: document.getElementById('fecha').value,
    Hora: document.getElementById('hora').value,
  };

  try {
    const resp = await fetch(`${API_URL}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaReserva),
    });
    const data = await resp.json();

    if (!resp.ok) {

      mensajeReserva.textContent = data.error;
      mensajeReserva.classList.add('error');
      return;
    }

    mensajeReserva.textContent = 'Reserva creada correctamente.';
    mensajeReserva.classList.add('ok');
    formReserva.reset();

    await Promise.all([cargarReservas(), cargarRecaudacion()]);
  } catch (err) {
    console.error('Error creando la reserva:', err);
    mensajeReserva.textContent = 'No se pudo conectar con el servidor.';
    mensajeReserva.classList.add('error');
  }
});



cargarCanchas();
cargarReservas();
cargarRecaudacion();

