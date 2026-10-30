
const ZeroClickSimulation = {
  stages: [],

  run() {
    this.stages = [];

    const add = (name, detail, status) => {
      this.stages.push({
        name,
        detail,
        status
      });
    };

    add(
      "1. Ricezione automatica",
      "Il dispositivo riceve un messaggio di prova.",
      "OK"
    );

    add(
      "2. Elaborazione automatica",
      "Un componente software analizza i dati ricevuti senza intervento dell'utente.",
      "OK"
    );

    add(
      "3. Vulnerabilità simulata",
      "Il laboratorio simula un errore nella validazione dei dati. Nessun codice viene eseguito.",
      "SIMULAZIONE"
    );

    add(
      "4. Controllo di sicurezza",
      "Il sistema verifica il contenuto prima di elaborarlo.",
      "CONTROLLO"
    );

    add(
      "5. Protezione attivata",
      "Il contenuto non valido viene isolato e non viene eseguito.",
      "BLOCCATO"
    );

    return this.stages;
  }
};

window.ZeroClickSimulation = ZeroClickSimulation;
