# Uso da API de Práticas Sustentáveis

Este documento mostra de forma simples como cadastrar atividades, ver o histórico e consultar estatísticas.

## 1. Início

- Certifique-se de que o servidor está rodando.
- A URL base da API é:
  - `http://localhost:3000`
- Os dados são enviados e recebidos em JSON.

---

### 2. Configuração

Para rodar esta API localmente, você precisará configurar as variáveis de ambiente para a conexão com o MongoDB Cloud. Na raiz do projeto, você encontrará um arquivo chamado .env.example. Ele serve como um guia para as configurações necessárias. 

Crie uma cópia do arquivo .env.example e renomeie-a para .env. No terminal, você pode usar: cp .env.example .env
Abra o arquivo .env recém-criado e substitua os campos <usuario> e <senha> pelas suas credenciais do MongoDB Atlas


## 3. Como cadastrar uma atividade

Use o método `POST` no endpoint `/api/praticas`.

### Exemplo com `curl`

```bash
curl -X POST http://localhost:3000/api/praticas \
  -H "Content-Type: application/json" \
  -d '{
    "nomeUsuario": "Ana",
    "tipo": "Uso de copo reutilizável",
    "data": "2026-05-12",
    "descricao": "Levei meu copo para a faculdade"
  }'
```

### Campos obrigatórios

- `nomeUsuario` (string)
- `tipo` (string)
- `data` (string no formato `YYYY-MM-DD`)

### Campos opcionais

- `descricao` (string)

---

## 4. Como ver todas as práticas cadastradas

Use o método `GET` no endpoint `/api/praticas`.

### Exemplo com `curl`

```bash
curl -X GET http://localhost:3000/api/praticas
```

Esse comando retorna todas as práticas salvas no sistema.

---

## 5. Como ver o histórico com filtros

Use o método `GET` no endpoint `/api/historico`.

### Exemplo sem filtros

```bash
curl -X GET "http://localhost:3000/api/historico"
```

### Exemplo com filtro por usuário

```bash
curl -X GET "http://localhost:3000/api/historico?nomeUsuario=Ana"
```

### Exemplo com filtro por período

```bash
curl -X GET "http://localhost:3000/api/historico?dataInicial=2026-05-01&dataFinal=2026-05-12"
```

### Filtros disponíveis

- `nomeUsuario`
- `tipo`
- `dataInicial` (YYYY-MM-DD)
- `dataFinal` (YYYY-MM-DD)

---

## 6. Como ver estatísticas

Use o método `GET` no endpoint `/api/estatisticas`.

### Exemplo com `curl`

```bash
curl -X GET http://localhost:3000/api/estatisticas
```

Esse comando retorna estatísticas consolidadas das práticas cadastradas.

---

## 7. Resumo 

1. Cadastrar atividade: `POST /api/praticas`
2. Ver todas as práticas: `GET /api/praticas`
3. Ver histórico: `GET /api/historico`
4. Ver estatísticas: `GET /api/estatisticas`

