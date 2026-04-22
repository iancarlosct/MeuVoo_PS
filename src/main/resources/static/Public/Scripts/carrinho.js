/*
 * carrinho.js
 *
 * Lógica da página do carrinho de compras. Carrega os itens armazenados no localStorage,
 * exibe os voos selecionados com opções de personalização (assentos, bagagens, solicitações),
 * calcula e atualiza o resumo financeiro, e redireciona para a finalização da compra.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------- ELEMENTOS DA INTERFACE ----------
    const containerItens = document.getElementById('itensCarrinho');
    const divVazio = document.getElementById('carrinhoVazio');
    const resumoDiv = document.getElementById('resumoCarrinho');
    const subtotalSpan = document.getElementById('subtotal');
    const taxasSpan = document.getElementById('taxas');
    const totalSpan = document.getElementById('total');
    const btnFinalizar = document.getElementById('btnFinalizar');

    // ---------- CONFIGURAÇÕES ----------
    const TAXA_FIXA = 45.90; // taxa de serviço fixa para qualquer compra

    // ---------- CARREGAMENTO DO CARRINHO ----------
    let carrinho = JSON.parse(localStorage.getItem('carrinhoMeuVoo')) || [];

    // ---------- MAPEAMENTO SIGLA → CIDADE PARA EXIBIÇÃO ----------
    const siglaParaCidade = {
        'GRU': 'São Paulo',
        'CGH': 'São Paulo (Congonhas)',
        'VCP': 'Campinas',
        'GIG': 'Rio de Janeiro (Galeão)',
        'SDU': 'Rio de Janeiro (Santos Dumont)',
        'BSB': 'Brasília',
        'SSA': 'Salvador',
        'REC': 'Recife',
        'FOR': 'Fortaleza',
        'CNF': 'Belo Horizonte',
        'PLU': 'Belo Horizonte (Pampulha)',
        'CWB': 'Curitiba',
        'POA': 'Porto Alegre',
        'MAO': 'Manaus',
        'SCL': 'Santiago',
        'EZE': 'Buenos Aires',
        'MIA': 'Miami',
        'JFK': 'Nova York',
        'LIS': 'Lisboa',
        'LHR': 'Londres',
        'CDG': 'Paris',
        'LIM': 'Lima',
        'FCO': 'Roma'
    };

    function obterNomeCidade(sigla) {
        return siglaParaCidade[sigla] || sigla;
    }

    function formatarData(dataISO) {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // ---------- FUNÇÕES DE MANIPULAÇÃO DO CARRINHO ----------
    function salvarCarrinho() {
        localStorage.setItem('carrinhoMeuVoo', JSON.stringify(carrinho));
    }

    function calcularTotais() {
        const subtotal = carrinho.reduce((acc, item) => {
            const totalItem = item.totalPrice || (item.basePrice * item.passengers.length);
            return acc + totalItem;
        }, 0);
        const taxas = carrinho.length > 0 ? TAXA_FIXA : 0;
        const total = subtotal + taxas;
        return { subtotal, taxas, total };
    }

    function atualizarResumo() {
        const { subtotal, taxas, total } = calcularTotais();
        subtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        taxasSpan.textContent = `R$ ${taxas.toFixed(2).replace('.', ',')}`;
        totalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    function removerItem(index) {
        carrinho.splice(index, 1);
        salvarCarrinho();
        renderizarCarrinho();
    }

    // ---------- RENDERIZAÇÃO DA LISTA DE ITENS ----------
    function renderizarCarrinho() {
        if (carrinho.length === 0) {
            containerItens.innerHTML = '';
            divVazio.style.display = 'block';
            resumoDiv.style.display = 'none';
            return;
        }

        divVazio.style.display = 'none';
        resumoDiv.style.display = 'block';

        let html = '';
        carrinho.forEach((item, index) => {
            const dataFormatada = formatarData(item.date);
            const precoUnitario = item.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const totalItemValue = item.totalPrice || (item.basePrice * item.passengers.length);
            const totalItem = totalItemValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const classeFormatada = item.flightClass === 'ECONOMICA' ? 'Econômica' : 'Executiva';
            const numPassageiros = item.passengers.length;

            html += `
                <div class="item-carrinho" data-index="${index}">
                    <div class="item-info">
                        <div class="item-rota">${obterNomeCidade(item.from)} → ${obterNomeCidade(item.to)}</div>
                        <div class="item-detalhes">
                            <span>📅 ${dataFormatada} • ${item.departure || ''}</span>
                            <span>✈️ ${item.airline} • ${classeFormatada}</span>
                            <span>👤 ${numPassageiros} ${numPassageiros > 1 ? 'passageiros' : 'passageiro'}</span>
                        </div>
                        <div class="item-preco-unitario">Preço unitário: ${precoUnitario}</div>
                    </div>
                    <div class="item-acoes">
                        <div class="item-preco-total">Total: ${totalItem}</div>
                        <div class="acoes-personalizacao">
                            <button class="btn-personalizar" data-index="${index}" data-acao="assentos">💺 Assentos</button>
                            <button class="btn-personalizar" data-index="${index}" data-acao="bagagens">🧳 Bagagens</button>
                            <button class="btn-personalizar" data-index="${index}" data-acao="solicitacoes">♿ Solicitações</button>
                        </div>
                        <button class="btn-remover" data-index="${index}">Remover</button>
                    </div>
                </div>
            `;
        });
        containerItens.innerHTML = html;
        atualizarResumo();
        adicionarEventos();
    }

    // ---------- EVENT LISTENERS DOS BOTÕES ----------
    function adicionarEventos() {
        // Botão Remover
        document.querySelectorAll('.btn-remover').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                if (index !== undefined) removerItem(parseInt(index));
            });
        });

        // Botões de personalização (assentos, bagagens, solicitações)
        document.querySelectorAll('.btn-personalizar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const acao = e.target.dataset.acao;
                const index = e.target.dataset.index;
                const item = carrinho[index];

                if (acao === 'assentos') {
                    window.location.href = `selecao-assentos.html?item=${index}`;
                } else if (acao === 'bagagens') {
                    window.location.href = `bagagens.html?item=${index}`;
                } else if (acao === 'solicitacoes') {
                    window.location.href = `solicitacoes.html?item=${index}`;
                } else {
                    alert(`Funcionalidade de ${acao} para o voo ${obterNomeCidade(item.from)} → ${obterNomeCidade(item.to)} será implementada em breve.`);
                }
            });
        });
    }

    // ---------- FINALIZAÇÃO DA COMPRA ----------
    btnFinalizar.addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio.');
            return;
        }
        const usuario = JSON.parse(localStorage.getItem('usuarioMeuVoo'));
        if (!usuario) {
            alert('Faça login para continuar.');
            window.location.href = 'login.html';
            return;
        }
        window.location.href = 'dados-passageiros.html';
    });

    // ---------- INICIALIZAÇÃO ----------
    renderizarCarrinho();
});