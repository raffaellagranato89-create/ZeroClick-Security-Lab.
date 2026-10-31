const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

async function googleCheck(url, key) {
  if (!key) return { status: "not_configured", message: "Google Safe Browsing API key non configurata." };
  try {
    const response = await fetch("https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" + encodeURIComponent(key), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: { clientId: "sentinel-security", clientVersion: "1.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }]
        }
      })
    });
    if (!response.ok) return { status: "error", message: "Google Safe Browsing ha restituito HTTP " + response.status + "." };
    const data = await response.json();
    const matches = data.matches || [];
    return {
      status: "checked",
      malicious: matches.length,
      message: matches.length ? "URL presente nelle segnalazioni: " + matches.map(x => x.threatType).join(", ") : "Nessuna corrispondenza trovata."
    };
  } catch {
    return { status: "error", message: "Errore durante il collegamento a Google Safe Browsing." };
  }
}

async function virusTotalCheck(url, key) {
  if (!key) return { status: "not_configured", message: "VirusTotal API key non configurata." };
  try {
    const form = new URLSearchParams();
    form.set("url", url);
    const submitted = await fetch("https://www.virustotal.com/api/v3/urls", {
      method: "POST",
      headers: { "x-apikey": key, "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });

    let analysisId;
    if (submitted.ok) {
      const body = await submitted.json();
      analysisId = body.data && body.data.id;
    } else if (submitted.status === 409) {
      const encoded = btoa(url).replace(/=/g, "");
      const lookup = await fetch("https://www.virustotal.com/api/v3/urls/" + encoded, {
        headers: { "x-apikey": key }
      });
      if (!lookup.ok) return { status: "error", message: "VirusTotal non ha potuto recuperare l'analisi esistente." };
      const body = await lookup.json();
      const stats = body.data && body.data.attributes && body.data.attributes.last_analysis_stats;
      if (!stats) return { status: "pending", message: "Analisi VirusTotal non ancora disponibile." };
      return {
        status: "checked",
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        undetected: stats.undetected || 0,
        message: "Statistiche dell'ultima analisi disponibile."
      };
    } else {
      return { status: "error", message: "VirusTotal ha restituito HTTP " + submitted.status + "." };
    }

    if (!analysisId) return { status: "pending", message: "VirusTotal ha ricevuto il link; analisi in attesa." };
    const analysis = await fetch("https://www.virustotal.com/api/v3/analyses/" + encodeURIComponent(analysisId), {
      headers: { "x-apikey": key }
    });
    if (!analysis.ok) return { status: "pending", message: "Analisi inviata a VirusTotal, risultati non ancora pronti." };
    const body = await analysis.json();
    const stats = body.data && body.data.attributes && body.data.attributes.stats;
    if (!stats) return { status: "pending", message: "Analisi VirusTotal in elaborazione." };
    return {
      status: "checked",
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      undetected: stats.undetected || 0,
      message: "Risultati dell'analisi appena richiesta."
    };
  } catch {
    return { status: "error", message: "Errore durante il collegamento a VirusTotal." };
  }
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "Metodo non consentito." }, 405);

    let input;
    try { input = await request.json(); } catch { return json({ error: "JSON non valido." }, 400); }
    if (!input || typeof input.url !== "string" || input.url.length > 2048) {
      return json({ error: "Indirizzo mancante o troppo lungo." }, 400);
    }

    let parsed;
    try { parsed = new URL(input.url); } catch { return json({ error: "URL non valido." }, 400); }
    if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) {
      return json({ error: "Sono ammessi solo URL HTTP/HTTPS senza credenziali incorporate." }, 400);
    }

    const [googleSafeBrowsing, virusTotal] = await Promise.all([
      googleCheck(parsed.href, env.GOOGLE_SAFE_BROWSING_API_KEY),
      virusTotalCheck(parsed.href, env.VIRUSTOTAL_API_KEY)
    ]);

    const detected = (googleSafeBrowsing.malicious || 0) > 0 ||
      (virusTotal.malicious || 0) > 0 || (virusTotal.suspicious || 0) > 0;
    const configured = [googleSafeBrowsing, virusTotal].filter(x => x.status === "checked").length;
    const verdict = detected ? "POSSIBILE MINACCIA RILEVATA" :
      configured === 0 ? "VERIFICA NON DISPONIBILE" :
      "NESSUNA MINACCIA RILEVATA DAI SERVIZI INTERROGATI";

    return json({
      verdict,
      googleSafeBrowsing,
      virusTotal,
      checkedAt: new Date().toISOString()
    });
  }
};
