## Instruções

Suba a imagem docker
`docker compose up -d`

Adicione a url de do banco no arquivo .env
`DATABASE_URL={URL_DO_BANCO}`

Adicione uma API key que o sistemas enviaram no header para acessar o back-end
`API_KEY={DEFINA_UMA_API}`

Rodar o projeto localmente
`npm run dev`

Após fazer modificações no arquivo prisma.schema, rode para gerar a tipagem
`npx prisma generate`

Para fazer uma nova migration no projeto
`npx prisma migrate dev`

Para realizar um teste especifico
`npm run test --path/to/test.spec.ts`
Examplo:
`npm run test --back-end/src/helpers/seconds-to-time/seconds-to-time.spec.ts`

Para expor o servidor local para acesso remoto, instale o ngrok e rode:
`ngrok http http://localhost:PORT`
Sendo que PORT é o mesmo valor de PORT do arquivo .env
Exemplo:
`ngrok http http://localhost:3333`
