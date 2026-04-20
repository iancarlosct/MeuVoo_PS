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

    // Exibir informações do voo
    const siglaParaCidade = {
        'GRU': 'São Paulo', 'CGH': 'São Paulo (Congonhas)', 'VCP': 'Campinas',
        'GIG': 'Rio de Janeiro', 'SDU': 'Rio de Janeiro (Santos Dumont)',
        'BSB': 'Brasília', 'SSA': 'Salvador', 'REC': 'Recife', 'FOR': 'Fortaleza',
        'CNF': 'Belo Horizonte', 'CWB': 'Curitiba', 'POA': 'Porto Alegre',
        'MAO': 'Manaus', 'SCL': 'Santiago', 'EZE': 'Buenos Aires', 'MIA': 'Miami',
        'JFK': 'Nova York', 'LIS': 'Lisboa', 'LHR': 'Londres', 'CDG': 'Paris'
    };
    const obterNomeCidade = (sigla) => siglaParaCidade[sigla] || sigla;

    document.getElementById('vooInfo').innerHTML = `
        <strong>${obterNomeCidade(item.from)} → ${obterNomeCidade(item.to)}</strong><br>
        ${item.date} • ${item.airline} • ${item.flightClass === 'ECONOMICA' ? 'Econômica' : 'Executiva'}
    `;

    const container = document.getElementById('listaPassageiros');
    const passageiros = item.passengers;

    // Construir formulário para cada passageiro
    passageiros.forEach((passageiro, idx) => {
        const div = document.createElement('div');
        div.className = 'passageiro-card';
        div.innerHTML = `
            <div class="passageiro-nome">Passageiro ${idx + 1}</div>
            <div class="opcoes-grupo">
                <h4>♿ Acessibilidade</h4>
                <label class="checkbox-label">
                    <input type="checkbox" name="acessibilidade_${idx}" value="cadeira_rodas" ${passageiro.specialRequests?.includes('cadeira_rodas') ? 'checked' : ''}>
                    Cadeira de rodas
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" name="acessibilidade_${idx}" value="acompanhante" ${passageiro.specialRequests?.includes('acompanhante') ? 'checked' : ''}>
                    Necessita de acompanhante
                </label>
            </div>
            <div class="opcoes-grupo">
                <h4>🍽️ Restrições Alimentares</h4>
                <label class="checkbox-label">
                    <input type="checkbox" name="alimentar_${idx}" value="vegetariana" ${passageiro.specialRequests?.includes('vegetariana') ? 'checked' : ''}>
                    Refeição vegetariana
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" name="alimentar_${idx}" value="vegana" ${passageiro.specialRequests?.includes('vegana') ? 'checked' : ''}>
                    Refeição vegana
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" name="alimentar_${idx}" value="sem_gluten" ${passageiro.specialRequests?.includes('sem_gluten') ? 'checked' : ''}>
                    Sem glúten
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" name="alimentar_${idx}" value="kosher" ${passageiro.specialRequests?.includes('kosher') ? 'checked' : ''}>
                    Kosher
                </label>
            </div>
        `;
        container.appendChild(div);
    });

    // Salvar alterações
    document.getElementById('formSolicitacoes').addEventListener('submit', (e) => {
        e.preventDefault();

        passageiros.forEach((passageiro, idx) => {
            const requests = [];

            // Acessibilidade
            const acessibilidade = document.querySelectorAll(`input[name="acessibilidade_${idx}"]:checked`);
            acessibilidade.forEach(cb => requests.push(cb.value));

            // Alimentares
            const alimentares = document.querySelectorAll(`input[name="alimentar_${idx}"]:checked`);
            alimentares.forEach(cb => requests.push(cb.value));

            passageiro.specialRequests = requests;
        });

        localStorage.setItem('carrinhoMeuVoo', JSON.stringify(carrinho));
        alert('Solicitações especiais salvas com sucesso!');
        window.location.href = 'carrinho.html';
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
        window.location.href = 'carrinho.html';
    });
});