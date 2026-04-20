document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mensagemDiv = document.getElementById('mensagem');

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('usuarioMeuVoo', JSON.stringify(data));
            window.location.href = '../index.html';
        } else {
            const erro = await response.text();
            mensagemDiv.textContent = erro || 'Credenciais inválidas.';
        }
    } catch (error) {
        mensagemDiv.textContent = 'Erro de conexão. Tente novamente.';
    }
});