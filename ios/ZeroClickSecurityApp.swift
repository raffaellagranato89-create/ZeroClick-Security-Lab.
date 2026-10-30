
import SwiftUI

@main
struct ZeroClickSecurityApp: App {
    var body: some Scene {
        WindowGroup {
            MainView()
                .preferredColorScheme(.dark)
        }
    }
}

struct MainView: View {
    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("Home", systemImage: "shield.lefthalf.filled")
                }

            WhatsAppView()
                .tabItem {
                    Label("WhatsApp", systemImage: "message")
                }

            AnalyzerView()
                .tabItem {
                    Label("Analisi", systemImage: "magnifyingglass")
                }
        }
        .tint(.cyan)
    }
}

struct DashboardView: View {
    @AppStorage("securityChecks") private var checks = 0

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 22) {
                    Image(systemName: "shield.lefthalf.filled")
                        .font(.system(size: 65))
                        .foregroundStyle(.cyan)

                    Text("ZERO-CLICK SECURITY")
                        .font(.title2.bold())

                    Text("Protezione personale iPhone")
                        .foregroundStyle(.secondary)

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Stato del laboratorio")
                            .font(.headline)

                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(.green)
                            Text("Applicazione avviata")
                        }

                        HStack {
                            Image(systemName: "list.clipboard")
                                .foregroundStyle(.cyan)
                            Text("Controlli completati: \(checks)")
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(Color.white.opacity(0.07))
                    .clipShape(RoundedRectangle(cornerRadius: 16))

                    Text("Questa applicazione offre controlli guidati e analisi locali. Non rileva autonomamente attacchi zero-click.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .padding()
                }
                .padding()
            }
            .background(Color(red: 0.035, green: 0.05, blue: 0.09))
            .navigationTitle("Security Lab")
        }
    }
}

struct WhatsAppView: View {
    @AppStorage("check1") private var check1 = false
    @AppStorage("check2") private var check2 = false
    @AppStorage("check3") private var check3 = false
    @AppStorage("check4") private var check4 = false

    var body: some View {
        NavigationStack {
            List {
                Section("Controlli manuali WhatsApp") {
                    Toggle("Verificare i dispositivi collegati", isOn: $check1)
                    Toggle("Attivare la verifica in due passaggi", isOn: $check2)
                    Toggle("Non condividere codici SMS o PIN", isOn: $check3)
                    Toggle("Aggiornare WhatsApp", isOn: $check4)
                }

                Section {
                    Text("Apri WhatsApp → Impostazioni → Dispositivi collegati per controllare le sessioni attive.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Section {
                    Text("Questi controlli sono registrati sul dispositivo. L'app non può leggere direttamente i dati interni di WhatsApp.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("WhatsApp Security")
        }
    }
}

struct AnalyzerView: View {
    @State private var message = ""
    @State private var result = ""
    @State private var riskColor: Color = .secondary

    func analyze() {
        let text = message.lowercased()

        let highRisk = [
            "codice sms", "pin", "password",
            "mandami il codice", "codice di verifica"
        ]

        let mediumRisk = [
            "clicca qui", "conto bloccato",
            "urgente", "bonifico", "premio"
        ]

        if highRisk.contains(where: { text.contains($0) }) {
            result = "RISCHIO ALTO – possibile tentativo di furto credenziali."
            riskColor = .red
        } else if mediumRisk.contains(where: { text.contains($0) }) {
            result = "RISCHIO MEDIO – verifica attentamente il messaggio."
            riskColor = .orange
        } else if text.isEmpty {
            result = "Inserisci un messaggio da analizzare."
            riskColor = .secondary
        } else {
            result = "RISCHIO NON RILEVATO – questo controllo non garantisce sicurezza."
            riskColor = .green
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Text("Analisi messaggi")
                    .font(.title2.bold())

                Text("Inserisci o incolla un messaggio sospetto.")
                    .foregroundStyle(.secondary)

                TextEditor(text: $message)
                    .frame(height: 180)
                    .padding(8)
                    .background(Color.white.opacity(0.07))
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                Button(action: analyze) {
                    Label("Analizza messaggio", systemImage: "magnifyingglass")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(.cyan)
                        .foregroundStyle(.black)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                if !result.isEmpty {
                    Text(result)
                        .font(.headline)
                        .foregroundStyle(riskColor)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding()
                        .background(Color.white.opacity(0.07))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                Spacer()
            }
            .padding()
            .navigationTitle("Message Analyzer")
        }
    }
}
