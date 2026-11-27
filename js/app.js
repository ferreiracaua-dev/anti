(() => {
  const $ = id => document.getElementById(id);
  const el = (tag, props = {}, ...kids) => { const e = document.createElement(tag); Object.assign(e, props); kids.forEach(k => e.append(k)); return e; };

  // ---- Abas ----
  document.querySelectorAll("#tabs button").forEach(b => b.onclick = () => {
    document.querySelectorAll("#tabs button").forEach(x => x.classList.toggle("active", x === b));
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.id === "tab-" + b.dataset.tab));
    if (b.dataset.tab === "diario") renderDiario();
  });

  // ---- Enrolar ----
  for (const [k, p] of Object.entries(DATA.personas)) $("persona").append(new Option(p.nome, k));
  for (const [k, v] of Object.entries(DATA.tipos)) $("tipo").append(new Option(v, k));
  const descPersona = () => $("personaDesc").textContent = DATA.personas[$("persona").value].desc;
  $("persona").onchange = descPersona; descPersona();

  let ultimaResp = null;
  function sugerir() {
    const r = Persona.sugerir({texto: $("msgGolpista").value, persona: $("persona").value, nivel: $("nivel").value, estilo: $("estilo").value, tipo: $("tipo").value});
    ultimaResp = r;
    $("resp").textContent = r.texto;
    $("detect").textContent = `Golpe: ${DATA.tipos[r.tipo]} · Humor dele: ${r.humor}`;
    $("respInfo").textContent = `Nível usado: ${r.nivel}${r.motivoNivel ? " (" + r.motivoNivel + ")" : ""}. Responda com um pequeno atraso, como uma pessoa real.`;
  }
  $("btnResp").onclick = $("btnOutra").onclick = sugerir;
  $("btnCopy").onclick = async () => { try { await navigator.clipboard.writeText($("resp").textContent); $("btnCopy").textContent = "Copiado!"; setTimeout(() => $("btnCopy").textContent = "Copiar", 1200); } catch { alert("Não consegui copiar. Selecione o texto e copie manualmente."); } };
  $("btnSalvar").onclick = () => {
    if (!ultimaResp) return;
    Diary.add({tipo: DATA.tipos[ultimaResp.tipo], msg: $("msgGolpista").value, resp: $("resp").textContent});
    $("btnSalvar").textContent = "Salvo ✔"; setTimeout(() => $("btnSalvar").textContent = "Salvar no diário", 1200);
    renderStats();
  };

  // Cronômetro
  let ini = null, tick = null;
  $("btnTimer").onclick = () => {
    if (ini === null) {
      ini = Date.now(); $("btnTimer").textContent = "■ Parar e registrar";
      tick = setInterval(() => $("timerView").textContent = Diary.fmt(Date.now() - ini), 500);
    } else {
      clearInterval(tick); const ms = Date.now() - ini; ini = null;
      Diary.sessao(ms); $("btnTimer").textContent = "▶ Iniciar cronômetro";
      $("timerView").textContent = "registrado: " + Diary.fmt(ms); renderStats();
    }
  };
  function renderStats() { const s = Diary.stats(); $("stats").textContent = `⏱ ${Diary.fmt(s.totalMs)} roubados · ${s.sessoes} golpista(s) enrolado(s)`; }
  renderStats();

  // ---- Dados falsos ----
  for (const [k, p] of Object.entries(DATA.paises)) $("pais").append(new Option(p.nome, k));
  function gerar() {
    const box = $("identidade"); box.textContent = "";
    for (const [k, v] of Object.entries(Gen.identidade($("pais").value))) {
      const val = el("span", {title: "Clique para copiar", textContent: v});
      val.onclick = () => navigator.clipboard?.writeText(v).then(() => { val.textContent = "copiado ✔"; setTimeout(() => val.textContent = v, 900); }).catch(() => {});
      box.append(el("span", {textContent: k}), val);
    }
  }
  $("btnGerar").onclick = gerar; gerar();
  $("btnMail").onclick = async () => {
    $("mailInfo").textContent = "Criando…";
    try { const a = await Gen.criarEmail(); $("mailInfo").textContent = "Seu e-mail temporário: " + a + " (clique em “Atualizar caixa” para ver mensagens)"; }
    catch (e) { $("mailInfo").textContent = "Erro: " + e.message + ". Verifique a internet e tente de novo."; }
  };
  $("btnInbox").onclick = async () => {
    const box = $("inbox"); box.textContent = "";
    try {
      const ms = await Gen.caixa();
      if (!ms.length) box.append(el("p", {className: "muted", textContent: "Caixa vazia."}));
      ms.forEach(m => box.append(el("div", {className: "mail", textContent: `${m.from?.address || "?"} — ${m.subject || "(sem assunto)"}`})));
    } catch (e) { box.append(el("p", {className: "muted", textContent: "Erro: " + e.message})); }
  };
  $("btnAlias").onclick = () => { const a = Gen.alias($("gmailBase").value); $("aliasOut").textContent = a ? "Use: " + a : "Digite um endereço @gmail.com válido."; };

  // ---- Link ----
  const badge = n => el("span", {className: "badge b-" + n, textContent: {baixo: "Risco baixo", medio: "Risco médio", alto: "Risco alto"}[n]});
  $("btnLink").onclick = () => {
    const out = $("linkOut"); out.textContent = "";
    const r = LinkCheck.analisar($("linkIn").value);
    if (!r) return;
    out.append(el("p", {}, badge(r.nivel), " ", el("span", {className: "muted", textContent: r.url})));
    const ul = el("ul", {className: "reasons"}); r.motivos.forEach(m => ul.append(el("li", {textContent: m.m}))); out.append(ul);
    if (r.externos) {
      out.append(el("p", {className: "muted", textContent: "Conferir em bases externas (abre o site da base, não o link suspeito):"}));
      const row = el("div", {className: "row"});
      r.externos.forEach(([n, u]) => row.append(el("a", {href: u, target: "_blank", rel: "noopener noreferrer", textContent: n, style: "color:#60A5FA;margin-right:12px"})));
      out.append(row);
    }
  };
  $("linkIn").addEventListener("keydown", e => { if (e.key === "Enter") $("btnLink").click(); });

  // ---- Arquivo ----
  $("fileIn").onchange = async e => {
    const f = e.target.files[0], out = $("fileOut"); out.textContent = "";
    if (!f) return;
    out.textContent = "Analisando…";
    try {
      const r = await FileCheck.analisar(f); out.textContent = "";
      if (r.erro) { out.textContent = r.erro; return; }
      out.append(el("p", {}, badge(r.nivel)));
      const ul = el("ul", {className: "reasons"}); r.motivos.forEach(m => ul.append(el("li", {textContent: m}))); out.append(ul);
      const kv = el("div", {className: "kv"});
      [["Nome", r.nome], ["Tamanho", (r.tamanho / 1024).toFixed(1) + " KB"], ["Tipo real", r.real], ["SHA-256", r.hash]].forEach(([k, v]) => kv.append(el("span", {textContent: k}), el("span", {textContent: v})));
      out.append(kv, el("a", {href: r.vt, target: "_blank", rel: "noopener noreferrer", textContent: "Conferir esse hash no VirusTotal", style: "color:#60A5FA"}));
      out.append(el("p", {className: "muted", textContent: "Se o VirusTotal disser que nunca viu o arquivo, isso não quer dizer que seja seguro."}));
    } catch (err) { out.textContent = "Erro ao analisar: " + err.message; }
  };

  // ---- Diário ----
  function renderDiario() {
    const box = $("diario"); box.textContent = "";
    const l = Diary.list();
    if (!l.length) box.append(el("p", {className: "muted", textContent: "Nada salvo ainda. Use “Salvar no diário” na aba Enrolar."}));
    l.forEach(e => box.append(el("div", {className: "entry"},
      el("small", {textContent: new Date(e.t).toLocaleString("pt-BR") + " · " + (e.tipo || "")}),
      el("div", {textContent: "Golpista: " + (e.msg || "-")}), el("div", {textContent: "Resposta: " + (e.resp || "-")}))));
    const s = Diary.stats(), p = $("placar"); p.textContent = "";
    p.append(el("p", {textContent: `Tempo total: ${Diary.fmt(s.totalMs)} · Conversas: ${s.sessoes} · Maior: ${Diary.fmt(s.maior)}`}));
    const c = Diary.conquistas(); p.append(c.length ? el("ul", {}, ...c.map(x => el("li", {textContent: x}))) : el("p", {className: "muted", textContent: "Sem conquistas ainda."}));
  }
  $("btnExport").onclick = () => {
    const a = el("a", {href: URL.createObjectURL(new Blob([Diary.relatorio()], {type: "text/plain;charset=utf-8"})), download: "relatorio-golpe.txt"});
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  $("btnLimpar").onclick = () => { if (confirm("Apagar diário e placar? Isso não pode ser desfeito.")) { Diary.clear(); renderDiario(); renderStats(); } };

  // ---- Golpes comuns ----
  DATA.golpes.forEach(g => { const d = el("details", {}, el("summary", {textContent: g.n}), el("p", {className: "muted", textContent: g.d})); $("golpes").append(d); });

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
