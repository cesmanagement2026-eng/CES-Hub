# CES Hub Frontend — New Project

1. Deploy the `frontend/` directory to the intended GitHub Pages branch.
2. In `frontend/js/config.js`, update `CES_CONFIG.GAS_API_URL` to the **new** Google Apps Script Web App `/exec` URL. The shipped value is intentionally blank to avoid writing to an old deployment.
3. Verify browser API linkage in Settings → Check API & Data.
4. Clear cached files after deploying HTML, JS and CSS together.
5. Restore the CES Hub logo from `frontend/img/nhealth_logo-9.png`.

Only one active tab is prioritized at initial load; module downloads, network latency and Apps Script cold starts prevent any guaranteed fixed load time.
