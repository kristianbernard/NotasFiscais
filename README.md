# Desafio Técnico – Desenvolvedor(a) Pleno (Fullstack)

## 🎯 Objetivo Geral

Construir uma aplicação fullstack (API + front-end) para carga e análise de dados fiscais a partir de arquivos `.csv`, com geração de relatórios e insights automatizados.

---

## 📂 Arquivo de entrada

Formato `.csv` com os seguintes campos:

```csv
cnpj, razao_social, numero_nota, data_emissao, codigo_item, descricao_item, quantidade, valor_unitario, imposto_item
```

---

## 🧱 Escopo da Solução

### 🔧 1. Back-end (Python FastAPI, Flask ou C# ASP.NET Core)

#### Funcionalidades obrigatórias:
- Upload de arquivo CSV
- Persistência em banco relacional (SQLite, PostgreSQL)

#### Regras de negócio:
- valor_total da nota = soma de (quantidade × valor_unitario)
- imposto_recolhido da nota = soma de imposto_item


---

### 📊 2. API REST – Endpoints obrigatórios

- POST /upload – upload e processamento do arquivo
- GET /relatorio – total de impostos por CNPJ, média da diferença
- GET /alertas – notas com diferença superior a 50%
- GET /estatisticas – KPIs gerais
- POST /auth/login e /auth/register – autenticação com JWT
- POST /relatorio/interpretar – (extra) integração com LLM

---

### 💻 3. Front-end (React ou equivalente)

#### Telas obrigatórias:
- Login e registro
- Upload de arquivo CSV
- Visualização de relatório com filtros
- Tela de alertas
- Tela de estatísticas
- Botão para “Gerar Insight com IA” (extra)

---

## 🤖 Integração com LLM (extra)

> Criar um endpoint `/relatorio/interpretar` que use a API do OpenAI ou HuggingFace para gerar um texto como:

> “A empresa X apresentou recolhimento médio de 14% no período. Nota 2023 teve recolhimento abaixo da média para o NCM 1234.”

---

## 🛠️ Tecnologias sugeridas

- Back-end: Python (FastAPI/Flask) ou C# .NET
- Front-end: React ou VueJs
- Banco de dados: PostgreSQL, MySql ou SQLite
- Outros: Docker (desejável), Swagger/Postman, CI opcional

---

## ✅ Critérios de Avaliação

| Critério                             | Peso |
|-------------------------------------|------|
| Modelagem de dados relacional       | Alto |
| Clareza na arquitetura do código    | Alto |
| Cobertura e qualidade de testes     | Médio |
| Uso adequado de REST e JWT          | Alto |
| Filtros funcionais e bem implementados | Médio |
| Responsividade e usabilidade básica | Médio |
| Integração front-back               | Médio |
| (Opcional) Criatividade com LLM     | Bônus |

---

## 📦 Entrega

- Faça um fork deste repositório
  - /backend
  - /frontend
  - /dados (CSV de exemplo)
- README.md com:
  - Instruções de execução
  - Decisões técnicas
  - Como testar
- Prazo: até 3 dias após o recebimento
- Enviar para: marcio.faria@tributojusto.com.br com o assunto:
  Entrega Desafio Técnico – Pleno – [Seu Nome]
