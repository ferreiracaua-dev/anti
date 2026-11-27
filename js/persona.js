const Persona = (() => {
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  const RX = {
    pix: /\bpix\b|transfer[êe]ncia|comprovante|dep[óo]sito|chave pix|estorno|devolu[çc][ãa]o/i,
    suporte: /banco|suporte|central|seguran[çc]a|movimenta[çc][ãa]o|cart[ãa]o|conta (foi|est[áa])|bloquead|gerente|fraude/i,
    entrega: /encomenda|entrega|pacote|correios|rastre|taxa|transportadora|objeto/i,
    emprego: /vaga|emprego|trabalh|renda extra|ganhar|home ?office|comiss[ãa]o|investimento|lucro|renda/i,
    parente: /n[úu]mero novo|mudei de n[úu]mero|oi m[ãa]e|oi pai|sou eu|meu celular quebrou|novo n[úu]mero|\btia\b|\bv[óo]\b/i,
    premio: /pr[êe]mio|sorteio|ganhou|ganhador|contemplad|parab[ée]ns/i,
    codigo: /c[óo]digo|token|sms|senha|verifica[çc][ãa]o|6 d[íi]gitos|confirma[çc][ãa]o/i
  };
  const IRRITADO = /r[áa]pido|urgente|agora|idiota|burr[oa]|an[ta]a?|!!+|logo|demor|n[ãa]o enrola|perdendo tempo/i;
  const DESCONFIA = /rob[ôo]|\bbot\b|voc[êe] [ée] (real|pessoa|humano)|golpe|fake|falso|est[áa] me enrolando|pr[óo]prio?/i;

  function detectarTipo(texto) {
    for (const k of ["codigo","pix","suporte","entrega","emprego","parente","premio"]) if (RX[k].test(texto)) return k;
    return "generico";
  }
  function humor(texto) { return DESCONFIA.test(texto) ? "desconfiou" : IRRITADO.test(texto) ? "irritado" : "calmo"; }
  function nivelAuto(h) {
    if (h === "irritado") return {nivel: 3, motivo: "golpista irritado → sobe a confusão"};
    if (h === "desconfiou") return {nivel: 1, motivo: "golpista desconfiado → persona mais natural"};
    return {nivel: 2, motivo: "golpista paciente → nível médio"};
  }

  function estilizar(txt, estilo) {
    if (estilo === "caps") return txt.toUpperCase();
    if (estilo === "semponto") return txt.replace(/[.,!?;:]/g, "").replace(/\s+/g, " ");
    if (estilo === "erros") {
      return txt.split(" ").map(w => {
        const r = Math.random();
        if (r < 0.12) return w.normalize("NFD").replace(/[̀-ͯ]/g, "");
        if (r < 0.2 && w.length > 4) { const i = 1 + rnd(w.length - 2); return w.slice(0, i) + w[i] + w.slice(i); }
        if (r < 0.26 && w.length > 4) return w.slice(0, -1);
        return w;
      }).join(" ");
    }
    return txt;
  }

  let ultimo = "";
  function sugerir({texto, persona, nivel, estilo, tipo}) {
    const h = humor(texto || "");
    let lvl, motivoNivel = "";
    if (nivel === "auto") { const a = nivelAuto(h); lvl = a.nivel; motivoNivel = a.motivo; } else lvl = +nivel;
    let t = tipo === "auto" ? detectarTipo(texto || "") : tipo;
    const banco = h === "desconfiou" ? "desconfiou" : h === "irritado" && Math.random() < 0.6 ? "irritado" : t;
    let pool = (DATA.respostas[banco] || []).filter(r => r.l.includes(lvl));
    if (!pool.length) pool = (DATA.respostas.generico).filter(r => r.l.includes(lvl));
    if (pool.length > 1) pool = pool.filter(r => r.t !== ultimo);
    const escolhida = pick(pool);
    ultimo = escolhida.t;
    let out = escolhida.t;
    if (Math.random() < 0.35) out += " " + pick(DATA.personas[persona].fillers);
    out = estilizar(out, estilo);
    return {texto: out, tipo: t, nivel: lvl, humor: h, motivoNivel};
  }
  return {sugerir, detectarTipo};
})();
