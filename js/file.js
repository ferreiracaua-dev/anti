const FileCheck = (() => {
  const RISCO = new Set(["exe","scr","bat","cmd","com","pif","msi","vbs","vbe","js","jse","wsf","wsh","ps1","jar","apk","lnk","hta","cpl","reg","dll","iso","img","dmg","appimage","sh","docm","xlsm","pptm"]);
  const DOCS = new Set(["pdf","doc","docx","xls","xlsx","ppt","pptx","txt","jpg","jpeg","png","gif","mp3","mp4","zip","rar"]);
  const hex = u8 => Array.from(u8, b => b.toString(16).padStart(2, "0")).join("");
  const ascii = u8 => { let s = ""; for (let i = 0; i < u8.length; i++) s += u8[i] >= 32 && u8[i] < 127 ? String.fromCharCode(u8[i]) : "."; return s; };

  function tipoReal(h, nomeInterno) {
    const t = ascii(h.slice(0, 8));
    if (h[0] === 0x4d && h[1] === 0x5a) return {id: "exe", nome: "Programa do Windows (executável)", exec: true};
    if (h[0] === 0x7f && t.slice(1, 4) === "ELF") return {id: "elf", nome: "Programa Linux (executável)", exec: true};
    if (h[0] === 0xcf && h[1] === 0xfa && h[2] === 0xed && h[3] === 0xfe) return {id: "macho", nome: "Programa macOS (executável)", exec: true};
    if (t.startsWith("%PDF")) return {id: "pdf", nome: "Documento PDF"};
    if (t.startsWith("#!")) return {id: "script", nome: "Script de terminal", exec: true};
    if (h[0] === 0xff && h[1] === 0xd8) return {id: "jpg", nome: "Imagem JPEG"};
    if (h[0] === 0x89 && t.slice(1, 4) === "PNG") return {id: "png", nome: "Imagem PNG"};
    if (t.startsWith("GIF8")) return {id: "gif", nome: "Imagem GIF"};
    if (t.startsWith("Rar!")) return {id: "rar", nome: "Arquivo compactado RAR"};
    if (h[0] === 0x37 && h[1] === 0x7a && h[2] === 0xbc) return {id: "7z", nome: "Arquivo compactado 7-Zip"};
    if (h[0] === 0xd0 && h[1] === 0xcf && h[2] === 0x11 && h[3] === 0xe0) return {id: "ole", nome: "Documento antigo do Office (ou instalador MSI)", ole: true};
    if (h[0] === 0x50 && h[1] === 0x4b) return {id: "zip", nome: "Arquivo ZIP (também usado por Word, Excel e apps Android)", zip: true};
    return {id: "desconhecido", nome: "Tipo não identificado"};
  }
  async function sha256(buf) { return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", buf))); }

  async function analisar(file) {
    const motivos = []; let pts = 0; const add = (p, m) => { pts += p; motivos.push(m); };
    const MAX = 250 * 1024 * 1024;
    if (file.size > MAX) return {erro: "Arquivo grande demais para analisar aqui (limite 250 MB)."};
    const buf = await file.arrayBuffer();
    const u8 = new Uint8Array(buf);
    const hash = await sha256(buf);
    const nome = file.name, partes = nome.toLowerCase().split(".");
    const ext = partes.length > 1 ? partes.pop() : "";
    const real = tipoReal(u8.slice(0, 16));
    const amostra = ascii(u8.slice(0, 4 * 1024 * 1024)) + ascii(u8.slice(Math.max(0, u8.length - 1024 * 1024)));

    if (partes.length >= 2 && RISCO.has(ext) && DOCS.has(partes[partes.length - 1])) add(5, `Extensão dupla (“.${partes[partes.length - 1]}.${ext}”): parece um ${partes[partes.length - 1].toUpperCase()}, mas é um programa disfarçado.`);
    if (real.exec && ext !== "exe" && ext !== "") add(6, `O arquivo diz ser “.${ext}”, mas por dentro é um programa executável.`);
    else if (real.exec) add(4, "É um programa executável: pode instalar vírus assim que for aberto.");
    if (RISCO.has(ext) && !real.exec) add(3, `Extensão “.${ext}” pode executar código no seu aparelho.`);
    if (real.id === "jpg" && ext && !["jpg","jpeg"].includes(ext) || real.id === "png" && ext && ext !== "png" || real.id === "pdf" && ext && ext !== "pdf") add(3, "A extensão não combina com o conteúdo real do arquivo.");
    if (real.zip) {
      if (/AndroidManifest\.xml|classes\.dex/.test(amostra)) add(ext === "apk" ? 4 : 6, "Tem estrutura de aplicativo Android (APK). Instalar fora da loja oficial é arriscado.");
      if (/vbaProject\.bin/.test(amostra)) add(4, "Documento do Office com macros: macros podem executar programas.");
      if (u8[6] & 1) add(3, "Arquivo compactado protegido por senha: golpistas usam isso para escapar do antivírus.");
    }
    if (real.ole && /VBA|_VBA_PROJECT|Macros/.test(amostra)) add(4, "Documento antigo do Office com possíveis macros.");
    if (real.id === "pdf" && /\/(JavaScript|JS|Launch|OpenAction)\b/.test(amostra)) add(3, "PDF com recurso de execução automática (JavaScript/Launch).");
    if (real.id === "desconhecido" && ["pdf","jpg","png","docx","xlsx","mp3","mp4"].includes(ext)) add(2, "Diz ser “." + ext + "”, mas o conteúdo não bate com esse formato.");
    if (file.size < 200 && RISCO.has(ext)) add(1, "Arquivo minúsculo: pode ser só um “disparador” que baixa algo pior.");
    if (!motivos.length) motivos.push("Nenhum sinal de alerta na estrutura do arquivo. Isso não garante que seja seguro: confira o hash no VirusTotal.");
    const nivel = pts >= 6 ? "alto" : pts >= 3 ? "medio" : "baixo";
    return {nivel, motivos, nome, tamanho: file.size, ext, real: real.nome, hash, vt: "https://www.virustotal.com/gui/file/" + hash};
  }
  return {analisar};
})();
