# ✈️ MeuVoo – Sistema de Passagens Aéreas

Sistema completo para busca, reserva e gestão de passagens aéreas, desenvolvido como projeto da disciplina de **Projeto de Software**.

## 🛠️ Tecnologias Utilizadas

- **Backend:** Java 25 + Spring Boot 3 + Spring Data JPA
- **Banco de Dados:** H2 (em memória)
- **Frontend:** HTML5, CSS3, JavaScript (ES6) puro
- **Gerenciador de dependências:** Maven (wrapper incluso)

## 📋 Pré‑requisitos

| Ferramenta | Versão Mínima | Onde Baixar |
|------------|---------------|-------------|
| IDE Java   | Qualquer uma  | IntelliJ IDEA (recomendado), Eclipse, VS Code |

> ✅ **O projeto já contém o Java embutido na IDE?**  
> Não, mas ao abrir o projeto no **IntelliJ IDEA**, a IDE automaticamente reconhece e baixa o JDK 25 necessário (ou usa um já configurado). Nenhuma instalação manual de Java é necessária se você estiver usando uma IDE moderna.

## 🚀 Como Executar o Projeto

A maneira mais simples é abrir o projeto no **IntelliJ IDEA**.

### 🔹 Passo a passo (IntelliJ IDEA)

1. **Abra o IntelliJ IDEA**.
   
2. **Crie uma pasta vazia** no seu computador (ex: `MeuVoo`).]
   
3. **Abra essa pasta no terminal** (clique com botão direito dentro da pasta e selecione "Abrir no Terminal" ou "Git Bash Here").
   
4. **Clone o repositório** com o comando:
   
   ```bash
   git clone https://github.com/iancarlosct/ProjetoOO-Descolar
   
5. **Aguarde o IntelliJ carregar o projeto e baixar as dependências automaticamente** (isso pode levar alguns minutos).

6. Navegue até o arquivo: `src/main/java/com/decolar/sistema_voos/SistemaVoosApplication.java`

7. Clique com o botão direito sobre esse arquivo e selecione `Run 'SistemaVoosApplication main()'`.

8. Aparecerá um console com o servidor rodando. Por fim, será aberto automaticamente o navegador com a página inicial da aplicação.

### 🔹 Acesso Manual

Caso o navegador não abra automaticamente, navegue até `src\main\resources\static\index.html`, clique o o "botão direito" e selecione `Open in: Browser` (Google Chrome recomendado)

## 📌 Observações Importantes

- O banco de dados é **volátil** (H2 em memória). Os dados são perdidos ao parar o backend.
- A cada reinicialização do backend, **5000 voos de exemplo** são gerados automaticamente.
- O console do H2 pode ser acessado em: `http://localhost:8080/h2-console`  
  - **JDBC URL:** `jdbc:h2:mem:testdb`
  - **Usuário:** `sa`
  - **Senha:** (vazio)
- Certifique-se de que a porta `8080` esteja livre antes de iniciar o backend.

## 📞 Suporte

Em caso de dúvidas, entre em contato com o desenvolvedor:  

**Ian Tenório**:

[iancarlosct@gmail.com] - Pessoal

[icct@ic.ufal.br] - Acadêmico
