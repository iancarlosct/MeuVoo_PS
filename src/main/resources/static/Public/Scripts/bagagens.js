document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemIndex = urlParams.get('item');
    if (itemIndex === null) {
        alert('Item não especificado.');
        window.location.href = 'carrinho.html';
        return;
    }

    const carrinho = JSON.parse(localStorage.getItem('carrinhoMeuVoo')) || [];
    const item = carrinho[parseInt(itemIndex)];
    if (!item) {
        alert('Item não encontrado no carrinho.');
        window.location.href = 'carrinho.html';
        return;
    }

    // Preços das bagagens (poderiam vir de API futuramente)
    const PRECO_BAGAGEM_15KG = 80.00;
    const PRECO_BAGAGEM_23KG = 120.00;

    const siglaParaCidade = {
        'GRU': 'São Paulo', 'CGH': 'São Paulo (Congonhas)', 'VCP': 'Campinas',
        'GIG': 'Rio de Janeiro', 'SDU': 'Rio de Janeiro (Santos Dumont)',
        'BSB': 'Brasília', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza',
        'CNF': 'Belo Horizonte', 'CWB': 'Curitiba', 'POA': 'Porto Alegre',
        'MAO': 'Manaus', 'SCL': 'Santiago', 'EZE': 'Buenos Aires', 'MIA': 'Miami',
        'JFK': 'Nova York', 'LIS': 'Lisboa', 'LHR': 'Londres', 'CDG': 'Paris'
    };
    const obterNomeCidade = (sigla) => siglaParaCidade[sigla] || sigla;

    // Exibir informações do voo
    document.getElementById('vooInfo').innerHTML = `
        <strong>${obterNomeCidade(item.from)} → ${obterNomeCidade(item.to)}</strong><br>
        ${item.date} • ${item.airline} • ${item.flightClass === 'ECONOMICA' ? 'Econômica' : 'Executiva'}
    `;

    const container = document.getElementById('passageirosBagagens');
    const passageiros = item.passengers;

    // Função para formatar moeda
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Renderizar opções para cada passageiro
    passageiros.forEach((passageiro, idx) => {
        const card = document.createElement('div');
        card.className = 'passageiro-card';
        card.innerHTML = `
            <h3>Passageiro ${idx+1}</h3>
            <div class="opcoes-bagagem">
                <div class="opcao-bagagem">
                    <input type="checkbox" id="bagMao_${idx}" checked disabled>
                    <label for="bagMao_${idx}">
                        <span>Bagagem de mão (10kg)</span>
                        <span class="preco-bagagem">Inclusa</span>
                    </label>
                </div>
                <div class="opcao-bagagem">
                    <input type="checkbox" id="bag15_${idx}" ${passageiro.baggage?.checked15 ? 'checked' : ''}>
                    <label for="bag15_${idx}">
                        <span>Bagagem despachada 15kg</span>
                        <span class="preco-bagagem">${formatarMoeda(PRECO_BAGAGEM_15KG)}</span>
                    </label>
                </div>
                <div class="opcao-bagagem">
                    <input type="checkbox" id="bag23_${idx}" ${passageiro.baggage?.checked23 ? 'checked' : ''}>
                    <label for="bag23_${idx}">
                        <span>Bagagem despachada 23kg</span>
                        <span class="preco-bagagem">${formatarMoeda(PRECO_BAGAGEM_23KG)}</span>
                    </label>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Botão Salvar
    document.getElementById('btnSalvar').addEventListener('click', () => {
        // Atualizar bagagens de cada passageiro
        passageiros.forEach((passageiro, idx) => {
            const checked15 = document.getElementById(`bag15_${idx}`).checked;
            const checked23 = document.getElementById(`bag23_${idx}`).checked;
            passageiro.baggage = {
                hand: true, // sempre incluso
                checked15: checked15,
                checked23: checked23
            };
        });

        // Recalcular preço total do item
        let custoBagagens = 0;
        passageiros.forEach(p => {
            if (p.baggage.checked15) custoBagagens += PRECO_BAGAGEM_15KG;
            if (p.baggage.checked23) custoBagagens += PRECO_BAGAGEM_23KG;
        });
        item.totalPrice = (item.basePrice * passageiros.length) + custoBagagens;

        // Salvar no carrinho
        localStorage.setItem('carrinhoMeuVoo', JSON.stringify(carrinho));
        alert('Bagagens atualizadas com sucesso!');
        window.location.href = 'carrinho.html';
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
        window.location.href = 'carrinho.html';
    });
});