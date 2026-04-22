/*
 * auth-header.js
 *
 * Gerencia a exibição dinâmica do cabeçalho de autenticação em todas as páginas.
 * Verifica se há um usuário logado (armazenado no localStorage) e exibe
 * uma saudação com botão de logout ou o link para login/cadastro, conforme o estado.
 * O logout limpa todas as chaves relacionadas ao usuário para evitar vazamento de dados.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------- VERIFICAÇÃO DO CONTAINER ----------
    const authArea = document.getElementById('authHeaderArea');
    if (!authArea) return;

    // ---------- LEITURA DO USUÁRIO LOGADO ----------
    const usuario = JSON.parse(localStorage.getItem('usuarioMeuVoo'));

    // ---------- DETECÇÃO DO CAMINHO (RAIZ OU PUBLIC/) ----------
    const isInPublicFolder = window.location.pathname.includes('/Public/');
    const loginPath = isInPublicFolder ? 'login.html' : 'Public/login.html';

    // ---------- RENDERIZAÇÃO CONDICIONAL ----------
    if (usuario && usuario.nome) {
        authArea.innerHTML = `
            <span class="user-greeting">Olá, ${usuario.nome.split(' ')[0]}</span>
            <button class="btn-logout" id="btnLogout">Sair</button>
        `;
        document.getElementById('btnLogout').addEventListener('click', (e) => {
            e.preventDefault();
            // Remove TODAS as informações do usuário atual para evitar cruzamento de dados
            localStorage.removeItem('usuarioMeuVoo');
            localStorage.removeItem('carrinhoMeuVoo');      // carrinho de compras
            localStorage.removeItem(`historicoReservas_${usuario.id}`); // histórico da conta atual
            window.location.href = isInPublicFolder ? '../index.html' : 'index.html';
        });
    } else {
        authArea.innerHTML = `
            <a href="${loginPath}" class="btn-login">Entrar / Cadastrar</a>
        `;
    }
});