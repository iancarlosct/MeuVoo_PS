/*
 * dados-passageiros.js
 *
 * Lógica da página de preenchimento dos dados dos passageiros após a finalização
 * da compra. Renderiza os formulários para cada passageiro de cada voo no carrinho,
 * valida os campos obrigatórios, e salva a reserva no histórico do usuário logado.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de dados dos passageiros carregada.');

    // ---------- VERIFICAÇÃO DE AUTENTICAÇÃO ----------
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioMeuVoo'));
    if (!usuarioLogado || !usuarioLogado.id) {
        alert('Você precisa estar logado para finalizar a compra.');
        window.location.href = 'login.html';
        return;
    }

    // ---------- CARREGAMENTO DO CARRINHO ----------
    const carrinho = JSON.parse(localStorage.getItem('carrinhoMeuVoo')) || [];
    console.log('Carrinho carregado:', carrinho);

    if (carrinho.length === 0) {
        alert('Carrinho vazio.');
        window.location.href = 'carrinho.html';
        return;
    }

    const container = document.getElementById('reservasContainer');
    if (!container) {
        console.error('Elemento #reservasContainer não encontrado!');
        return;
    }

    // ---------- MAPEAMENTO DE CIDADES ----------
    const siglaParaCidade = {
        'GRU': 'São Paulo', 'CGH': 'São Paulo (Congonhas)', 'VCP': 'Campinas',
        'GIG': 'Rio de Janeiro', 'SDU': 'Rio de Janeiro (Santos Dumont)',
        'BSB': 'Brasília', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza',
        'CNF': 'Belo Horizonte', 'CWB': 'Curitiba', 'POA': 'Porto Alegre',
        'MAO': 'Manaus', 'SCL': 'Santiago', 'EZE': 'Buenos Aires', 'MIA': 'Miami',
        'JFK': 'Nova York', 'LIS': 'Lisboa', 'LHR': 'Londres', 'CDG': 'Paris'
    };
    const obterNomeCidade = sigla => siglaParaCidade[sigla] || sigla;

    // ---------- RENDERIZAÇÃO DOS FORMULÁRIOS ----------
    let html = '';

    carrinho.forEach((item, idxVoo) => {
        const numPassageiros = item.passengers.length;
        const origem = obterNomeCidade(item.from);
        const destino = obterNomeCidade(item.to);
        const classe = item.flightClass === 'ECONOMICA' ? 'Econômica' : 'Executiva';

        html += `
            <div class="voo-bloco">
                <div class="voo-cabecalho">
                    ✈️ ${origem} → ${destino} &nbsp;|&nbsp; ${item.date} &nbsp;|&nbsp; ${item.airline} &nbsp;|&nbsp; ${classe}
                </div>
                <div class="passageiros-grid">
        `;

        for (let idxPass = 0; idxPass < numPassageiros; idxPass++) {
            html += `
                <div class="passageiro-card">
                    <div class="passageiro-header">Passageiro ${idxPass + 1}</div>
                    <div class="form-grid">
                        <div class="input-group">
                            <label>Nome completo *</label>
                            <input type="text" id="nome_${idxVoo}_${idxPass}" placeholder="Ex: João da Silva" required>
                        </div>
                        <div class="input-group">
                            <label>Data de nascimento *</label>
                            <input type="date" id="nasc_${idxVoo}_${idxPass}" required>
                        </div>
                        <div class="input-group">
                            <label>CPF *</label>
                            <input type="text" id="cpf_${idxVoo}_${idxPass}" placeholder="000.000.000-00" required>
                        </div>
                        <div class="input-group">
                            <label>Passaporte</label>
                            <input type="text" id="passaporte_${idxVoo}_${idxPass}" placeholder="Opcional para voos internacionais">
                            <small>Necessário apenas para destinos fora do Brasil.</small>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // ---------- CANCELAMENTO ----------
    document.getElementById('btnCancelar').addEventListener('click', () => {
        if (confirm('Deseja cancelar? Os dados preenchidos serão perdidos.')) {
            window.location.href = 'carrinho.html';
        }
    });

    // ---------- CONFIRMAÇÃO DA RESERVA ----------
    document.getElementById('btnConfirmar').addEventListener('click', async () => {
        let todosPreenchidos = true;
        const reservas = [];

        for (let i = 0; i < carrinho.length; i++) {
            const item = carrinho[i];
            const passageirosDados = [];
            for (let j = 0; j < item.passengers.length; j++) {
                const nomeInput = document.getElementById(`nome_${i}_${j}`);
                const nascInput = document.getElementById(`nasc_${i}_${j}`);
                const cpfInput = document.getElementById(`cpf_${i}_${j}`);
                const passaporteInput = document.getElementById(`passaporte_${i}_${j}`);

                const nome = nomeInput?.value.trim() || '';
                const nasc = nascInput?.value || '';
                const cpf = cpfInput?.value.trim() || '';
                const passaporte = passaporteInput?.value.trim() || '';

                if (!nome || !nasc || !cpf) {
                    todosPreenchidos = false;
                    if (nomeInput) nomeInput.style.borderColor = '#dc2626';
                    if (nascInput) nascInput.style.borderColor = '#dc2626';
                    if (cpfInput) cpfInput.style.borderColor = '#dc2626';
                } else {
                    passageirosDados.push({
                        nome, dataNascimento: nasc, cpf, passaporte,
                        assento: item.passengers[j].seat,
                        bagagem: item.passengers[j].baggage,
                        solicitacoes: item.passengers[j].specialRequests
                    });
                }
            }

            reservas.push({
                flightId: item.flightId,
                from: item.from,
                to: item.to,
                date: item.date,
                departure: item.departure,
                airline: item.airline,
                flightClass: item.flightClass,
                passengers: passageirosDados,
                totalPrice: item.totalPrice || (item.basePrice * item.passengers.length)
            });
        }

        if (!todosPreenchidos) {
            alert('Preencha todos os campos obrigatórios (Nome, Nascimento e CPF).');
            return;
        }

        const chaveHistorico = `historicoReservas_${usuarioLogado.id}`;
        console.log('Salvando reserva na chave:', chaveHistorico);
        const historico = JSON.parse(localStorage.getItem(chaveHistorico)) || [];
        reservas.forEach(r => {
            historico.push({
                ...r,
                dataReserva: new Date().toISOString(),
                status: 'Confirmada',
                localizador: gerarLocalizador()
            });
        });
        localStorage.setItem(chaveHistorico, JSON.stringify(historico));
        localStorage.removeItem('carrinhoMeuVoo');

        alert('Reserva confirmada com sucesso!');
        window.location.href = 'minhas-viagens.html';
    });

    function gerarLocalizador() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
});