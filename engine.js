/* RapiLPJ: cek LPJ kegiatan ormawa sebelum diserahkan. Tanpa jaringan, tanpa AI.
 * Setiap aturan berasal dari dokumen pada `source`. */
(function (root, f) { if (typeof module === 'object' && module.exports) module.exports = f(); else root.LPJ = f(); })(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const RULES = {
    stamp: { text: 'Nota asli harus bercap atau berstempel toko.', src: 'fibub' },
    totalsMatch: { text: 'Nominal di lembar pengesahan, tabel pengeluaran, dan jumlah nota harus sama.', src: 'fibub' },
    attendance: { text: 'Daftar hadir dibuat sebanyak jumlah sesi konsumsi.', src: 'fibub' },
    materai: { text: 'Nota Rp5.000.000 atau lebih wajib bermeterai Rp10.000.', src: 'ugmfeb' },
    thermal: { text: 'Nota bertinta mudah pudar (struk minimarket) segera difotokopi atau dipindai.', src: 'ugmfeb' },
    deadline10: { text: 'Laporan kegiatan paling lambat 10 hari setelah kegiatan.', src: 'itshima' },
    perNote: { text: 'Rekap per nota, bukan beberapa nota digabung jadi satu.', src: 'itsbio' },
    pph: { text: 'Nominal pada nota harus sudah termasuk PPh.', src: 'itsbio' },
    deadline7work: { text: 'LPJ paling lambat 7 hari kerja setelah kegiatan. Telat atau tidak lengkap dikembalikan, dan proposal berikutnya bisa ditunda atau ditolak.', src: 'filkom' },
    filkomDocs: { text: 'LPJ dilengkapi laporan pelaksanaan, laporan keuangan rinci, dokumentasi, dan salinan surat tugas atau sertifikat.', src: 'filkom' },
    serviceTax: { text: 'Belanja jasa dan honorarium wajib memenuhi PPh dan identitas penerima.', src: 'filkom' },
  };
  const SOURCES = {
    fibub: { name: 'Pedoman LPJ FIB Universitas Brawijaya', url: 'https://fib.ub.ac.id/wp-content/uploads/2024/03/PEDOMAN-LAPORAN-PERTANGGUNG-JAWABAN.pdf' },
    ugmfeb: { name: 'Prosedur Proposal dan LPJ ke SIPRO, FEB UGM', url: 'https://bpm.feb.ugm.ac.id/wp-content/uploads/sites/1535/2021/09/DONE-Prosedur-Pengajuan-Proposal-dan-LPJ-ke-SIPRO.pdf' },
    itshima: { name: 'SOP HIMA, Departemen Desain Interior ITS', url: 'https://www.its.ac.id/interior/wp-content/uploads/sites/37/2018/10/SOP-HIMA.pdf' },
    filkom: { name: 'Surat Edaran Mekanisme Proposal dan LPJ Ormawa, FILKOM UB (2026)', url: 'https://filkom.ub.ac.id/wp-content/uploads/2026/04/SK-F15-01678-SURAT-EDARAN-MEKANISME-PENGAJUAN-PROPOSAL-DAN-LAPORAN-PERTANGGUNGJAWABAN-LPJ-KEGIATAN-ORGANISASI-MAHASISWA-FAKULTAS-ILMU-KOMPUTER-UNIVERSITAS-BRAWIJAYA.pdf' },
    itsbio: { name: 'SOP LPJ Kegiatan Mahasiswa, Biologi ITS', url: 'https://its.ac.id/biologi/wp-content/uploads/sites/21/2024/09/SOP-Laporan-Pertanggung-Jawaban-Kegiatan-Mahasiswa-Biologi.pdf' },
  };
  /* Preset = aturan yang tercantum di dokumen itu saja. "Semua" untuk pemeriksaan paling ketat. */
  const PRESETS = {
    fibub: ['stamp', 'totalsMatch', 'attendance'],
    ugmfeb: ['materai', 'thermal'],
    itshima: ['deadline10'],
    itsbio: ['perNote', 'pph', 'stamp'],
    filkom: ['deadline7work', 'filkomDocs', 'serviceTax'],
    all: Object.keys(RULES),
  };
  const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
  /* Hari kerja = Senin sampai Jumat. Libur nasional tidak dihitung, jadi hasilnya bisa lebih ketat dari aturan. */
  function workDays(a, b) { let n = 0; const d = new Date(a + 'T00:00:00Z'), end = new Date(b + 'T00:00:00Z'); while (d < end) { d.setUTCDate(d.getUTCDate() + 1); const w = d.getUTCDay(); if (w !== 0 && w !== 6) n++; } return n; }

  /* lpj = { eventDate, submitDate, approvedTotal, consumptionSessions, attendanceSheets, budget:[{item,planned}], notes:[{no,item,amount,stamp,thermal,scanned,materai,combined,pphIncluded}] } */
  function check(lpj, preset) {
    const customList = Array.isArray(lpj && lpj.customRules) ? lpj.customRules.filter((k) => RULES[k]) : null;
    const on = new Set(preset === 'custom' && customList ? customList : (PRESETS[preset] || PRESETS.all));
    const issues = [];
    const add = (rule, msg, row) => issues.push({ rule, msg, row, source: SOURCES[RULES[rule].src] });
    const notes = lpj.notes || [];
    const spent = notes.reduce((s, n) => s + (+n.amount || 0), 0);
    notes.forEach((n, i) => {
      const r = 'Nota ' + (n.no || i + 1) + (n.item ? ' (' + n.item + ')' : '');
      if (on.has('stamp') && !n.stamp) add('stamp', r + ' belum bercap atau berstempel.', i);
      if (on.has('materai') && +n.amount >= 5000000 && !n.materai) add('materai', r + ' bernilai Rp' + fmt(n.amount) + ' tetapi belum bermeterai.', i);
      if (on.has('thermal') && n.thermal && !n.scanned) add('thermal', r + ' berupa struk mudah pudar dan belum dipindai.', i);
      if (on.has('perNote') && n.combined) add('perNote', r + ' menggabungkan beberapa nota.', i);
      if (on.has('pph') && n.pphIncluded === false) add('pph', r + ' belum termasuk PPh.', i);
      if (on.has('serviceTax') && n.service && (n.pphIncluded === false || !n.recipientId)) add('serviceTax', r + ' adalah jasa atau honorarium tetapi ' + (n.pphIncluded === false ? 'belum termasuk PPh' : 'identitas penerima belum ada') + '.', i);
    });
    if (on.has('totalsMatch') && lpj.approvedTotal != null && +lpj.approvedTotal !== spent) add('totalsMatch', 'Lembar pengesahan Rp' + fmt(lpj.approvedTotal) + ', jumlah nota Rp' + fmt(spent) + '. Selisih Rp' + fmt(Math.abs(lpj.approvedTotal - spent)) + '.');
    if (on.has('attendance') && lpj.consumptionSessions > 0 && (lpj.attendanceSheets || 0) < lpj.consumptionSessions) add('attendance', 'Ada ' + lpj.consumptionSessions + ' sesi konsumsi, tetapi baru ' + (lpj.attendanceSheets || 0) + ' daftar hadir.');
    if (on.has('deadline10') && lpj.eventDate && lpj.submitDate) { const d = days(lpj.eventDate, lpj.submitDate); if (d > 10) add('deadline10', 'Diserahkan ' + d + ' hari setelah kegiatan, lewat batas 10 hari.'); }
    if (on.has('deadline7work') && lpj.eventDate && lpj.submitDate) { const w = workDays(lpj.eventDate, lpj.submitDate); if (w > 7) add('deadline7work', 'Diserahkan ' + w + ' hari kerja setelah kegiatan, lewat batas 7 hari kerja.'); }
    if (on.has('filkomDocs')) { const d = lpj.docs || {}; const miss = [['report', 'laporan pelaksanaan'], ['finance', 'laporan keuangan rinci'], ['photos', 'dokumentasi'], ['assignment', 'surat tugas atau sertifikat']].filter(([k]) => !d[k]).map(([, v]) => v); if (miss.length) add('filkomDocs', 'Belum ada: ' + miss.join(', ') + '.'); }
    const budget = (lpj.budget || []).map((b) => { const real = notes.filter((n) => n.item === b.item).reduce((s, n) => s + (+n.amount || 0), 0); return { item: b.item, planned: +b.planned, real, diff: real - b.planned }; });
    const planned = budget.reduce((s, b) => s + b.planned, 0);
    return { issues, spent, planned, budget, rules: [...on].map((k) => ({ key: k, ...RULES[k], source: SOURCES[RULES[k].src] })) };
  }
  function fmt(n) { return Math.round(+n).toLocaleString('id-ID'); }
  function csv(res) {
    const rows = [['Pos', 'Rencana', 'Realisasi', 'Selisih']].concat(res.budget.map((b) => [b.item, b.planned, b.real, b.diff]), [['Total', res.planned, res.spent, res.spent - res.planned]]);
    return '﻿' + rows.map((r) => r.map((v) => /[",;\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(',')).join('\r\n');
  }
  return { RULES, SOURCES, PRESETS, check, csv, fmt, workDays };
});
