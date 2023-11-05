
  const url = 'https://mindicador.cl/api';
  const selectMoneda = document.querySelector('input[type="text"]');
  const resultInput = document.querySelector('input[type="text"]');

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const tiposDeCambio = data;

      // Rellenar el select con las monedas disponibles
      Object.keys(tiposDeCambio).forEach((moneda) => {
        const option = document.createElement('option');
        option.value = moneda;
        option.textContent = moneda;
        selectMoneda.appendChild(option);
      });

      // Manejar el evento clic del botón "Calcular"
      document.querySelector('.boton').addEventListener('click', () => {
        const montoCLP = document.querySelector('input[type="number"]').value;
        const monedaSeleccionada = selectMoneda.value;

        if (tiposDeCambio[monedaSeleccionada]) {
          const tasaDeCambio = tiposDeCambio[monedaSeleccionada].valor;
          const resultado = montoCLP / tasaDeCambio;
          resultInput.value = resultado;
        }
      });
    })
    .catch((error) => {
      console.error('Error al obtener los tipos de cambio:', error);
      resultInput.value = 'Error al obtener los tipos de cambio';
    });
