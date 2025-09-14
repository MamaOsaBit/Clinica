// Script for solicitarHora: load libres and handle booking via API
(function(){
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  const pacienteId = getQueryParam('pacienteId');
  const pacienteInput = document.getElementById('pacienteIdInput');
  if (pacienteInput && pacienteId) pacienteInput.value = pacienteId;

  async function loadLibres() {
    try {
      const res = await fetch('/api/horas/libres');
      const json = await res.json();
      const horas = json.horas || [];
      const select = document.getElementById('horasSelect');
      const freeList = document.getElementById('freeList');
      if (select) select.innerHTML = '';
      if (horas.length === 0) {
        if (select) select.innerHTML = '<option disabled>No hay horas disponibles</option>';
        if (freeList) freeList.innerHTML = '<div class="small">Sin horas medicas por ahora</div>';
        return;
      }
      if (freeList) freeList.innerHTML = '';
      horas.forEach(h => {
        if (select) {
          const opt = document.createElement('option');
          opt.value = h.id;
          opt.textContent = `${new Date(h.hora.start).toLocaleString()} - Dr. ${h.doctor.nombre}`;
          select.appendChild(opt);
        }
        if (freeList) {
          const div = document.createElement('div');
          div.className = 'hora-item';
          div.innerHTML = `\n            <div>\n              <div class="hora-time">${new Date(h.hora.start).toLocaleString()}</div>\n              <div class="small">Dr. ${h.doctor.nombre}</div>\n            </div>\n            <div><span class="badge">Disponible</span></div>\n          `;
          freeList.appendChild(div);
        }
      });
    } catch (err) {
      console.error(err);
      const freeList = document.getElementById('freeList');
      if (freeList) freeList.textContent = 'Error cargando horas';
    }
  }

  document.addEventListener('DOMContentLoaded', loadLibres);

  document.getElementById('takeForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const horaMedicaId = document.getElementById('horasSelect')?.value;
    if (!horaMedicaId) return alert('Selecciona una hora');
    if (!pacienteId) return alert('Paciente no autenticado');

    try {
      const res = await fetch('/api/paciente/tomar-hora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteId, horaMedicaId })
      });
      const json = await res.json();
      if (!res.ok) return alert(json.error || 'Error');
      alert('Hora solicitada correctamente');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error al solicitar hora');
    }
  });
})();
