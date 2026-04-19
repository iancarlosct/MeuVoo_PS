document.addEventListener('DOMContentLoaded', () => {
  // ---------- Dados mockados iniciais (simulando itens no carrinho) ----------
  // Em produção, esses dados viriam do backend ou localStorage.
  const carrinhoMock = [
    {
      id: 1,
      origem: 'São Paulo (GRU)',
      destino: 'Recife (REC)',
      dataIda: '2026-05-20',
      passageiros: 2,
      classe: 'Econômica',
      precoUnitario: 174.00,
      quantidade: 1
    },
    {
      id: 2,
      origem: 'Rio de Janeiro (GIG)',
      destino: 'Santiago (SCL)',
      dataIda: '2026-06-10',
      passageiros: 1,
      classe: 'Executiva',
      precoUnitario: 710.00,
      quantidade: 2
    }
  ];

  // Usar localStorage se existir, senão inicializar com mock
  let carrinho = JSON.parse(localStorage.getItem('carrinhoMeuVoo')) || carrinhoMock;

  // Elementos
  const containerItens = document.getElementById('itensCarrinho');
  const divVazio = document.getElementById('carrinhoVazio');
  const resumoDiv = document.getElementById('resumoCarrinho');
  const subtotalSpan = document.getElementById('subtotal');
  const taxasSpan = document.getElementById('taxas');
  const totalSpan = document.getElementById('total');
  const btnFinalizar = document.getElementById('btnFinalizar');

  // Taxa fixa simulada (pode ser percentual)
  const TAXA_FIXA = 45.90;

  // ---------- Funções ----------
  function salvarCarrinho() {
    localStorage.setItem('carrinhoMeuVoo', JSON.stringify(carrinho));
  }

  function calcularTotais() {
    const subtotal = carrinho.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
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
    carrinho.forEach(item => {
      const totalItem = item.precoUnitario * item.quantidade;
      html += `
        <div class="item-carrinho" data-id="${item.id}">
          <div class="item-info">
            <div class="item-rota">${item.origem} → ${item.destino}</div>
            <div class="item-detalhes">
              <span>📅 ${formatarData(item.dataIda)}</span>
              <span>👤 ${item.passageiros} ${item.passageiros > 1 ? 'passageiros' : 'passageiro'}</span>
              <span>💺 ${item.classe}</span>
            </div>
          </div>
          <div class="item-acoes">
            <div class="item-preco">R$ ${totalItem.toFixed(2).replace('.', ',')}</div>
            <div class="quantidade-controle">
              <button class="quantidade-btn" data-action="decrement">−</button>
              <span class="quantidade-numero">${item.quantidade}</span>
              <button class="quantidade-btn" data-action="increment">+</button>
            </div>
            <button class="btn-remover" data-action="remove">Remover</button>
          </div>
        </div>
      `;
    });
    containerItens.innerHTML = html;
    atualizarResumo();
    adicionarEventosItens();
  }

  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function adicionarEventosItens() {
    document.querySelectorAll('.item-carrinho').forEach(itemDiv => {
      const id = parseInt(itemDiv.dataset.id);
      const item = carrinho.find(i => i.id === id);

      // Botões de quantidade
      itemDiv.querySelector('[data-action="increment"]')?.addEventListener('click', () => {
        if (item) {
          item.quantidade++;
          salvarCarrinho();
          renderizarCarrinho();
        }
      });

      itemDiv.querySelector('[data-action="decrement"]')?.addEventListener('click', () => {
        if (item && item.quantidade > 1) {
          item.quantidade--;
          salvarCarrinho();
          renderizarCarrinho();
        }
      });

      // Botão remover
      itemDiv.querySelector('[data-action="remove"]')?.addEventListener('click', () => {
        carrinho = carrinho.filter(i => i.id !== id);
        salvarCarrinho();
        renderizarCarrinho();
      });
    });
  }

  // Finalizar compra (simulação)
  btnFinalizar.addEventListener('click', () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }
    const { total } = calcularTotais();
    alert(`Compra finalizada! Total: R$ ${total.toFixed(2).replace('.', ',')}\nObrigado por voar com a MeuVoo!`);
    // Limpar carrinho após finalizar (opcional)
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
  });

  // Inicializar renderização
  renderizarCarrinho();
});