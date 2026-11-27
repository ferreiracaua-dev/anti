const Gen = (() => {
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  const digits = n => Array.from({length: n}, () => rnd(10)).join("");
  const pad = (s, n) => String(s).padStart(n, "0");
  const strip = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

  // CPF com dígitos verificadores propositalmente ERRADOS: nunca bate com pessoa real.
  function cpfInvalido() {
    for (;;) {
      const b = Array.from({length: 9}, () => rnd(10));
      if (b.every(x => x === b[0])) continue;
      const dv = arr => { let s = 0; for (let i = 0; i < arr.length; i++) s += arr[i] * (arr.length + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
      const d1 = dv(b), d2 = dv([...b, d1]);
      const w1 = (d1 + 1 + rnd(8)) % 10; // garante diferente do correto
      const f = `${b.slice(0,3).join("")}.${b.slice(3,6).join("")}.${b.slice(6,9).join("")}-${w1}${d2}`;
      return f;
    }
  }
  const luhnOk = num => { let s = 0, alt = false; for (let i = num.length - 1; i >= 0; i--) { let d = +num[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return s % 10 === 0; };
  // Cartão que FALHA na verificação de Luhn e usa prefixo fora das bandeiras comuns.
  function cartaoInvalido() {
    let n; do { n = "9" + digits(15); } while (luhnOk(n));
    const m = pad(1 + rnd(12), 2), y = String(new Date().getFullYear() + 1 + rnd(4)).slice(2);
    return { numero: n.replace(/(.{4})/g, "$1 ").trim(), validade: `${m}/${y}`, cvv: digits(3) };
  }

  function identidade(pais) {
    const P = DATA.paises[pais], N = DATA.nomes[pais];
    const fem = Math.random() < 0.5;
    const nome = pick(fem ? N.f : N.m), s1 = pick(N.s), s2 = pick(N.s);
    const cid = pick(P.cidades);
    const [cidade, uf, ddd, cepPre] = cid;
    const num = 1 + rnd(2999), compl = Math.random() < 0.3 ? `, apto ${1 + rnd(200)}` : "";
    const out = { "Nome": `${nome} ${s1}${pais === "BR" || pais === "AR" || pais === "ES" || pais === "PT" ? " " + s2 : ""}` };
    if (pais === "BR") {
      out["CEP"] = `${cepPre}${digits(3)}-${digits(3)}`;
      out["Endereço"] = `${pick(P.ruas)}, ${num}${compl}`;
      out["Cidade/UF"] = `${cidade} - ${uf}`;
      out["Telefone"] = `(${ddd}) 90000-${digits(4)}`;
      out["CPF (inválido)"] = cpfInvalido();
      out["RG"] = `${digits(2)}.${digits(3)}.${digits(3)}-X`;
    } else {
      out["Endereço"] = pais === "US" ? `${num} ${pick(P.ruas)}` : `${pick(P.ruas)} ${num}${compl}`;
      out["Cidade"] = uf ? `${cidade}, ${uf}` : cidade;
      out["Código postal"] = pais === "US" ? `${cepPre.length === 3 ? cepPre : "60" + digits(1)}${digits(2)}`.slice(0, 5) : pais === "AR" ? `${cepPre}${digits(4)}` : pais === "PT" ? `${cepPre}${digits(2)}-${digits(3)}` : `${cepPre}${digits(3)}`.slice(0, 5);
      out["Telefone"] = pais === "US" ? `(${ddd}) 555-01${digits(2)}` : `+${{PT:"351",AR:"54",ES:"34"}[pais]} ${ddd} ${digits(6)}`;
    }
    out["E-mail (fictício)"] = `${strip(nome)}.${strip(s1)}${rnd(90) + 10}@${P.dominio}`;
    const c = cartaoInvalido();
    out["Cartão (inválido)"] = c.numero;
    out["Validade / CVV"] = `${c.validade} / ${c.cvv}`;
    out["Código de confirmação"] = digits(6);
    return out;
  }

  // ---- E-mail temporário via mail.tm (API pública) ----
  const API = "https://api.mail.tm";
  let conta = null;
  async function criarEmail() {
    const doms = await (await fetch(`${API}/domains`)).json();
    const dom = (doms["hydra:member"] || doms.member || [])[0]?.domain;
    if (!dom) throw new Error("sem domínio disponível");
    const address = `${strip(pick(DATA.nomes.BR.f))}${strip(pick(DATA.nomes.BR.s))}${rnd(9000) + 1000}@${dom}`;
    const password = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => b.toString(16).padStart(2, "0")).join("");
    const r = await fetch(`${API}/accounts`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({address, password})});
    if (!r.ok) throw new Error("não consegui criar a conta (" + r.status + ")");
    const t = await (await fetch(`${API}/token`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({address, password})})).json();
    conta = {address, token: t.token};
    return address;
  }
  async function caixa() {
    if (!conta) throw new Error("crie um e-mail primeiro");
    const r = await fetch(`${API}/messages`, {headers: {Authorization: "Bearer " + conta.token}});
    const j = await r.json();
    return j["hydra:member"] || j.member || [];
  }
  const alias = base => { const m = /^([^@+\s]+)@(gmail\.com|googlemail\.com)$/i.exec(base.trim()); if (!m) return null; return `${m[1]}+golpista${1 + rnd(999)}@${m[2].toLowerCase()}`; };

  return {identidade, criarEmail, caixa, alias, cpfInvalido, cartaoInvalido, luhnOk};
})();
