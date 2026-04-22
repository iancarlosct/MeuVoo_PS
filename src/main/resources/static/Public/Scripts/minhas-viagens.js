/*
 * minhas-viagens.js
 *
 * Lógica da página "Minhas Viagens". Carrega o histórico de reservas do usuário
 * logado a partir do localStorage, exibe os cards com detalhes de cada viagem e
 * oferece ações como ver detalhes, fazer check‑in, simular reembolso e cancelar.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------- VERIFICAÇÃO DE AUTENTICAÇÃO ----------
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioMeuVoo'));
    if (!usuarioLogado || !usuarioLogado.id) {
        alert('Faça login para acessar suas viagens.');
        window.location.href = 'login.html';
        return;
    }

    // ---------- CARREGAMENTO DO HISTÓRICO DO USUÁRIO ----------
    const chaveHistorico = `historicoReservas_${usuarioLogado.id}`;
    console.log('Chave do histórico:', chaveHistorico);
    const historico = JSON.parse(localStorage.getItem(chaveHistorico)) || [];

    const listaDiv = document.getElementById('listaViagens');
    const vazioDiv = document.getElementById('mensagemVazio');

    // ---------- EXIBIÇÃO DE MENSAGEM DE VAZIO ----------
    if (historico.length === 0) {
        listaDiv.innerHTML = '';
        vazioDiv.style.display = 'block';
        return;
    }
    vazioDiv.style.display = 'none';

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

    // ---------- RENDERIZAÇÃO DOS CARDS DE RESERVA ----------
    let html = '';

    historico.sort((a, b) => new Date(b.dataReserva) - new Date(a.dataReserva));

    historico.forEach((reserva, index) => {
        const origem = obterNomeCidade(reserva.from);
        const destino = obterNomeCidade(reserva.to);
        const dataFormatada = new Date(reserva.date).toLocaleDateString('pt-BR');
        const precoTotal = reserva.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const classe = reserva.flightClass === 'ECONOMICA' ? 'Econômica' : 'Executiva';
        const numPassageiros = reserva.passengers.length;

        let passageirosHtml = '';
        reserva.passengers.forEach((p) => {
            passageirosHtml += `
                <div class="passageiro-item">
                    <span>👤 ${p.nome}</span>
                    <span>💺 Assento: ${p.assento || 'Não selecionado'}</span>
                </div>
            `;
        });

        const dataVoo = new Date(reserva.date);
        const hoje = new Date();
        const diffDias = Math.floor((dataVoo - hoje) / (1000 * 60 * 60 * 24));
        const checkinDisponivel = diffDias >= 0 && diffDias <= 2;

        html += `
            <div class="reserva-card" data-index="${index}">
                <div class="reserva-header">
                    <span class="localizador">🔖 ${reserva.localizador}</span>
                    <span class="status ${reserva.status.toLowerCase()}">${reserva.status}</span>
                </div>
                <div class="reserva-rota">
                    ${origem} → ${destino}
                </div>
                <div class="reserva-detalhes">
                    <span>📅 ${dataFormatada}</span>
                    <span>✈️ ${reserva.airline} · ${classe}</span>
                    <span>👥 ${numPassageiros} ${numPassageiros > 1 ? 'passageiros' : 'passageiro'}</span>
                    <span>💰 Total: ${precoTotal}</span>
                </div>
                <div class="passageiros-resumo">
                    ${passageirosHtml}
                </div>
                <div class="reserva-acoes">
                    <button class="btn-detalhes" data-index="${index}">Ver detalhes</button>
                    ${checkinDisponivel && reserva.status !== 'Cancelada' ?
                        `<button class="btn-checkin" data-index="${index}">Fazer check-in</button>` : ''}
                    ${reserva.status === 'Confirmada' ?
                        `<button class="btn-simular-reembolso" data-index="${index}">💰 Simular reembolso</button>` : ''}
                    ${reserva.status === 'Confirmada' ?
                        `<button class="btn-cancelar-reserva" data-index="${index}">Cancelar reserva</button>` : ''}
                </div>
            </div>
        `;
    });

    listaDiv.innerHTML = html;

    // ---------- EVENT LISTENERS ----------

    document.querySelectorAll('.btn-detalhes').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const reserva = historico[index];
            alert(`
                Detalhes da reserva ${reserva.localizador}:
                Voo: ${reserva.airline} ${reserva.flightId}
                Data: ${new Date(reserva.date).toLocaleDateString('pt-BR')}
                Passageiros: ${reserva.passengers.map(p => p.nome).join(', ')}
                Bagagens: ${reserva.passengers.map(p =>
                    `Mão: ${p.bagagem?.hand ? 'Sim' : 'Não'}, 15kg: ${p.bagagem?.checked15 ? 'Sim' : 'Não'}, 23kg: ${p.bagagem?.checked23 ? 'Sim' : 'Não'}`
                ).join('\n')}
            `);
        });
    });

    document.querySelectorAll('.btn-checkin').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const reserva = historico[index];
            window.location.href = `checkin.html?localizador=${reserva.localizador}`;
        });
    });

    document.querySelectorAll('.btn-cancelar-reserva').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (confirm('Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.')) {
                const reserva = historico[index];
                reserva.status = 'Cancelada';
                localStorage.setItem(chaveHistorico, JSON.stringify(historico));
                alert('Reserva cancelada.');
                window.location.reload();
            }
        });
    });

    document.querySelectorAll('.btn-simular-reembolso').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const reserva = historico[index];
            if (reserva.status !== 'Confirmada') {
                alert('Apenas reservas confirmadas podem ser reembolsadas.');
                return;
            }
            window.location.href = `reembolso.html?localizador=${reserva.localizador}`;
        });
    });
});