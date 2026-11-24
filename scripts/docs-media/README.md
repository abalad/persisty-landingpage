# Vídeos das docs

As cenas dos vídeos das páginas de `content/docs/`, uma página por módulo: `<página>.mjs`. Cada vídeo mostra a interface da versão mais nova do app e fica em `public/docs-media/<página>/<nome>.mp4`, com a capa `<nome>.jpg`. O inventário (`docs/docs-coverage.md`, seções `## Mídia` e `## Páginas sem vídeo`) e o teste `tests/docs-media.test.ts` amarram os vídeos às páginas.

A gravação é feita pelo gravador do próprio app (`scripts/media/record.mjs` no repositório do app). Ele conduz o modo demonstração (`ipc.mock`, dados inventados) no Chrome sem janela, desenha o cursor e as teclas, e grava MP4 com capa JPG. Nada é commitado no repositório do app.

## Formato de um módulo

```js
export const version = "<página>"; // o gravador usa como pasta: public/docs-media/<página>/
export const clips = [{ name: "<nome>", query: "…", async run(ui) { … } }];
```

É o formato dos módulos do app (`scripts/media/clips.mjs` no app documenta os campos e os comandos de `ui`), sem `anchor` e `alt`: a descrição de cada vídeo mora no Markdown da página, nos três idiomas. Um rótulo usado num seletor vem de `apps/desktop/src/i18n/locales/pt-BR.json` do app, na tag gravada.

## Gravar

1. Uma cópia do app na tag mais nova, fora do repositório do app:

   ```bash
   APP=<pasta do persist-application>
   REC=<pasta temporária>/app-vX.Y.Z
   mkdir -p $REC && git -C $APP archive vX.Y.Z | tar -x -C $REC
   ```

2. As dependências: confirme que o checkout do app tem o mesmo lockfile da tag (`git -C $APP diff --quiet vX.Y.Z -- pnpm-lock.yaml`). Depois clone cada pasta `node_modules` dele, até a profundidade 3, para o mesmo lugar em `$REC`, com `cp -cR` (fora `.claude/`).
3. O servidor do desktop, numa porta livre, porque a 1420 costuma ser a do app em desenvolvimento: `cd $REC/apps/desktop && node_modules/.bin/vite --port 1431`.
4. Do repositório do site, com Node 22 ou mais novo, o Chrome em `/Applications` e o Swift (`xcrun swiftc`):

   ```bash
   node $REC/scripts/media/record.mjs --clips scripts/docs-media/<página>.mjs --out public/docs-media --base http://localhost:1431 [--only <nome>] [--keep]
   ```

   Com `--keep`, os quadros ficam numa pasta temporária, que o gravador imprime, para conferir.

## Conferir um vídeo

- De 6 a 12 s, e até 3 MB.
- Em quadros do começo, do meio e do fim, a interface é a da versão gravada, e os dados do modo demonstração não contradizem as docs.
- O modo demonstração às vezes abre no projeto Nimbus, numa sessão interrompida, quando a máquina está carregada. Confira no primeiro quadro que a cena começa no Atlas, na sessão api, e grave de novo se não começar.
- Uma cena com um arquivo TypeScript aberto leva `lsp=fake` na `query`: sem ele, a barra de status diz "sem servidor". Com ele, o cursor parado sobre o código abre a dica do servidor, que prende a roda do mouse; role e espere com o cursor sobre os números de linha (`{ selector: ".cm-scroller", dx: 0.02 }`).
- O gravador só clica com o botão esquerdo. Uma ação de menu de contexto vai pela paleta (`ui.press("Meta+k")`), com o nome inteiro da ação, para ela ser a única da lista.
- O registro de rede do modo demonstração dá bytes enviados às chamadas git e GET, e o app registra 0 nelas. Uma cena que mostra o registro faz só chamadas POST.
- Uma cena que falha com `not found {…}` tem o seletor ajustado aqui, nunca no app. Uma cena que o modo demonstração não monta fica sem vídeo, e a página entra em `## Páginas sem vídeo` com o motivo.

Uma versão que muda uma tela com vídeo regrava a cena dela, no mesmo envio do changelog.
