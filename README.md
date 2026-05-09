# Brev.ly clone

Trabalho de avaliação da disciplina Fundamentos Técnicos e Estratégicos ministrada na Pós Graduação Full Stack com IA na Faculdade de Tecnologia Rocketseat.

API para gerenciar o encurtamento de URL’s + aplicação React que permite o gerenciamento de URL’s encurtadas.

## Requisitos

- Node v24 ou Bun.
- Docker ou Podman.

## Instruções

Clone o repositório:

```sh
git clone https://github.com/markgomer/brev.ly-clone.git
```

Executar o backend:

```sh
cd server && docker compose up -d
```

Executar o frontend:

```sh
cd web && bun i && bun run build && bun run preview
```

URL para Acessar aplicação pelo browser:

```sh
backend:  http://localhost:3333/docs
frontend: http://localhost:5173/
```
