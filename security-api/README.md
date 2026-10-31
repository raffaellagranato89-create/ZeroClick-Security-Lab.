# SENTINEL SECURITY – External link reputation API

This repository includes an optional Cloudflare Worker proxy at `security-api/worker.js`.
The iOS app sends a URL to this endpoint only after the user taps **Verifica con i database esterni**.

## Deploy the API

1. Create a Cloudflare account and a Worker named `sentinel-link-check`.
2. Deploy the contents of `security-api/worker.js` as the Worker entry point.
3. In the Worker settings, add these two **Secret** environment variables:
   - `GOOGLE_SAFE_BROWSING_API_KEY`
   - `VIRUSTOTAL_API_KEY`
4. Obtain the keys from the official Google Safe Browsing and VirusTotal developer portals. Check each provider's current terms, quotas and permitted use.
5. Deploy the Worker and copy its HTTPS address (for example, `https://sentinel-link-check.<account>.workers.dev`).
6. Paste that address in SENTINEL SECURITY → Link. The Worker accepts POST requests at its root URL.

Never put provider API keys in the iOS app, this repository, screenshots, or public configuration. If a key is exposed, revoke and rotate it.

## How it works

- Google Safe Browsing checks the submitted URL against configured threat categories.
- VirusTotal receives the URL for analysis and returns available analysis statistics.
- The Worker returns each provider's status separately. A pending or unavailable result is not a clean result.
- The app does not automatically open the submitted URL.

## Privacy and limitations

When the user requests a check, the full URL is transmitted to this Worker and then to the configured providers. Query strings can contain session identifiers or personal tokens; do not submit such links. Provider policies may retain submitted URLs and analysis data. Review their terms before enabling the service.

This is reputation checking, not a guarantee. New, private, targeted or unreported phishing pages may not be detected. Results can be delayed, incomplete or produce false positives. The free/public API tiers can have strict rate limits and usage restrictions. Do not use this endpoint as a public unrestricted service; configure Cloudflare rate limiting or an authenticated access layer before wider distribution.
