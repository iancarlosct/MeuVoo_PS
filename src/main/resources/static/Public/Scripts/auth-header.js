document.addEventListener('DOMContentLoaded', () => {
    const authArea = document.getElementById('authHeaderArea');
    if (!authArea) return;

    const usuario = JSON.parse(localStorage.getItem('usuarioMeuVoo'));

    // Detecta se a página está na raiz ou em Public/
    const isInPublicFolder = window.location.pathname.includes('/Public/');
    const loginPath = isInPublicFolder ? 'login.html' : 'Public/login.html';

    if (usuario && usuario.nome) {
        authArea.innerHTML = `
            <span class="user-greeting">Olá, ${usuario.nome.split(' ')[0]}</span>
            <button class="btn-logout" id="btnLogout">Sair</button>
        `;
        document.getElementById('btnLogout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioMeuVoo');
            window.location.href = isInPublicFolder ? '../index.html' : 'index.html';
        });
    } else {
        authArea.innerHTML = `
            <a href="${loginPath}" class="btn-login">Entrar / Cadastrar</a>
        `;
    }
});