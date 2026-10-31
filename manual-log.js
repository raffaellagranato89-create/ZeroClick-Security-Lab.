
(() => {
  const KEY = "zeroClickManualEvents";

  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  };

  const panel = document.createElement("div");
  panel.className = "card";

  panel.innerHTML = `
    <h2>📝 Registro manuale di sicurezza</h2>

    <label>Tipo di evento</label>
    <input id="manualType" maxlength="80"
      placeholder="Es. Messaggio sospetto">

    <label>Livello di rischio</label>
    <select id="manualRisk">
      <option>BASSO</option>
      <option>MEDIO</option>
      <option>ALTO</option>
    </select>

    <label>Descrizione</label>
    <textarea id="manualDetail" maxlength="1000"
      placeholder="Descrivi cosa è successo..."
      style="width:100%;min-height:100px;padding:12px"></textarea>

    <button id="manualSave">Salva evento</button>
    <button id="manualExport">Esporta report CSV</button>
    <button id="manualPDF">Genera report PDF</button>

    <h3>Storico degli eventi</h3>
    <div id="manualHistory"></div>

    <button id="manualClear">Cancella eventi manuali</button>
    <p>Gli eventi sono salvati localmente sul dispositivo.</p>
  `;

  document.body.appendChild(panel);

  const history = panel.querySelector("#manualHistory");

  function render() {
    const events = read();
    history.replaceChildren();

    if (!events.length) {
      history.textContent = "Nessun evento registrato.";
      return;
    }

    events.forEach(event => {
      const item = document.createElement("div");
      item.className = "metric";

      const title = document.createElement("strong");
      title.textContent =
        `${event.date} | ${event.type} | ${event.risk}`;

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
      alert("Impossibile salvare l'evento.");
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
    link.download = "registro-security.csv";
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  panel.querySelector("#manualPDF").addEventListener("click", () => {
    const events = read();

    if (!events.length) {
      alert("Non ci sono eventi da inserire nel report.");
      return;
    }

    // Apriamo la finestra direttamente durante il tocco dell'utente.
    const report = window.open("", "_blank");

    if (!report) {
      alert("Safari ha bloccato la finestra. Consenti i popup per questo sito e riprova.");
      return;
    }

    const safe = value =>
      String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]);

    const rows = events.map(event => `
      <tr>
        <td>${safe(event.date)}</td>
        <td>${safe(event.type)}</td>
        <td>${safe(event.risk)}</td>
        <td>${safe(event.detail)}</td>
      </tr>
    `).join("");

    report.document.open();
    report.document.write(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Report sicurezza</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #222;
          }
          h1 { color: #087e8b; }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #bbb;
            padding: 7px;
            text-align: left;
            overflow-wrap: anywhere;
          }
          th { background: #e8f3f5; }
          button {
            padding: 14px;
            margin: 15px 0;
            background: #087e8b;
            color: white;
            border: 0;
            border-radius: 8px;
          }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Zero-Click Security Lab</h1>
        <h2>Report eventi di sicurezza</h2>
        <p>Generato: ${safe(new Date().toLocaleString("it-IT"))}</p>
        <p>Totale eventi: ${events.length}</p>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Rischio</th>
              <th>Descrizione</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p>Report basato sugli eventi inseriti manualmente.</p>
        <button onclick="window.print()">Stampa / Salva PDF</button>
      </body>
      </html>
    `);
    report.document.close();
  });

  panel.querySelector("#manualClear").addEventListener("click", () => {
    if (confirm("Vuoi cancellare tutti gli eventi manuali?")) {
      localStorage.removeItem(KEY);
      render();
    }
  });

  render();
})();
