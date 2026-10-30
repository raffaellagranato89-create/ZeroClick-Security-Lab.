
const SecurityLab = {
  events: [],
  suspiciousCount: 0,

  analyze(message) {
    const patterns = [
      /<script/i,
      /javascript:/i,
      /onerror\s*=/i
    ];

    const suspicious = patterns.some(pattern =>
      pattern.test(message)
    );

    const event = {
      time: new Date().toLocaleString("it-IT"),
      message: message,
      status: suspicious ? "SOSPESO" : "SICURO"
    };

    this.events.push(event);

    if (suspicious) {
      this.suspiciousCount++;
    }

    return event;
  },

  report() {
    return {
      total: this.events.length,
      suspicious: this.suspiciousCount,
      history: this.events
    };
  },

  clear() {
    this.events = [];
    this.suspiciousCount = 0;
  }
};

window.SecurityLab = SecurityLab;
