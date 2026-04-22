/*
 * checkin.js
 *
 * Lógica da página de check‑in online. Permite ao usuário buscar sua reserva
 * por localizador e sobrenome, visualizar os detalhes do voo e passageiros,
 * confirmar o check‑in e gerar os cartões de embarque para todos os passageiros.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------- CONFIGURAÇÕES INICIAIS ----------
    const urlParams = new URLSearchParams(window.location.search);
    let localizadorUrl = urlParams.get('localizador');

    // ---------- VERIFICAÇÃO DE AUTENTICAÇÃO ----------
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioMeuVoo'));
    if (!usuarioLogado) {
        alert('Faça login para acessar o check‑in.');
        window.location.href = 'login.html';
        return;
    }

    // ---------- CARREGAMENTO DO HISTÓRICO DO USUÁRIO ----------
    const chaveHistorico = `historicoReservas_${usuarioLogado.id}`;
    const historico = JSON.parse(localStorage.getItem(chaveHistorico)) || [];
    let reservaAtual = null;

    // ---------- ELEMENTOS DA INTERFACE ----------
    const buscaDiv = document.getElementById('buscaReserva');
    const detalhesDiv = document.getElementById('detalhesReserva');
    const mensagemDiv = document.getElementById('mensagemFeedback');
    const formCheckin = document.getElementById('formCheckin');

    // ---------- MAPEAMENTO DE CIDADES ----------
    const siglaParaCidade = {
        'GRU': 'São Paulo', 'CGH': 'São Paulo (Congonhas)', 'GIG': 'Rio de Janeiro',
        'BSB': 'Brasília', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza',
        'CNF': 'Belo Horizonte', 'CWB': 'Curitiba', 'POA': 'Porto Alegre',
        'MAO': 'Manaus', 'SCL': 'Santiago', 'EZE': 'Buenos Aires', 'MIA': 'Miami',
        'JFK': 'Nova York', 'LIS': 'Lisboa', 'LHR': 'Londres', 'CDG': 'Paris'
    };

    // ---------- FUNÇÕES AUXILIARES ----------
    function exibirMensagem(texto, tipo = 'erro') {
        mensagemDiv.innerHTML = `<div class="mensagem-${tipo}">${texto}</div>`;
    }

    function formatarData(dataISO) {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // ---------- EXIBIÇÃO DOS DETALHES DA RESERVA ----------
    function mostrarDetalhes(reserva) {
        // Valida se a reserva não está cancelada
        if (reserva.status === 'Cancelada') {
            exibirMensagem('Esta reserva foi cancelada e não pode mais realizar check‑in.', 'erro');
            buscaDiv.style.display = 'block';
            detalhesDiv.style.display = 'none';
            return;
        }

        reservaAtual = reserva;
        buscaDiv.style.display = 'none';
        detalhesDiv.style.display = 'block';
        mensagemDiv.innerHTML = '';

        // Preenche informações do voo
        document.getElementById('origemVoo').textContent = reserva.from;
        document.getElementById('destinoVoo').textContent = reserva.to;
        document.getElementById('numeroVoo').textContent = `${reserva.airline} ${reserva.flightId}`;
        document.getElementById('dataVoo').textContent = formatarData(reserva.date);
        document.getElementById('horarioVoo').textContent = reserva.departure || '08:00 - 10:30';
        document.getElementById('portao').textContent = reserva.portao || 'A definir';

        // Lista de passageiros com assentos
        const listaPassageiros = document.getElementById('listaPassageirosCheckin');
        listaPassageiros.innerHTML = '';
        reserva.passengers.forEach((p, i) => {
            const li = document.createElement('li');
            li.textContent = `${i + 1}. ${p.nome} - Assento: ${p.assento || 'Não selecionado'}`;
            listaPassageiros.appendChild(li);
        });

        // Atualiza interface conforme status do check‑in
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
            preencherCartoes(reserva);
        } else {
            statusSpan.textContent = 'Check‑in disponível';
            statusSpan.style.background = '#dcfce7';
            statusSpan.style.color = '#166534';
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = 'Confirmar check‑in';
            cartaoDiv.style.display = 'none';
        }
    }

    // ---------- GERAÇÃO DOS CARTÕES DE EMBARQUE ----------
    function preencherCartoes(reserva) {
        const cartaoContainer = document.getElementById('cartaoEmbarque');
        let cartoesHtml = '<h3>🎫 Cartões de Embarque</h3>';
        reserva.passengers.forEach((p, idx) => {
            cartoesHtml += `
                <div class="cartao-embarque-individual" style="margin-bottom: 2rem; border-top: 2px dashed #ccc; padding-top: 1rem;">
                    <div class="cartao-header">
                        <span class="cia-cartao">${reserva.airline}</span>
                        <span class="voo-cartao">${reserva.flightId}</span>
                    </div>
                    <div class="cartao-passageiro">${p.nome}</div>
                    <div class="cartao-rota">${reserva.from} → ${reserva.to}</div>
                    <div class="cartao-info">
                        <div><span>Data:</span> <span>${formatarData(reserva.date)}</span></div>
                        <div><span>Horário:</span> <span>${reserva.departure || '08:00'}</span></div>
                        <div><span>Assento:</span> <span>${p.assento || 'Aguardando'}</span></div>
                        <div><span>Portão:</span> <span>${reserva.portao || 'A definir'}</span></div>
                    </div>
                    <div class="cartao-codigo">
                        <div class="codigo-barras"></div>
                    </div>
                </div>
            `;
        });
        cartaoContainer.innerHTML = cartoesHtml;
    }

    // ---------- ACESSO DIRETO VIA URL (COM LOCALIZADOR) ----------
    if (localizadorUrl) {
        const reservaEncontrada = historico.find(r => r.localizador === localizadorUrl.toUpperCase());
        if (reservaEncontrada) {
            mostrarDetalhes(reservaEncontrada);
        } else {
            exibirMensagem('Reserva não encontrada.', 'erro');
        }
    }

    // ---------- BUSCA MANUAL POR FORMULÁRIO ----------
    formCheckin.addEventListener('submit', (e) => {
        e.preventDefault();
        const localizador = document.getElementById('localizador').value.trim().toUpperCase();
        const sobrenome = document.getElementById('sobrenome').value.trim().toUpperCase();

        const reserva = historico.find(r => r.localizador === localizador);
        if (!reserva) {
            exibirMensagem('Reserva não encontrada.', 'erro');
            return;
        }
        if (reserva.status === 'Cancelada') {
            exibirMensagem('Esta reserva foi cancelada e não pode realizar check‑in.', 'erro');
            return;
        }

        const primeiroPassageiro = reserva.passengers[0];
        if (!primeiroPassageiro.nome.toUpperCase().includes(sobrenome)) {
            exibirMensagem('Sobrenome não confere.', 'erro');
            return;
        }

        mostrarDetalhes(reserva);
    });

    // ---------- CONFIRMAÇÃO DO CHECK‑IN ----------
    document.getElementById('btnConfirmarCheckin').addEventListener('click', () => {
        if (!reservaAtual) return;
        if (reservaAtual.status === 'Cancelada') {
            exibirMensagem('Reserva cancelada não pode realizar check‑in.', 'erro');
            return;
        }

        // Gera portão aleatório e atualiza status
        reservaAtual.portao = `A${Math.floor(Math.random() * 20) + 1}`;
        reservaAtual.status = 'Check‑in realizado';

        localStorage.setItem(chaveHistorico, JSON.stringify(historico));
        exibirMensagem('Check‑in realizado com sucesso para todos os passageiros! Bom voo! ✈️', 'sucesso');
        mostrarDetalhes(reservaAtual);
    });

    // ---------- BUSCAR OUTRA RESERVA ----------
    document.getElementById('btnBuscarOutro').addEventListener('click', () => {
        buscaDiv.style.display = 'block';
        detalhesDiv.style.display = 'none';
        reservaAtual = null;
        formCheckin.reset();
        mensagemDiv.innerHTML = '';
    });
});