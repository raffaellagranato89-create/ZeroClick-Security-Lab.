
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

// MARK: - Navigazione principale

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

            iPhoneSecurityView()
                .tabItem {
                    Label("iPhone", systemImage: "iphone")
                }
        }
        .tint(.cyan)
    }
}

// MARK: - Dashboard

struct DashboardView: View {
    @AppStorage("check1") private var check1 = false
    @AppStorage("check2") private var check2 = false
    @AppStorage("check3") private var check3 = false
    @AppStorage("check4") private var check4 = false

    @AppStorage("iosUpdateChecked") private var iosUpdateChecked = false
    @AppStorage("passcodeChecked") private var passcodeChecked = false
    @AppStorage("faceIDChecked") private var faceIDChecked = false
    @AppStorage("findMyChecked") private var findMyChecked = false
    @AppStorage("twoFactorChecked") private var twoFactorChecked = false

    private var completed: Int {
        [
            check1, check2, check3, check4,
            iosUpdateChecked, passcodeChecked,
            faceIDChecked, findMyChecked, twoFactorChecked
        ].filter { $0 }.count
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 22) {
                    Image(systemName: "shield.lefthalf.filled")
                        .font(.system(size: 68))
                        .foregroundStyle(.cyan)

                    Text("ZERO-CLICK SECURITY")
                        .font(.title2.bold())

                    Text("Protezione personale iPhone")
                        .foregroundStyle(.secondary)

                    VStack(alignment: .leading, spacing: 14) {
                        Text("Stato dei controlli")
                            .font(.headline)

                        HStack {
                            Text("\(completed) controlli completati")
                            Spacer()
                            Text("su 9")
                                .foregroundStyle(.secondary)
                        }

                        ProgressView(value: Double(completed), total: 9)
                            .tint(.cyan)

                        Text("Completa i controlli nelle sezioni WhatsApp e iPhone.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                    .padding()
                    .background(Color.white.opacity(0.07))
                    .clipShape(RoundedRectangle(cornerRadius: 16))

                    VStack(alignment: .leading, spacing: 12) {
                        Label("Controllo WhatsApp", systemImage: "message")
                            .font(.headline)

                        Label("Sicurezza iPhone", systemImage: "iphone")
                            .font(.headline)

                        Label("Analisi messaggi", systemImage: "magnifyingglass")
                            .font(.headline)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(Color.white.opacity(0.07))
                    .clipShape(RoundedRectangle(cornerRadius: 16))

                    Text("Questa applicazione offre controlli guidati e analisi locali. Non rileva autonomamente tutti gli attacchi zero-click.")
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

// MARK: - Sicurezza WhatsApp

struct WhatsAppView: View {
    @AppStorage("check1") private var check1 = false
    @AppStorage("check2") private var check2 = false
    @AppStorage("check3") private var check3 = false
    @AppStorage("check4") private var check4 = false

    var body: some View {
        NavigationStack {
            List {
                Section("Controlli di sicurezza") {
                    Toggle("Ho verificato i dispositivi collegati", isOn: $check1)

                    Toggle("Ho attivato la verifica in due passaggi", isOn: $check2)

                    Toggle("Non condivido codici SMS o PIN", isOn: $check3)

                    Toggle("Ho aggiornato WhatsApp", isOn: $check4)
                }

                Section("Come verificare") {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Dispositivi collegati")
                            .font(.headline)

                        Text("Apri WhatsApp → Impostazioni → Dispositivi collegati. Disconnetti quelli che non riconosci.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Verifica in due passaggi")
                            .font(.headline)

                        Text("Apri WhatsApp → Impostazioni → Account → Verifica in due passaggi.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                }

                Section {
                    Text("Le spunte registrano i controlli dichiarati dall'utente. L'app non può leggere direttamente le sessioni o le impostazioni interne di WhatsApp.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("WhatsApp Security")
        }
    }
}

// MARK: - Analisi messaggi

struct AnalyzerView: View {
    @State private var message = ""
    @State private var result = ""
    @State private var riskColor: Color = .secondary

    private func analyze() {
        let text = message.lowercased()

        let highRisk = [
            "codice sms",
            "mandami il codice",
            "codice di verifica",
            "password",
            "mandami il pin",
            "comunica il pin"
        ]

        let mediumRisk = [
            "clicca qui",
            "conto bloccato",
            "urgente",
            "bonifico",
            "hai vinto",
            "premio",
            "verifica account"
        ]

        if text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            result = "Inserisci un messaggio da analizzare."
            riskColor = .secondary
        } else if highRisk.contains(where: { text.contains($0) }) {
            result = "RISCHIO ALTO: possibile tentativo di furto di credenziali."
            riskColor = .red
        } else if mediumRisk.contains(where: { text.contains($0) }) {
            result = "RISCHIO MEDIO: verifica attentamente il messaggio e il mittente."
            riskColor = .orange
        } else {
            result = "NESSUN INDICATORE RILEVATO: non significa che il messaggio sia sicuro."
            riskColor = .green
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    Image(systemName: "text.magnifyingglass")
                        .font(.system(size: 48))
                        .foregroundStyle(.cyan)

                    Text("Analisi messaggi")
                        .font(.title2.bold())

                    Text("Incolla un messaggio sospetto per analizzarne il contenuto.")
                        .foregroundStyle(.secondary)

                    TextEditor(text: $message)
                        .frame(height: 190)
                        .padding(8)
                        .scrollContentBackground(.hidden)
                        .background(Color.white.opacity(0.08))
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

                    Text("L'analisi utilizza indicatori testuali e non garantisce l'identificazione di tutte le truffe.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .padding()
            }
            .navigationTitle("Message Analyzer")
        }
    }
}

// MARK: - Sicurezza iPhone

struct iPhoneSecurityView: View {
    @AppStorage("iosUpdateChecked") private var iosUpdateChecked = false
    @AppStorage("passcodeChecked") private var passcodeChecked = false
    @AppStorage("faceIDChecked") private var faceIDChecked = false
    @AppStorage("findMyChecked") private var findMyChecked = false
    @AppStorage("twoFactorChecked") private var twoFactorChecked = false

    private var completed: Int {
        [
            iosUpdateChecked,
            passcodeChecked,
            faceIDChecked,
            findMyChecked,
            twoFactorChecked
        ].filter { $0 }.count
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Protezione del dispositivo")
                            .font(.headline)

                        Text("\(completed) controlli su 5 completati")
                            .foregroundStyle(.cyan)

                        ProgressView(value: Double(completed), total: 5)
                            .tint(.cyan)
                    }
                    .padding(.vertical, 8)
                }

                Section("Verifiche iPhone") {
                    Toggle("Ho verificato gli aggiornamenti iOS", isOn: $iosUpdateChecked)

                    Toggle("Ho impostato un codice sicuro", isOn: $passcodeChecked)

                    Toggle("Ho verificato Face ID", isOn: $faceIDChecked)

                    Toggle("Ho verificato Dov'è il mio iPhone", isOn: $findMyChecked)

                    Toggle("Ho attivato l'autenticazione a due fattori Apple", isOn: $twoFactorChecked)
                }

                Section("Dove effettuare i controlli") {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Aggiornamenti iOS")
                            .font(.headline)

                        Text("Impostazioni → Generali → Aggiornamento software")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Codice e Face ID")
                            .font(.headline)

                        Text("Impostazioni → Face ID e codice")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Dov'è")
                            .font(.headline)

                        Text("Impostazioni → Il tuo nome → Dov'è")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Autenticazione Apple")
                            .font(.headline)

                        Text("Impostazioni → Il tuo nome → Accesso e sicurezza")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                }

                Section {
                    Button("Azzera tutti i controlli") {
                        iosUpdateChecked = false
                        passcodeChecked = false
                        faceIDChecked = false
                        findMyChecked = false
                        twoFactorChecked = false
                    }
                    .foregroundStyle(.red)
                }

                Section {
                    Text("Le spunte sono verifiche dichiarate dall'utente. L'app non legge automaticamente le impostazioni interne di iOS e non certifica l'assenza di attacchi.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("iPhone Security")
        }
    }
}
