# Goal-Aware Budget (Dark Only)

Single-file, mobile-friendly budgeting tool with debt payoff guidance and goal-date savings. Dark mode only. Saves locally (no server). Share via encoded link or export a JSON backup.

## Files
- `budget.html`  the app (open this)
- `sample_budget.json`  demo data (use Import)
- `README.md`  this file

## Quick Start
1) Open `budget.html`.
2) (Optional) Type your name to personalize the header (e.g., Chris  Chris' Goal-Aware Budget).
3) Import `sample_budget.json` to try it.
4) Use **Copy Share Link** for quick sharing, or **Export JSON** to create a file backup.

## What is JSON / When to use Export JSON?
**JSON** is a simple text file that stores your data (income, debts, goal) in a structured format.
Use **Export JSON** when you want to:
- **Back up** your plan to a file (good hygiene before big edits).
- **Move to another device/browser** (Import it there to restore).
- **Share a snapshot** privately as a file (instead of a long link).
If youre just testing or sending a quick view to someone, the **Share Link** is fine. For long-term safety or device changes, keep a JSON backup.

## Notes
- Monthly simulation; lender compounding may differ slightly.
- Minimum payment = your entry, or implied amortized amount when Term & APR exist (else $25 fallback).
