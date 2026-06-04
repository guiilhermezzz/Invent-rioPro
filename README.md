# InventárioPro

Projeto inicial para uma aplicação Vite + React + TypeScript + Tailwind CSS com autenticação Supabase e tela de inventário.

## Passos iniciais

1. Copie `.env.example` para `.env`
2. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Rode `npm install`
4. Rode `npm run dev`

## Estrutura

- `src/components` — componentes reutilizáveis
- `src/pages` — telas e rotas
- `src/contexts` — provedor de tema
- `src/lib/supabase` — cliente Supabase
- `src/schemas` — validações Zod

## Status

Este scaffold contém o layout inicial, rotas e a base de estilos com Tailwind. O próximo passo é implementar a lógica de autenticação, CRUD e dashboards conforme o escopo do projeto.
