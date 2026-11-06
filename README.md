# RapiLPJ — Checking Student Organization Activity Reports Before Submission

**Team Name:** Tide Ledger  
**Selected Case:** Case 1: Smarter Campus and Learning (STACK 2026 by GDGoC ITB)  
**Members:** Vincentius Bryan Kwandou (leader), Valentino Filemon Limer, Putra Purwanugraha Tengbunan, Marvel Harjosetio  
**Live Deployment:** https://rapilpj.vercel.app  
**Repository:** https://github.com/bryankwandou/rapilpj

## Overview

RapiLPJ is a static client-side web checker for Indonesian student organization treasurers and secretaries to verify accountability reports (*Laporan Pertanggungjawaban* / LPJ) before submitting them to faculty student affairs offices.

Financial records and receipt attachments remain entirely inside the browser with no account, no backend server, and no AI, ensuring checks are exact and auditable.

## Supported Official Faculty Rule Sets

1. **FIB Universitas Brawijaya** — Stamped original receipts, one attendance sheet per meal session, and identical totals across approval page, expense table, and receipts ([Pedoman LPJ FIB UB](https://fib.ub.ac.id/wp-content/uploads/2024/03/PEDOMAN-LAPORAN-PERTANGGUNG-JAWABAN.pdf)).
2. **FEB Universitas Gadjah Mada** — Revenue stamp (*meterai* Rp10.000) on receipts of Rp5.000.000 or more, and scanning fading thermal receipts ([Prosedur SIPRO FEB UGM](https://bpm.feb.ugm.ac.id/wp-content/uploads/sites/1535/2021/09/DONE-Prosedur-Pengajuan-Proposal-dan-LPJ-ke-SIPRO.pdf)).
3. **HIMA Departemen Desain Interior ITS** — 10-calendar-day submission deadline after the activity date ([SOP HIMA Desain Interior ITS](https://www.its.ac.id/interior/wp-content/uploads/sites/37/2018/10/SOP-HIMA.pdf)).
4. **Departemen Biologi ITS** — Individual entry per receipt (no combined receipts), PPh tax inclusion, and stamped receipts ([SOP LPJ Biologi ITS](https://its.ac.id/biologi/wp-content/uploads/sites/21/2024/09/SOP-Laporan-Pertanggung-Jawaban-Kegiatan-Mahasiswa-Biologi.pdf)).
5. **FILKOM Universitas Brawijaya (2026)** — 7-working-day deadline, mandatory document checklist (execution report, detailed financial report, documentation, assignment letter/certificate), and service/honorarium PPh + recipient ID verification ([SE Proposal dan LPJ Ormawa FILKOM UB 2026](https://filkom.ub.ac.id/wp-content/uploads/2026/04/SK-F15-01678-SURAT-EDARAN-MEKANISME-PENGAJUAN-PROPOSAL-DAN-LAPORAN-PERTANGGUNGJAWABAN-LPJ-KEGIATAN-ORGANISASI-MAHASISWA-FAKULTAS-ILMU-KOMPUTER-UNIVERSITAS-BRAWIJAYA.pdf)).
6. **Custom Rule Set** — Configurable rule toggles for faculties with custom combinations.

## Running Locally & Testing

- Open `index.html` directly in any web browser.
- Run deterministic unit tests:

```bash
node test.js
```
