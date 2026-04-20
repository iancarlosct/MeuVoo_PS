document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const mensagemDiv = document.getElementById('mensagem');

    if (password !== confirmPassword) {
        mensagemDiv.textContent = 'As senhas não coincidem.';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, cpf, password })
        });
        if (response.ok) {
            alert('Cadastro realizado com sucesso! Faça login.');
            window.location.href = 'login.html';
        } else {
            const erro = await response.text();
            mensagemDiv.textContent = erro || 'Erro ao cadastrar.';
        }
    } catch (error) {
        mensagemDiv.textContent = 'Erro de conexão. Tente novamente.';
    }
});