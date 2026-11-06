const L = require('./engine.js'), a = require('assert');
const good = { docs: { report: 1, finance: 1, photos: 1, assignment: 1 }, eventDate: '2026-10-01', submitDate: '2026-10-08', approvedTotal: 1500000, consumptionSessions: 2, attendanceSheets: 2,
  budget: [{ item: 'Konsumsi', planned: 1000000 }, { item: 'Banner', planned: 600000 }],
  notes: [{ no: 1, item: 'Konsumsi', amount: 1000000, stamp: true, pphIncluded: true }, { no: 2, item: 'Banner', amount: 500000, stamp: true, pphIncluded: true }] };
let r = L.check(good, 'all'); a.equal(r.issues.length, 0, JSON.stringify(r.issues)); a.equal(r.spent, 1500000); a.equal(r.planned, 1600000); a.equal(r.budget[1].diff, -100000);
const bad = JSON.parse(JSON.stringify(good));
bad.submitDate = '2026-10-15'; bad.approvedTotal = 1600000; bad.attendanceSheets = 1;
bad.notes.push({ no: 3, item: 'Sewa', amount: 5000000, stamp: false, thermal: true, scanned: false, combined: true, pphIncluded: false });
r = L.check(bad, 'all'); const k = r.issues.map((i) => i.rule).sort();
a.deepStrictEqual(k, ['attendance', 'deadline10', 'deadline7work', 'materai', 'pph', 'perNote', 'stamp', 'thermal', 'totalsMatch'].sort());
// Presets only apply their own document's rules
a.deepStrictEqual(L.check(bad, 'itshima').issues.map((i) => i.rule), ['deadline10']);
a.deepStrictEqual([...new Set(L.check(bad, 'ugmfeb').issues.map((i) => i.rule))].sort(), ['materai', 'thermal']);
a(!L.check({ ...bad, notes: [{ amount: 4999999, stamp: true }] }, 'ugmfeb').issues.length);
a(L.check(bad, 'all').issues.every((i) => i.source && i.source.url.startsWith('https://')));
a(/Total,1600000,6500000,4900000/.test(L.csv(L.check(bad, 'all'))));
// FILKOM: Fri 2 Oct 2026 -> Mon 12 Oct = 6 working days; Tue 13 Oct = 7; Wed 14 Oct = 8
a.equal(L.workDays('2026-10-02', '2026-10-12'), 6); a.equal(L.workDays('2026-10-02', '2026-10-13'), 7);
const fk = { eventDate: '2026-10-02', submitDate: '2026-10-13', docs: { report: 1, finance: 1, photos: 1, assignment: 1 }, notes: [{ item: 'MC', amount: 500000, service: true, pphIncluded: true, recipientId: true }] };
a.equal(L.check(fk, 'filkom').issues.length, 0);
const fk2 = { ...fk, submitDate: '2026-10-14', docs: { report: 1 }, notes: [{ item: 'MC', amount: 500000, service: true, pphIncluded: true }] };
a.deepStrictEqual(L.check(fk2, 'filkom').issues.map(i => i.rule).sort(), ['deadline7work', 'filkomDocs', 'serviceTax']);
// Custom rule set only applies selected rule keys
a.deepStrictEqual(L.check({ ...bad, customRules: ['stamp', 'materai'] }, 'custom').issues.map(i => i.rule).sort(), ['materai', 'stamp']);
console.log('LULUS');
