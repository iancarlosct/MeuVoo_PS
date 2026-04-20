document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let localizadorUrl = urlParams.get('localizador');

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioMeuVoo'));
    if (!usuarioLogado) {
        alert('Faça login para acessar o check‑in.');
        window.location.href = 'login.html';
        return;
    }

    const historico = JSON.parse(localStorage.getItem('historicoReservas')) || [];
    let reservaAtual = null;

    const buscaDiv = document.getElementById('buscaReserva');
    const detalhesDiv = document.getElementById('detalhesReserva');
    const mensagemDiv = document.getElementById('mensagemFeedback');
    const formCheckin = document.getElementById('formCheckin');

    const siglaParaCidade = {
        'GRU': 'São Paulo', 'CGH': 'São Paulo (Congonhas)', 'GIG': 'Rio de Janeiro',
        'BSB': 'Brasília', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza',
        'CNF': 'Belo Horizonte', 'CWB': 'Curitiba', 'POA': 'Porto Alegre',
        'MAO': 'Manaus', 'SCL': 'Santiago', 'EZE': 'Buenos Aires', 'MIA': 'Miami',
        'JFK': 'Nova York', 'LIS': 'Lisboa', 'LHR': 'Londres', 'CDG': 'Paris'
    };

    function exibirMensagem(texto, tipo = 'erro') {
        mensagemDiv.innerHTML = `<div class="mensagem-${tipo}">${texto}</div>`;
    }

    function formatarData(dataISO) {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function mostrarDetalhes(reserva) {
        reservaAtual = reserva;
        buscaDiv.style.display = 'none';
        detalhesDiv.style.display = 'block';
        mensagemDiv.innerHTML = '';

        const origemNome = siglaParaCidade[reserva.from] || reserva.from;
        const destinoNome = siglaParaCidade[reserva.to] || reserva.to;

        document.getElementById('origemVoo').textContent = reserva.from;
        document.getElementById('destinoVoo').textContent = reserva.to;
        document.getElementById('numeroVoo').textContent = `${reserva.airline} ${reserva.flightId}`;
        document.getElementById('dataVoo').textContent = formatarData(reserva.date);
        document.getElementById('horarioVoo').textContent = reserva.departure || '08:00 - 10:30';
        document.getElementById('portao').textContent = reserva.portao || 'A definir';

        // Lista de passageiros
        const listaPassageiros = document.getElementById('listaPassageirosCheckin');
        listaPassageiros.innerHTML = '';
        reserva.passengers.forEach((p, i) => {
            const li = document.createElement('li');
            li.textContent = `${i+1}. ${p.nome} - Assento: ${p.assento || 'Não selecionado'}`;
            listaPassageiros.appendChild(li);
        });

        // Status do check‑in
        const statusSpan = document.getElementById('statusCheckin');
        const btnConfirmar = document.getElementById('btnConfirmarCheckin');
        const cartaoDiv = document.getElementById('cartaoEmbarque');

        if (reserva.status === 'Check‑in realizado') {
            statusSpan.textContent = 'Check‑in realizado';
            statusSpan.style.background = '#dbeafe';
            statusSpan.style.color = '#1e40af';
            btnConfirmar.disabled = true;
            btnConfirmar.textContent = 'Check‑in já realizado';
            cartaoDiv.style.display = 'block';
            preencherCartao(reserva);
        } else {
            statusSpan.textContent = 'Check‑in disponível';
            statusSpan.style.background = '#dcfce7';
            statusSpan.style.color = '#166534';
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = 'Confirmar check‑in';
            cartaoDiv.style.display = 'none';
        }
    }

    function preencherCartao(reserva) {
        const primeiroPassageiro = reserva.passengers[0];
        document.getElementById('ciaCartao').textContent = reserva.airline;
        document.getElementById('vooCartao').textContent = reserva.flightId;
        document.getElementById('passageiroCartao').textContent = primeiroPassageiro.nome;
        document.getElementById('rotaCartao').textContent = `${reserva.from} → ${reserva.to}`;
        document.getElementById('dataCartao').textContent = formatarData(reserva.date);
        document.getElementById('horarioCartao').textContent = reserva.departure || '08:00';
        document.getElementById('assentoCartao').textContent = primeiroPassageiro.assento || 'Aguardando';
        document.getElementById('portaoCartao').textContent = reserva.portao || 'A definir';
    }

    // Se veio localizador pela URL, busca automaticamente
    if (localizadorUrl) {
        const reservaEncontrada = historico.find(r => r.localizador === localizadorUrl.toUpperCase());
        if (reservaEncontrada) {
            mostrarDetalhes(reservaEncontrada);
        } else {
            exibirMensagem('Reserva não encontrada.', 'erro');
        }
    }

    // Busca manual
    formCheckin.addEventListener('submit', (e) => {
        e.preventDefault();
        const localizador = document.getElementById('localizador').value.trim().toUpperCase();
        const sobrenome = document.getElementById('sobrenome').value.trim().toUpperCase();

        const reserva = historico.find(r => r.localizador === localizador);
        if (!reserva) {
            exibirMensagem('Reserva não encontrada.', 'erro');
            return;
        }

        const primeiroPassageiro = reserva.passengers[0];
        if (!primeiroPassageiro.nome.toUpperCase().includes(sobrenome)) {
            exibirMensagem('Sobrenome não confere.', 'erro');
            return;
        }

        mostrarDetalhes(reserva);
    });

    // Confirmar check‑in
    document.getElementById('btnConfirmarCheckin').addEventListener('click', () => {
        if (!reservaAtual) return;

        // Atribuir portão aleatório (simulação)
        reservaAtual.portao = `A${Math.floor(Math.random() * 20) + 1}`;
        reservaAtual.status = 'Check‑in realizado';

        // Salvar no histórico
        localStorage.setItem('historicoReservas', JSON.stringify(historico));

        exibirMensagem('Check‑in realizado com sucesso! Bom voo! ✈️', 'sucesso');
        mostrarDetalhes(reservaAtual);
    });

    // Buscar outra reserva
    document.getElementById('btnBuscarOutro').addEventListener('click', () => {
        buscaDiv.style.display = 'block';
        detalhesDiv.style.display = 'none';
        reservaAtual = null;
        formCheckin.reset();
        mensagemDiv.innerHTML = '';
    });
});