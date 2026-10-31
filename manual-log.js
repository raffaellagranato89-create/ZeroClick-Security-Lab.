
(() => {
  const KEY = "zeroClickManualEvents";
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  };

  const panel = document.createElement("section");
  panel.className = "panel";
  panel.innerHTML = `
    <h2>📝 Registro manuale di sicurezza</h2>
    <label>Tipo di evento</label>
    <input id="manualType" maxlength="80" placeholder="Es. Messaggio sospetto">
    <label>Livello di rischio</label>
    <select id="manualRisk">
      <option>BASSO</option>
      <option>MEDIO</option>
      <option>ALTO</option>
    </select>
    <label>Descrizione</label>
    <textarea id="manualDetail" maxlength="1000"
      placeholder="Descrivi cosa è successo..."
      style="width:100%;min-height:100px;padding:12px;border-radius:8px"></textarea>
    <button id="manualSave">Salva evento</button>
    <button id="manualExport">Esporta report CSV</button>
    <h3>Storico degli eventi</h3>
    <div id="manualHistory">Nessun evento registrato.</div>
    <button id="manualClear">Cancella eventi manuali</button>
    <p class="small">Gli eventi sono salvati localmente in questo browser.</p>
  `;

  document.body.appendChild(panel);

  const history = panel.querySelector("#manualHistory");

  function render() {
    const events = read();
    history.textContent = "";

    if (!events.length) {
      history.textContent = "Nessun evento registrato.";
      return;
    }

    events.forEach(event => {
      const item = document.createElement("div");
      item.className = "metric";

      const title = document.createElement("strong");
      title.textContent = `${event.date} | ${event.type} | ${event.risk}`;

      const detail = document.createElement("p");
      detail.textContent = event.detail;

      item.append(title, detail);
      history.appendChild(item);
    });
  }

  panel.querySelector("#manualSave").addEventListener("click", () => {
    const type = panel.querySelector("#manualType").value.trim();
    const detail = panel.querySelector("#manualDetail").value.trim();
    const risk = panel.querySelector("#manualRisk").value;

    if (!type || !detail) {
      alert("Inserisci tipo di evento e descrizione.");
      return;
    }

    const events = read();
    events.unshift({
      date: new Date().toLocaleString("it-IT"),
      type,
      risk,
      detail
    });

    try {
      localStorage.setItem(KEY, JSON.stringify(events.slice(0, 200)));
      panel.querySelector("#manualType").value = "";
      panel.querySelector("#manualDetail").value = "";
      render();
      alert("Evento salvato.");
    } catch {
      alert("Impossibile salvare: spazio locale non disponibile.");
    }
  });

  panel.querySelector("#manualExport").addEventListener("click", () => {
    const events = read();
    if (!events.length) {
      alert("Non ci sono eventi da esportare.");
      return;
    }

    const quote = value =>
      '"' + String(value ?? "").replace(/"/g, '""') + '"';

    const rows = [
      ["Data", "Tipo", "Rischio", "Descrizione"],
      ...events.map(e => [e.date, e.type, e.risk, e.detail])
    ];

    const csv = "\uFEFF" +
      rows.map(row => row.map(quote).join(";")).join("\r\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "registro-manuale-security.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  panel.querySelector("#manualClear").addEventListener("click", () => {
    if (confirm("Vuoi cancellare tutti gli eventi manuali?")) {
      localStorage.removeItem(KEY);
      render();
    }
  });

  render();
})();
