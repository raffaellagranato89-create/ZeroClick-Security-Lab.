
const SecurityTests = {
  run() {
    const cases = [
      {
        name: "Test messaggio normale",
        input: "Ciao, come stai?",
        expected: "BASSO"
      },
      {
        name: "Test collegamento",
        input: "Visita https://example.com",
        expected: "MEDIO"
      },
      {
        name: "Test codice HTML",
        input: "<script>alert('test')</script>",
        expected: "ALTO"
      },
      {
        name: "Test evento HTML",
        input: "onerror=alert(1)",
        expected: "ALTO"
      }
    ];

    return cases.map(test => {
      const result = RiskAnalyzer.analyze(test.input);

      return {
        name: test.name,
        expected: test.expected,
        actual: result.risk,
        passed: result.risk === test.expected
      };
    });
  }
};

window.SecurityTests = SecurityTests;
