const LinkCheck = (() => {
  const ENCURTADORES = ["bit.ly","tinyurl.com","t.co","goo.gl","is.gd","cutt.ly","rb.gy","shorturl.at","ow.ly","buff.ly","tiny.cc","s.id","encurtador.com.br","l.wl.co","wa.me"];
  const TLDS_RUINS = ["xyz","top","click","zip","mov","tk","ml","ga","cf","gq","buzz","icu","cyou","sbs","rest","fit","monster","cam","work","loan","country","stream","download","win"];
  const MARCAS = [
    {k:"nubank",d:["nubank.com.br"]},{k:"bradesco",d:["bradesco.com.br","banco.bradesco"]},{k:"itau",d:["itau.com.br","itau.com"]},
    {k:"santander",d:["santander.com.br"]},{k:"caixa",d:["caixa.gov.br"]},{k:"bancodobrasil",d:["bb.com.br"]},{k:"sicoob",d:["sicoob.com.br"]},
    {k:"mercadopago",d:["mercadopago.com.br","mercadopago.com"]},{k:"mercadolivre",d:["mercadolivre.com.br","mercadolibre.com"]},
    {k:"correios",d:["correios.com.br"]},{k:"paypal",d:["paypal.com"]},{k:"netflix",d:["netflix.com"]},{k:"whatsapp",d:["whatsapp.com","wa.me"]},
    {k:"receita",d:["gov.br","receita.fazenda.gov.br"]},{k:"gov",d:["gov.br"]},{k:"magalu",d:["magazineluiza.com.br","magalu.com"]},
    {k:"shopee",d:["shopee.com.br"]},{k:"amazon",d:["amazon.com.br","amazon.com"]},{k:"inter",d:["bancointer.com.br"]},{k:"picpay",d:["picpay.com"]},
    {k:"google",d:["google.com","google.com.br"]},{k:"apple",d:["apple.com"]},{k:"instagram",d:["instagram.com"]},{k:"facebook",d:["facebook.com"]}
  ];
  const PALAVRAS = ["login","verifica","senha","atualiz","confirm","pix","boleto","token","segur","bloque","regulariz","premio","resgat","cadastro","acesso"];
  const SLD2 = new Set(["com","net","org","gov","edu","co"]);

  function dominioRegistravel(host) {
    const p = host.split(".");
    if (p.length >= 3 && p[p.length - 1].length === 2 && SLD2.has(p[p.length - 2])) return p.slice(-3).join(".");
    return p.slice(-2).join(".");
  }
  const leet = s => s.replace(/0/g,"o").replace(/1/g,"i").replace(/3/g,"e").replace(/5/g,"s").replace(/rn/g,"m").replace(/vv/g,"w");

  function analisar(entrada) {
    const motivos = []; let pts = 0;
    const add = (p, m) => { pts += p; motivos.push({p, m}); };
    let s = entrada.trim();
    if (!s) return null;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = "https://" + s;
    let u; try { u = new URL(s); } catch { return {nivel: "alto", pts: 99, motivos: [{p: 99, m: "O endereço não é um link válido."}], url: entrada, host: ""}; }
    const host = u.hostname.toLowerCase();
    if (/^(javascript|data|vbscript|file):/i.test(u.protocol + "")) add(8, "Protocolo perigoso (" + u.protocol + ").");
    if (u.protocol === "http:") add(2, "Sem HTTPS: a conexão não é protegida.");
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || /^\[.*\]$/.test(host)) add(4, "Usa número de IP no lugar de um nome de site.");
    if (host.includes("xn--")) add(4, "Endereço com caracteres disfarçados (punycode), comum em sites que imitam outros.");
    if (/[^\x00-\x7f]/.test(entrada.split("/")[2] || "")) add(4, "Letras fora do padrão no nome do site (podem imitar letras parecidas).");
    if (entrada.includes("@") && /@/.test((entrada.split("?")[0].split("//")[1] || "").split("/")[0])) add(4, "Contém “@” antes do site: o endereço real é o que vem depois.");
    if (u.port && !["80","443"].includes(u.port)) add(2, "Porta incomum (" + u.port + ").");
    const reg = dominioRegistravel(host), tld = host.split(".").pop();
    if (TLDS_RUINS.includes(tld)) add(2, `Terminação “.${tld}” muito usada em golpes.`);
    if (ENCURTADORES.includes(host) || ENCURTADORES.includes(reg)) add(3, "Link encurtado: esconde o destino real. Não dá para saber para onde vai sem abri-lo.");
    const sub = host.split(".").length - reg.split(".").length;
    if (sub >= 3) add(2, "Muitos subdomínios, técnica comum para parecer um site conhecido.");
    if (host.length > 35) add(1, "Nome do site muito longo.");
    if ((host.match(/-/g) || []).length >= 3) add(1, "Muitos hifens no nome do site.");
    const norm = leet(host.replace(/[-.]/g, ""));
    for (const m of MARCAS) {
      if (norm.includes(m.k)) {
        const oficial = m.d.some(d => host === d || host.endsWith("." + d));
        if (!oficial) { add(5, `Cita “${m.k}” no endereço, mas não é o site oficial (${m.d[0]}).`); break; }
      }
    }
    const alvo = (u.pathname + u.search).toLowerCase();
    const achadas = PALAVRAS.filter(p => alvo.includes(p));
    if (achadas.length) add(Math.min(3, achadas.length), "Palavras típicas de golpe no link: " + achadas.slice(0, 4).join(", ") + ".");
    if (/(url|redirect|redir|next|goto|dest)=https?/i.test(u.search) || /https?%3a/i.test(u.search)) add(2, "Redireciona para outro site dentro do próprio link.");
    if (entrada.length > 120) add(1, "Link muito longo.");
    if (!motivos.length) motivos.push({p: 0, m: "Nenhum sinal de alerta no endereço em si. Isso não garante que seja seguro."});
    const nivel = pts >= 6 ? "alto" : pts >= 3 ? "medio" : "baixo";
    const enc = encodeURIComponent(u.href);
    return {nivel, pts, motivos, url: u.href, host, externos: [
      ["VirusTotal", "https://www.virustotal.com/gui/search/" + enc],
      ["Google Safe Browsing", "https://transparencyreport.google.com/safe-browsing/search?url=" + enc],
      ["urlscan.io", "https://urlscan.io/search/#" + enc],
      ["PhishTank", "https://phishtank.org/"]
    ]};
  }
  return {analisar};
})();
