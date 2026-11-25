
import { firebaseConfig } from "./firebase-config.js";

const live = !!(firebaseConfig && firebaseConfig.apiKey && !/YOUR_/.test(firebaseConfig.apiKey));
let impl;

if (live) {
  const V = "10.12.2";
  const [{ initializeApp }, fs] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
  ]);
  const db = fs.getFirestore(initializeApp(firebaseConfig));
  impl = {
    subscribe(col, cb) {
      return fs.onSnapshot(fs.collection(db, col),
        s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))),
        e => console.error(e));
    },
    async add(col, data) {
      const r = await fs.addDoc(fs.collection(db, col), { ...data, createdAt: Date.now() });
      return r.id;
    },
    async update(col, id, patch) { await fs.updateDoc(fs.doc(db, col, id), patch); },
    async remove(col, id) { await fs.deleteDoc(fs.doc(db, col, id)); },
    subscribeCounter(key, cb) {
      return fs.onSnapshot(fs.doc(db, "counters", key),
        s => cb(s.exists() ? s.data().n : 0), e => console.error(e));
    },
    nextNo(key) {
      const ref = fs.doc(db, "counters", key);
      return fs.runTransaction(db, async t => {
        const s = await t.get(ref);
        const n = (s.exists() ? s.data().n : 0) + 1;
        t.set(ref, { n });
        return n;
      });
    }
  };
} else {
  const P = "fl3d:";
  const read = k => { try { return JSON.parse(localStorage.getItem(P + k)) || null; } catch (e) { return null; } };
  const write = (k, v) => { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) {} };
  const subs = [];
  const ping = () => subs.forEach(f => f());
  window.addEventListener("storage", ping);
  const rid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  impl = {
    subscribe(col, cb) {
      const f = () => cb(read("col:" + col) || []);
      subs.push(f); f();
      return () => { const i = subs.indexOf(f); if (i > -1) subs.splice(i, 1); };
    },
    async add(col, data) {
      const l = read("col:" + col) || [], id = rid();
      l.push({ id, ...data, createdAt: Date.now() }); write("col:" + col, l); ping(); return id;
    },
    async update(col, id, patch) {
      const l = (read("col:" + col) || []).map(x => x.id === id ? { ...x, ...patch } : x);
      write("col:" + col, l); ping();
    },
    async remove(col, id) {
      write("col:" + col, (read("col:" + col) || []).filter(x => x.id !== id)); ping();
    },
    subscribeCounter(key, cb) {
      const f = () => cb(read("ctr:" + key) || 0);
      subs.push(f); f();
      return () => { const i = subs.indexOf(f); if (i > -1) subs.splice(i, 1); };
    },
    async nextNo(key) {
      const n = (read("ctr:" + key) || 0) + 1; write("ctr:" + key, n); ping(); return n;
    }
  };
}

export const store = { live, ...impl };
