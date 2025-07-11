# 🧠 NotasFiscais – Backend

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
   git clone https://github.com/kristianbernard/NotasFiscais.git
   cd tributos
   ```

2. **Configure o banco:**
   - Crie o banco MySQL com as tabelas: `Usuarios`, `Notas`, `Itens`.
   - Atualize a connection string no `appsettings.json`.

**Estrutura do Banco de Dados**

As tabelas foram criadas com base na seguinte estrutura:

### Tabela `Notas`

```sql
CREATE TABLE `db_tributo`.`tbl_notas_fiscais` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Cnpj` VARCHAR(45) NULL,
  `razao_social` VARCHAR(255) NULL,
  `numero_nota` VARCHAR(45) NULL,
  `data_emissao` DATE NULL,
  PRIMARY KEY (`id`));

```

### Tabela `Itens`

```sql
CREATE TABLE `db_tributos`.`tbl_itens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo_item` VARCHAR(45) NULL,
  `descricao_item` TEXT NULL,
  `quantidade` DECIMAL (10,2) NULL,
  `valor_unitario` DECIMAL(18,2) NULL,
  `imposto_item` DECIMAL(18,2) NULL,
  `notas_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_idx` (`notas_id` ASC) VISIBLE,
  CONSTRAINT `Id_NotasFiscais_Item`
    FOREIGN KEY (`notas_id`)
    REFERENCES `db_tributos`.`tbl_notas_fiscais` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

```

Essas tabelas representam uma relação de um-para-muitos, onde uma nota fiscal pode conter vários itens.

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

### 📤 Upload de Arquivo CSV

**POST** `/api/Arquivo/upload`

- Tipo: `multipart/form-data`
- Campo: `file` (selecione um `.csv` válido)

---

### 📈 Estatísticas Consolidadas

**GET** `/api/Relatorio/estatisticas`

> Retorna total de notas, total de itens, valor total e imposto total.

---

### 📊 Relatório Detalhado

**GET** `/api/Relatorio/detalhado`

> Lista todas as notas fiscais processadas com CNPJ, valor, imposto, etc.

---

### 🧠 Gerar Insights com IA

**POST:** `/api/relatorio/interpretar`

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

Kristian – Desenvolvedor FullStack | [LinkedIn](https://www.linkedin.com/in/kristian-bernard/)
