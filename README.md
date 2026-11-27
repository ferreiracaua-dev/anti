# Anti

App web (PWA) para **enrolar golpistas** com uma persona de pessoa leiga e entregar só dados falsos. Roda no navegador (Windows, celular ou qualquer outro) e pode ser instalado como programa.

## O que tem
- **Enrolar:** personas (Dona Marlene, Seu Antônio, Ricardo o ansioso), nível de leigo 1–4 ou "Recomendado" (automático), estilo de escrita, respostas por tipo de golpe, cronômetro e placar. Você cola a mensagem do golpista e copia a resposta (semiautomático).
- **Dados falsos:** nome, endereço por país (Brasil, Portugal, EUA, Argentina, Espanha), telefone, CPF com dígitos verificadores **inválidos**, cartão que **falha** no teste de Luhn, e-mail temporário (mail.tm) e alias de Gmail.
- **Verificar link:** análise local do endereço, sem abrir o link, com nível de risco e motivos + atalhos para VirusTotal, Safe Browsing e urlscan.
- **Verificar arquivo:** lê o arquivo só no seu aparelho; calcula SHA-256, confere tipo real, extensão dupla, macros, APK, ZIP com senha.
- **Diário e placar:** guarda as conversas no navegador e exporta um relatório .txt para denúncia.
- **Caí no golpe, e agora?** passo a passo de emergência e lista de golpes comuns.

## Fora do escopo (de propósito)
Comprovante bancário falso, imitação de banco/órgão e rastreio de quem clica em link. O objetivo é enrolar e denunciar, nunca expor ou retaliar.

## Como usar
Abra `index.html` por um servidor (necessário para o PWA e para o cálculo de hash):
```
python3 -m http.server 8000   # depois abra http://localhost:8000
```
Também funciona publicado no GitHub Pages (Settings → Pages → branch `main`, pasta raiz).

## Estrutura
`index.html` · `css/style.css` · `js/` (`data`, `gen`, `persona`, `link`, `file`, `diary`, `app`) · `sw.js` · `manifest.webmanifest`

## Limites
Nenhum verificador pega 100%: o resultado é nível de risco, não veredito. Endereços sorteados podem coincidir por acaso com lugares reais; nunca misture com dados de pessoas reais.
