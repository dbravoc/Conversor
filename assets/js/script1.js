document.addEventListener('DOMContentLoaded', function() {
  //Inputs del html
  const API_URL = 'https://mindicador.cl/api'; //definir la api
  const SeleccionarMoneda = document.getElementById('moneda-input'); //selecciono el input de la moneda
  const SeleccionarMonto = document.getElementById('monto-input'); // selecciono el el input del monto
  const SeleccionarResultado = document.getElementById('resultado-input'); // selecciono el resultado 
  const Calcular = document.getElementById('calcular-button'); //selecciono el boton calcular
  
  //API Monedas
  const CargarMonedas = async () => { //carga las monedas disponibles desde la api con una promesa
      try { //para probar que trae los datos desde la api
          const response = await fetch(API_URL); // pruebo obteniendo los datos desde la api con fetch
          if (!response.ok) throw new Error('Error al cargar los indicadores'); //si hay error, entonces dar mensaje
          const data = await response.json(); //converir a JSON
          SeleccionarMoneda.innerHTML = `<option value="dolar">Dólar</option>  
                                      <option value="euro">Euro</option>`; //agrego dolar y euro
      } catch (error) {
        SeleccionarResultado.value = 'Error al cargar los datos: ' + error.message; //mensaje ante errores
      }
  };

  //
  Calcular.addEventListener('click', async () => { // calcular la conversion
      const monto = parseFloat(SeleccionarMonto.value); //convertir numero 
      const currencyKey = SeleccionarMoneda.value; //Obtener clave de la moneda seleccionada anteriormente
      if (isNaN(monto) || monto <= 0) { //que el numero sea mayor a cero
        SeleccionarResultado.value = 'Ingrese un monto válido.'; //mensaje error
          return;
      }

      try {
          const response = await fetch(`${API_URL}/${currencyKey}`); //promesa con tasa conversion actual de la clave
          if (!response.ok) throw new Error('Error al realizar la conversión'); //error
          const { serie } = await response.json(); 
          const conversionRate = serie[0].valor; //usar la tasa mas reciente
          const resultado = (monto / conversionRate).toFixed(2); //hacer calculo
          SeleccionarResultado.value = `${resultado} ${currencyKey === 'dolar' ? 'USD' : 'EUR'}`;

          ActualizarGrafico(currencyKey, serie.slice(0, 10));
      } catch (error) {
        SeleccionarResultado.value = 'Error en la conversión: ' + error.message;
      }
  });


  //grafico
  const initialize = async () => {
      await CargarMonedas();
  };

  initialize();
});
const ActualizarGrafico = (currencyKey, dataPoints) => {
  const ctx = document.getElementById('currencyChart').getContext('2d');
  if (window.currencyChart instanceof Chart) {
      window.currencyChart.destroy();
  }
  window.currencyChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: dataPoints.map(point => point.fecha.substring(0, 10)),
          datasets: [{
              label: `Valor de 1 ${currencyKey === 'dolar' ? 'USD' : 'EUR'} en CLP`,
              data: dataPoints.map(point => point.valor),
              borderColor: '#4CAF50',
              tension: 0.1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: false
              }
          },
          responsive: true,
          maintainAspectRatio: true
      }
  });
};
