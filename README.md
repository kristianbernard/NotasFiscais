# 🧠 TributoJusto – Backend

API desenvolvida em ASP.NET Core que consome dados fiscais de um banco de dados, analisa com Azure OpenAI e responde perguntas com base em informações reais extraídas de arquivos CSV e armazenadas em banco.

---

## 🚀 Instruções de Execução

### Pré-requisitos:

- .NET 8 SDK
- MySQL instalado e configurado
- Docker (se quiser rodar MySQL via container)
- Azure OpenAI configurado com API Key válida

### Passos:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seuusuario/tributo-justo-backend.git
   cd tributo-justo-backend
   ```

2. **Configure o banco:**
   - Crie o banco MySQL com as tabelas: `Usuarios`, `Notas`, `Itens`.
   - Atualize a connection string no `appsettings.json`.

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=tributo_db;User=root;Password=1234;"
   }
   ```

3. **Configure a API do Azure OpenAI:**
   No `appsettings.json`:
   ```json
   "AzureOpenAI": {
     "Endpoint": "https://SEU-ENDPOINT.openai.azure.com/",
     "Key": "SUA-API-KEY",
     "DeploymentName": "gpt-35-turbo"
   }
   ```

4. **Rode o projeto:**
   ```bash
   dotnet build
   dotnet run
   ```

   A API será iniciada em: `https://localhost:5133`

---

## ⚙️ Decisões Técnicas

- **ASP.NET Core Web API**: arquitetura limpa, escalável, ideal para microserviços.
- **Entity Framework Core + MySQL**: ORM para mapeamento objeto-relacional.
- **JWT Auth**: autenticação segura para proteger endpoints.
- **Azure OpenAI**: análise inteligente dos dados para responder perguntas complexas.
- **Separação de camadas**:
  - `Controllers`: interface pública da API.
  - `Models`: representação do banco de dados.
  - `Data`: contexto de persistência.

---

## 🧪 Como Testar

### Requisição de login (POST):

**Endpoint:** `/api/auth/login`

**Body:**
```json
{
  "username": "usuario",
  "password": "senha"
}
```

**Resposta:**
```json
{
  "token": "JWT-AQUI"
}
```

---

### Requisição de interpretação (POST):

**Endpoint:** `/api/relatorio/interpretar`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**
```json
{
  "pergunta": "Qual o item mais caro?"
}
```

**Resposta esperada:**
```json
{
  "resposta": "Com base nos dados disponíveis, o item mais caro é: Notebook Dell R$ 14.500,00"
}
```

---

### Dica:
- Use o **Postman** ou o **Thunder Client (VSCode)** pra testar os endpoints.
- Faça perguntas variadas:  
  - “Qual CNPJ teve mais notas?”  
  - “Qual o total de impostos pagos?”  
  - “Qual o item mais vendido?”

---

## 📌 Autor

Kristian – Desenvolvedor FullStack | [LinkedIn](https://www.linkedin.com)