document.addEventListener('DOMContentLoaded', () => {
  // Elementos da interface
  const formCheckin = document.getElementById('formCheckin');
  const buscaDiv = document.getElementById('buscaReserva');
  const detalhesDiv = document.getElementById('detalhesReserva');
  const mensagemDiv = document.getElementById('mensagemCheckin');
  const btnOutraReserva = document.getElementById('btnOutraReserva');
  const btnRealizarCheckin = document.getElementById('btnRealizarCheckin');

  // Campos de exibição
  const vooNumeroSpan = document.getElementById('vooNumero');
  const origemSpan = document.getElementById('origem');
  const destinoSpan = document.getElementById('destino');
  const dataVooSpan = document.getElementById('dataVoo');
  const horarioVooSpan = document.getElementById('horarioVoo');
  const portaoSpan = document.getElementById('portao');
  const listaPassageirosDiv = document.getElementById('listaPassageiros');

  // Dados mockados de reservas (simulação)
  const reservasMock = {
    'ABC123': {
      localizador: 'ABC123',
      sobrenome: 'SILVA',
      voo: {
        numero: 'MV 4321',
        origem: 'GRU (São Paulo)',
        destino: 'REC (Recife)',
        data: '20/05/2026',
        horario: '08:45 - 11:20',
        portao: 'A12'
      },
      passageiros: [
        { nome: 'João Silva', assento: '12A' },
        { nome: 'Maria Silva', assento: '12B' }
      ],
      checkinRealizado: false
    },
    'XYZ789': {
      localizador: 'XYZ789',
      sobrenome: 'OLIVEIRA',
      voo: {
        numero: 'MV 2156',
        origem: 'BSB (Brasília)',
        destino: 'SSA (Salvador)',
        data: '22/06/2026',
        horario: '14:30 - 16:10',
        portao: 'B05'
      },
      passageiros: [
        { nome: 'Ana Oliveira', assento: null },
        { nome: 'Carlos Oliveira', assento: null }
      ],
      checkinRealizado: false
    }
  };

  let reservaAtual = null;

  // Função para exibir mensagens
  function exibirMensagem(texto, tipo = 'erro') {
    mensagemDiv.innerHTML = `<div class="mensagem-${tipo}">${texto}</div>`;
  }

  function limparMensagem() {
    mensagemDiv.innerHTML = '';
  }

  // Função para alternar entre busca e detalhes
  function mostrarDetalhes(reserva) {
    reservaAtual = reserva;
    buscaDiv.style.display = 'none';
    detalhesDiv.style.display = 'block';
    limparMensagem();

    // Preencher dados do voo
    vooNumeroSpan.textContent = reserva.voo.numero;
    origemSpan.textContent = reserva.voo.origem;
    destinoSpan.textContent = reserva.voo.destino;
    dataVooSpan.textContent = reserva.voo.data;
    horarioVooSpan.textContent = reserva.voo.horario;
    portaoSpan.textContent = reserva.voo.portao || 'A definir';

    // Preencher passageiros
    let passageirosHtml = '';
    reserva.passageiros.forEach(p => {
      const assento = p.assento || (reserva.checkinRealizado ? 'Aguardando' : 'Não selecionado');
      passageirosHtml += `
        <div class="passageiro-item">
          <span class="passageiro-nome">${p.nome}</span>
          <span class="passageiro-assento">Assento: ${assento}</span>
        </div>
      `;
    });
    listaPassageirosDiv.innerHTML = passageirosHtml;

    // Atualizar status do check-in
    const statusSpan = document.querySelector('.status-reserva');
    if (reserva.checkinRealizado) {
      statusSpan.textContent = 'Check-in realizado';
      statusSpan.style.background = '#dbeafe';
      statusSpan.style.color = '#1e40af';
      btnRealizarCheckin.disabled = true;
      btnRealizarCheckin.textContent = 'Check-in já realizado';
      btnRealizarCheckin.style.background = '#94a3b8';
      btnRealizarCheckin.style.cursor = 'not-allowed';
    } else {
      statusSpan.textContent = 'Check-in disponível';
      statusSpan.style.background = '#dcfce7';
      statusSpan.style.color = '#166534';
      btnRealizarCheckin.disabled = false;
      btnRealizarCheckin.textContent = 'Realizar check-in';
      btnRealizarCheckin.style.background = '#10b981';
      btnRealizarCheckin.style.cursor = 'pointer';
    }
  }

  function mostrarBusca() {
    buscaDiv.style.display = 'block';
    detalhesDiv.style.display = 'none';
    reservaAtual = null;
    formCheckin.reset();
    limparMensagem();
  }

  // Evento de submit do formulário
  formCheckin.addEventListener('submit', (e) => {
    e.preventDefault();
    const localizador = document.getElementById('localizador').value.trim().toUpperCase();
    const sobrenome = document.getElementById('sobrenome').value.trim().toUpperCase();

    if (!localizador || !sobrenome) {
      exibirMensagem('Por favor, preencha todos os campos.', 'erro');
      return;
    }

    // Buscar reserva mockada
    const reserva = reservasMock[localizador];
    if (!reserva) {
      exibirMensagem('Reserva não encontrada. Verifique o localizador e tente novamente.', 'erro');
      return;
    }

    if (reserva.sobrenome !== sobrenome) {
      exibirMensagem('Sobrenome não confere com a reserva informada.', 'erro');
      return;
    }

    // Reserva encontrada
    mostrarDetalhes(reserva);
  });

  // Botão "Buscar outra reserva"
  btnOutraReserva.addEventListener('click', () => {
    mostrarBusca();
  });

  // Botão "Realizar check-in"
  btnRealizarCheckin.addEventListener('click', () => {
    if (!reservaAtual) return;

    if (reservaAtual.checkinRealizado) {
      exibirMensagem('Check-in já foi realizado para esta reserva.', 'erro');
      return;
    }

    // Simular realização do check-in
    reservaAtual.checkinRealizado = true;
    // Atribuir assentos aleatórios (simulação)
    reservaAtual.passageiros.forEach(p => {
      if (!p.assento) {
        const letras = ['A', 'B', 'C', 'D', 'E', 'F'];
        const numero = Math.floor(Math.random() * 30) + 1;
        p.assento = `${numero}${letras[Math.floor(Math.random() * letras.length)]}`;
      }
    });
    reservaAtual.voo.portao = `A${Math.floor(Math.random() * 20) + 1}`;

    exibirMensagem('Check-in realizado com sucesso! Bom voo! ✈️', 'sucesso');
    mostrarDetalhes(reservaAtual); // Atualiza a tela
  });
});