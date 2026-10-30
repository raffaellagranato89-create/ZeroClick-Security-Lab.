
const SecurityDashboard = {
  key: "zeroClickLabEvents",

  getEvents() {
    try {
      return JSON.parse(
        localStorage.getItem(this.key) || "[]"
      );
    } catch {
      return [];
    }
  },

  addEvent(type, status, detail) {
    const events = this.getEvents();

    events.unshift({
      date: new Date().toLocaleString("it-IT"),
      type,
      status,
      detail
    });

    try {
      localStorage.setItem(
        this.key,
        JSON.stringify(events.slice(0, 100))
      );
    } catch {
      console.warn("Registro locale non disponibile");
    }
  },

  clear() {
    localStorage.removeItem(this.key);
  }
};

window.SecurityDashboard = SecurityDashboard;

