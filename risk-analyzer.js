
const RiskAnalyzer = {
  analyze(message) {
    const checks = [
      {
        pattern: /<script/i,
        level: "ALTO",
        reason: "Possibile codice HTML attivo"
      },
      {
        pattern: /javascript:/i,
        level: "ALTO",
        reason: "Schema JavaScript rilevato"
      },
      {
        pattern: /onerror\s*=/i,
        level: "ALTO",
        reason: "Possibile gestore di eventi HTML"
      },
      {
        pattern: /https?:\/\//i,
        level: "MEDIO",
        reason: "Il messaggio contiene un collegamento"
      }
    ];

    const findings = checks
      .filter(check => check.pattern.test(message))
      .map(check => ({
        level: check.level,
        reason: check.reason
      }));

    const risk = findings.some(f => f.level === "ALTO")
      ? "ALTO"
      : findings.some(f => f.level === "MEDIO")
      ? "MEDIO"
      : "BASSO";

    return { risk, findings };
  }
};

window.RiskAnalyzer = RiskAnalyzer;

