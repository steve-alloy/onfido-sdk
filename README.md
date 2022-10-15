# Alloy Onfido Test App
## Steps:
- npm run build
- npm run dev

## Info:
- index.js has two endpoints (/creds for generating the applicant_id and SDK token; /check for the check_id)
- App.svelte makes an initial POST to /creds, runs the SDK, then posts to /check
- /check endpoint returns the check_id