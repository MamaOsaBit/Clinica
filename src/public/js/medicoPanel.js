// Script for medicoPanel: read doctorId from query, populate hidden input, fetch horas and render lists
(function(){
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  const doctorId = getQueryParam('doctorId');
  const doctorInput = document.getElementById('doctorIdInput');
  if (doctorInput && doctorId) doctorInput.value = doctorId;

  async function loadHoras() {
    if (!doctorId) return;
    try {
      const res = await fetch('/api/medico/horas?doctorId=' + encodeURIComponent(doctorId));
      if (!res.ok) throw new Error('Error al obtener horas');
      const data = await res.json();

      const taken = data.horasTomadas || [];
      const takenContainer = document.getElementById('takenContent');
      if (takenContainer) {
        if (taken.length === 0) {
          takenContainer.innerHTML = '<div class="small">Sin pacientes aun</div>';
        } else {
          takenContainer.innerHTML = '';
          taken.forEach(h => {
            const div = document.createElement('div');
            div.className = 'hora-item';
            const start = new Date(h.hora.start).toLocaleString();
            const paciente = h.paciente ? h.paciente.nombre : 'Sin paciente';
            div.innerHTML = `
              <div>
                <div class="hora-time">${start}</div>
                <div class="small">Paciente: ${paciente}</div>
              </div>
              <div><span class="badge">Tomada</span></div>
            `;
            takenContainer.appendChild(div);
          });
        }
      }

      const free = data.horasLibres || [];
      const freeContainer = document.getElementById('freeContent');
      if (freeContainer) {
        if (free.length === 0) {
          freeContainer.innerHTML = '<div class="small">Sin horas medicas por ahora</div>';
        } else {
          freeContainer.innerHTML = '';
          free.forEach(h => {
            const div = document.createElement('div');
            div.className = 'hora-item';
            const start = new Date(h.hora.start).toLocaleString();
            div.innerHTML = `
              <div>
                <div class="hora-time">${start}</div>
                <div class="small">Sin paciente</div>
              </div>
              <div><span class="badge">Libre</span></div>
            `;
            freeContainer.appendChild(div);
          });
        }
      }

    } catch (err) {
      console.error(err);
      const takenContainer = document.getElementById('takenContent');
      const freeContainer = document.getElementById('freeContent');
      if (takenContainer) takenContainer.textContent = 'Error cargando datos';
      if (freeContainer) freeContainer.textContent = 'Error cargando datos';
    }
  }

  document.addEventListener('DOMContentLoaded', loadHoras);
})();
