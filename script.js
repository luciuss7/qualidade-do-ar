const apiKey = 'c1f9dd99cd9a09b9a734c6f3131c378d'; // sua chave da OpenWeather

async function getAirQuality() {
  const city = document.getElementById('city').value;
  const resultDiv = document.getElementById('result');

  if (!city) {
    resultDiv.innerHTML = 'Digite uma cidade ou bairro!';
    return;
  }

  // 1. Buscar latitude e longitude
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const geoRes = await fetch(geoUrl);
  const geoData = await geoRes.json();

  if (!geoData[0]) {
    resultDiv.innerHTML = 'Localização não encontrada!';
    return;
  }

  const { lat, lon } = geoData[0];

  // 2. Buscar dados de poluição
  const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const airRes = await fetch(airUrl);
  const airData = await airRes.json();
  const air = airData.list[0];

  const aqi = air.main.aqi;
  const pm2_5 = air.components.pm2_5;
  const pm10 = air.components.pm10;

  let qualidade = '';
  let cor = '';
  let legendaAqi = '';
  let legendaPm2_5 = '';
  let legendaPm10 = '';

  switch (aqi) {
    case 1: 
      qualidade = 'Boa 🌿'; 
      cor = 'lightgreen';
      legendaAqi = 'Índice de qualidade do ar bom. Sem riscos.';
      break;
    case 2: 
      qualidade = 'Moderada 🌤️'; 
      cor = 'yellow'; 
      legendaAqi = 'Índice moderado, sensíveis devem limitar atividades.';
      break;
    case 3: 
      qualidade = 'Ruim 😷'; 
      cor = 'orange'; 
      legendaAqi = 'Evite atividades físicas intensas fora de casa.';
      break;
    case 4: 
      qualidade = 'Muito Ruim 🚫'; 
      cor = 'red'; 
      legendaAqi = 'Fique dentro de casa, especialmente se tiver doenças respiratórias.';
      break;
    case 5: 
      qualidade = 'Perigosa ☠️'; 
      cor = 'purple'; 
      legendaAqi = 'Ar muito poluído, risco elevado à saúde!';
      break;
  }

  legendaPm2_5 = 'Partículas finas. Ideal: abaixo de 12 µg/m³.';
  legendaPm10 = 'Partículas maiores. Ideal: abaixo de 50 µg/m³.';

  resultDiv.innerHTML = `
    <h2 style="color:${cor}">🔎 Qualidade do Ar: ${qualidade}</h2>
    <div style="text-align: left;">
      <p>📊 <strong>AQI (Índice de Qualidade do Ar):</strong> ${aqi} - ${legendaAqi}</p>
      <p>🧪 <strong>PM2.5:</strong> ${pm2_5} µg/m³ - ${legendaPm2_5}</p>
      <p>🧫 <strong>PM10:</strong> ${pm10} µg/m³ - ${legendaPm10}</p>
      <p>💬 <em>${recomendacaoSaude(aqi)}</em></p>
    </div>
  `;
}

function recomendacaoSaude(aqi) {
  if (aqi === 1) return '✅ Ar está limpo e saudável.';
  if (aqi === 2) return '⚠️ Pessoas sensíveis devem limitar exercícios ao ar livre.';
  if (aqi === 3) return '❌ Evite atividades físicas intensas fora de casa.';
  if (aqi === 4) return '🚫 Fique em ambientes fechados, se possível.';
  return '🛑 Situação crítica: Evite sair sem necessidade.';
}

// Função para alternar entre os temas claro e escuro
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  document.querySelector('.container').classList.toggle('light-theme');
  document.querySelector('input').classList.toggle('light-theme');
  document.querySelector('button').classList.toggle('light-theme');
  document.querySelector('#result').classList.toggle('light-theme');
  document.querySelector('#theme-toggle').classList.toggle('light-theme');
});
