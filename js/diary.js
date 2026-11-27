const Diary = (() => {
  const K = "anti.diario.v1", KS = "anti.stats.v1";
  const ler = (k, def) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  let mem = null, memS = null; // fallback se localStorage falhar
  const list = () => mem || (mem = ler(K, []));
  const stats = () => memS || (memS = ler(KS, {totalMs: 0, sessoes: 0, maior: 0}));
  function add(e) { const l = list(); l.unshift({t: new Date().toISOString(), ...e}); gravar(K, l); }
  function clear() { mem = []; memS = {totalMs: 0, sessoes: 0, maior: 0}; gravar(K, mem); gravar(KS, memS); }
  function sessao(ms) { const s = stats(); s.totalMs += ms; s.sessoes++; s.maior = Math.max(s.maior, ms); gravar(KS, s); }
  const fmt = ms => { const s = Math.floor(ms / 1000); return [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60].map(x => String(x).padStart(2, "0")).join(":"); };
  function conquistas() {
    const s = stats(), c = [];
    if (s.maior >= 3600e3) c.push("🏅 Enrolou por 1 hora seguida");
    if (s.maior >= 3 * 3600e3) c.push("🏆 Enrolou por 3 horas seguidas");
    if (s.sessoes >= 1) c.push("🎣 Primeiro golpista enrolado");
    if (s.sessoes >= 10) c.push("⭐ 10 golpistas enrolados");
    if (s.totalMs >= 10 * 3600e3) c.push("🔥 10 horas de tempo roubado dos golpistas");
    return c;
  }
  function relatorio() {
    const l = list(), s = stats();
    let o = "RELATÓRIO — DIÁRIO DO GOLPE\nGerado em " + new Date().toLocaleString("pt-BR") + "\n";
    o += `Tempo total que o golpista perdeu: ${fmt(s.totalMs)} em ${s.sessoes} conversa(s)\n` + "=".repeat(50) + "\n\n";
    [...l].reverse().forEach(e => { o += `[${new Date(e.t).toLocaleString("pt-BR")}] ${e.tipo || ""}\nGolpista: ${e.msg || "-"}\nResposta: ${e.resp || "-"}\n${e.nota ? "Nota: " + e.nota + "\n" : ""}\n`; });
    return o;
  }
  return {add, list, clear, sessao, stats, fmt, conquistas, relatorio};
})();
