
const ZeroClickSimulation = {
  stages: [],

  run() {
    this.stages = [];

    const add = (name, detail, status) => {
      this.stages.push({ name, detail, status });
    };

    add("1. Ricezione automatica",
        "Messaggio di prova ricevuto.", "OK");

    add("2. Elaborazione automatica",
        "Analisi dei dati senza intervento dell'utente.", "OK");

    add("3. Vulnerabilità simulata",
        "Errore di validazione simulato. Nessun codice eseguito.",
        "SIMULAZIONE");

    add("4. Controllo di sicurezza",
        "Verifica dei dati prima dell'elaborazione.", "CONTROLLO");

    add("5. Protezione attivata",
        "Contenuto isolato e non eseguito.", "BLOCCATO");

    if (window.SecurityDashboard) {
      SecurityDashboard.addEvent(
        "Simulazione Zero-Click",
        "BLOCCATO",
        "Simulazione completata: contenuto di prova isolato."
      );
    }

    return this.stages;
  }
};

window.ZeroClickSimulation = ZeroClickSimulation;
