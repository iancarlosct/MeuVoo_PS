document.addEventListener('DOMContentLoaded', () => {
  // ---------- Elementos ----------
  const swapBtn = document.querySelector('.swap-btn');
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');

  // Modo de busca
  const modeBtns = document.querySelectorAll('.mode-btn');
  const routeFields = document.getElementById('routeFields');
  const priceFields = document.getElementById('priceFields');
  const searchBtn = document.getElementById('searchButton');

  // Componentes do modo Rota (passageiros/classe)
  const trigger = document.getElementById('passengersTrigger');
  const dropdown = document.getElementById('passengersDropdown');
  const displaySpan = document.getElementById('passengersDisplay');
  const adultsSpan = document.getElementById('adultsCount');
  const decrementBtn = document.querySelector('[data-action="decrement"]');
  const incrementBtn = document.querySelector('[data-action="increment"]');
  const classRadios = document.querySelectorAll('input[name="flightClass"]');
  const applyBtn = document.getElementById('applyPassengers');

  // Componentes do modo Preço (apenas adultos)
  const priceTrigger = document.getElementById('pricePassengersTrigger');
  const priceDropdown = document.getElementById('pricePassengersDropdown');
  const priceDisplaySpan = document.getElementById('pricePassengersDisplay');
  const priceAdultsSpan = document.getElementById('priceAdultsCount');
  const priceDecrement = document.querySelector('[data-action="decrement-price"]');
  const priceIncrement = document.querySelector('[data-action="increment-price"]');
  const priceApply = document.getElementById('applyPricePassengers');

  // Estados
  let adults = 1;
  let selectedClass = 'Econômica';
  let priceAdults = 1;
  let currentMode = 'route'; // 'route' ou 'price'

  // ---------- Funções auxiliares ----------
  function updateRouteDisplay() {
    const plural = adults > 1 ? 'passageiros' : 'passageiro';
    displaySpan.textContent = `${adults} ${plural}, ${selectedClass}`;
  }

  function updatePriceDisplay() {
    const plural = priceAdults > 1 ? 'adultos' : 'adulto';
    priceDisplaySpan.textContent = `${priceAdults} ${plural}`;
  }

  // ---------- Inverter origem/destino ----------
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const temp = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = temp;
    });
  }

  // ---------- Lógica do modo Rota (passageiros/classe) ----------
  if (trigger && dropdown) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
      trigger.querySelector('.arrow').style.transform = dropdown.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
    });

    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
        trigger.querySelector('.arrow').style.transform = 'rotate(0)';
      }
    });

    decrementBtn.addEventListener('click', () => {
      if (adults > 1) adults--;
      adultsSpan.textContent = adults;
    });

    incrementBtn.addEventListener('click', () => {
      if (adults < 9) adults++;
      adultsSpan.textContent = adults;
    });

    applyBtn.addEventListener('click', () => {
      classRadios.forEach(radio => {
        if (radio.checked) selectedClass = radio.value;
      });
      updateRouteDisplay();
      dropdown.classList.remove('show');
      trigger.querySelector('.arrow').style.transform = 'rotate(0)';
    });

    updateRouteDisplay();
  }

  // ---------- Lógica do modo Preço (apenas adultos) ----------
  if (priceTrigger && priceDropdown) {
    priceTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      priceDropdown.classList.toggle('show');
      priceTrigger.querySelector('.arrow').style.transform = priceDropdown.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
    });

    document.addEventListener('click', (e) => {
      if (!priceTrigger.contains(e.target) && !priceDropdown.contains(e.target)) {
        priceDropdown.classList.remove('show');
        priceTrigger.querySelector('.arrow').style.transform = 'rotate(0)';
      }
    });

    priceDecrement.addEventListener('click', () => {
      if (priceAdults > 1) priceAdults--;
      priceAdultsSpan.textContent = priceAdults;
    });

    priceIncrement.addEventListener('click', () => {
      if (priceAdults < 9) priceAdults++;
      priceAdultsSpan.textContent = priceAdults;
    });

    priceApply.addEventListener('click', () => {
      updatePriceDisplay();
      priceDropdown.classList.remove('show');
      priceTrigger.querySelector('.arrow').style.transform = 'rotate(0)';
    });

    updatePriceDisplay();
  }

  // ---------- Alternar entre modos ----------
  function setMode(mode) {
    currentMode = mode;
    if (mode === 'route') {
      routeFields.style.display = 'flex';
      priceFields.style.display = 'none';
      searchBtn.textContent = 'Buscar voos';
      // Desabilitar required no campo de preço
      document.getElementById('maxPrice').required = false;
      document.getElementById('from').required = true;
      document.getElementById('to').required = true;
      document.getElementById('date').required = true;
    } else {
      routeFields.style.display = 'none';
      priceFields.style.display = 'flex';
      searchBtn.textContent = 'Recomendar destinos';
      document.getElementById('maxPrice').required = true;
      document.getElementById('from').required = false;
      document.getElementById('to').required = false;
      document.getElementById('date').required = false;
    }
    // Atualizar botões ativos
    modeBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.mode === mode) btn.classList.add('active');
    });
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setMode(btn.dataset.mode);
    });
  });

  // ---------- Submissão do formulário ----------
  const form = document.getElementById('flightSearchForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentMode === 'route') {
      const origem = fromInput.value || 'não informada';
      const destino = toInput.value || 'não informado';
      const data = document.getElementById('date').value || 'não informada';
      alert(`🔍 Buscando voos de ${origem} para ${destino} na data ${data}.\n${adults} ${adults > 1 ? 'passageiros' : 'passageiro'}, classe ${selectedClass}.`);
    } else {
      const maxPrice = document.getElementById('maxPrice').value;
      if (!maxPrice || maxPrice <= 0) {
        alert('Por favor, informe um valor máximo válido.');
        return;
      }
      alert(`✨ Recomendando destinos para até ${priceAdults} ${priceAdults > 1 ? 'pessoas' : 'pessoa'} com orçamento de R$ ${maxPrice}.`);
    }
  });

  // Iniciar com modo Rota ativo
  setMode('route');
});