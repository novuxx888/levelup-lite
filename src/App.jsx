import { useEffect, useMemo, useState } from "react";

/* ---------- Shared helpers ---------- */
const uid = () => crypto.randomUUID();
const cls = (...a) => a.filter(Boolean).join(" ");

function TextInput(props) {
  return (
    <input
      className="flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
      {...props}
    />
  );
}
function Button({ children, className = "", ...props }) {
  return (
    <button
      className={cls(
        "rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm hover:bg-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
function Primary({ children, ...props }) {
  return (
    <button
      className="rounded-2xl border border-black/10 bg-black px-3 py-2 text-sm text-white shadow hover:bg-gray-800"
      {...props}
    >
      {children}
    </button>
  );
}
function Card({ title, actions, children }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

/* ---------- Daily To-Do ---------- */
const LS_DAILY = "dailyTodos_v1";
function DailyTodo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => { try { const raw = localStorage.getItem(LS_DAILY); if (raw) setTodos(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(LS_DAILY, JSON.stringify(todos)); } catch {} }, [todos]);

  const add = () => { const t = text.trim(); if (!t) return;
    setTodos((p) => [{ id: uid(), text: t, done: false, createdAt: Date.now() }, ...p]); setText(""); };
  const toggle = (id) => setTodos((p) => p.map((it) => it.id === id ? { ...it, done: !it.done } : it));
  const del = (id) => setTodos((p) => p.filter((it) => it.id !== id));
  const edit = (id, newText) => setTodos((p) => p.map((it) => it.id === id ? { ...it, text: newText } : it));
  const clearDone = () => setTodos((p) => p.filter((it) => !it.done));
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <Card title={`Daily To-Do (${remaining} left)`} actions={<Button className="text-red-600" onClick={clearDone}>Clear Done</Button>}>
      <div className="mb-3 flex items-center gap-2">
        <TextInput placeholder="Add a daily task…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&add()} />
        <Primary onClick={add}>Add</Primary>
      </div>
      <List todos={todos} onToggle={toggle} onDelete={del} onEdit={edit} />
    </Card>
  );
}

/* ---------- Weekly To-Do ---------- */
const LS_WEEKLY = "weeklyTodos_v1";
const D = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function WeeklyTodo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [day, setDay] = useState("any");

  useEffect(() => { try { const raw = localStorage.getItem(LS_WEEKLY); if (raw) setTodos(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(LS_WEEKLY, JSON.stringify(todos)); } catch {} }, [todos]);

  const add = () => { const t = text.trim(); if (!t) return;
    setTodos((p) => [{ id: uid(), text: t, dayOfWeek: day, done: false, createdAt: Date.now() }, ...p]); setText(""); };
  const toggle = (id) => setTodos((p) => p.map((it) => it.id === id ? { ...it, done: !it.done } : it));
  const del = (id) => setTodos((p) => p.filter((it) => it.id !== id));
  const edit = (id, newText) => setTodos((p) => p.map((it) => it.id === id ? { ...it, text: newText } : it));
  const clearDone = () => setTodos((p) => p.filter((it) => !it.done));

  const groups = useMemo(() => {
    const g = { Any: [], Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] };
    for (const t of todos) {
      const key = t.dayOfWeek === "any" ? "Any" : D[Number(t.dayOfWeek)];
      g[key].push(t);
    }
    return g;
  }, [todos]);

  return (
    <>
      <Card title="Add Weekly Task" actions={<Button className="text-red-600" onClick={clearDone}>Clear Done</Button>}>
        <div className="flex flex-wrap items-center gap-2">
          <TextInput placeholder="Add a weekly task…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&add()} />
          <select className="rounded-xl border border-black/10 px-3 py-2 text-sm" value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="any">Any</option>
            <option value="0">Sun</option><option value="1">Mon</option><option value="2">Tue</option>
            <option value="3">Wed</option><option value="4">Thu</option><option value="5">Fri</option><option value="6">Sat</option>
          </select>
          <Primary onClick={add}>Add</Primary>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(groups).map(([label, items]) => (
          <Card key={label} title={label}>
            <List todos={items} onToggle={toggle} onDelete={del} onEdit={edit} />
          </Card>
        ))}
      </div>
    </>
  );
}

/* ---------- Misc To-Do ---------- */
const LS_MISC = "miscTodos_v1";
function MiscTodo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => { try { const raw = localStorage.getItem(LS_MISC); if (raw) setTodos(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(LS_MISC, JSON.stringify(todos)); } catch {} }, [todos]);

  const add = () => { const t = text.trim(); if (!t) return;
    setTodos((p) => [{ id: uid(), text: t, done: false, createdAt: Date.now() }, ...p]); setText(""); };
  const toggle = (id) => setTodos((p) => p.map((it) => it.id === id ? { ...it, done: !it.done } : it));
  const del = (id) => setTodos((p) => p.filter((it) => it.id !== id));
  const edit = (id, newText) => setTodos((p) => p.map((it) => it.id === id ? { ...it, text: newText } : it));
  const clearDone = () => setTodos((p) => p.filter((it) => !it.done));
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <Card title={`Misc To-Do (${remaining} left)`} actions={<Button className="text-red-600" onClick={clearDone}>Clear Done</Button>}>
      <div className="mb-3 flex items-center gap-2">
        <TextInput placeholder="Add a misc task…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&add()} />
        <Primary onClick={add}>Add</Primary>
      </div>
      <List todos={todos} onToggle={toggle} onDelete={del} onEdit={edit} />
    </Card>
  );
}

/* ---------- Shared list row ---------- */
function List({ todos, onToggle, onDelete, onEdit }) {
  if (!todos || todos.length === 0)
    return <div className="py-6 text-center text-sm text-gray-500">No tasks.</div>;
  return (
    <div className="flex flex-col gap-2">
      {todos.map((it) => (
        <Row key={it.id} item={it} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
function Row({ item, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);
  useEffect(() => setDraft(item.text), [item.text]);
  const save = () => { const t = draft.trim(); if (t) onEdit(item.id, t); setEditing(false); };
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/5 p-2 hover:border-black/10">
      <input type="checkbox" checked={item.done} onChange={() => onToggle(item.id)} />
      {editing ? (
        <input className="flex-1 rounded border border-black/10 px-2 py-1"
               value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} autoFocus />
      ) : (
        <span className={cls("flex-1", item.done && "line-through text-gray-400")}>{item.text}</span>
      )}
      <div className="flex items-center gap-1">
        <Button onClick={() => (editing ? save() : setEditing(true))}>{editing ? "Save" : "Edit"}</Button>
        <Button className="text-red-600" onClick={() => onDelete(item.id)}>Delete</Button>
      </div>
    </div>
  );
}

/* ---------- Finances ---------- */
const LS_FIN = "finances_v1";
function currency(n) {
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0); }
  catch { return `$${(n || 0).toFixed(2)}`; }
}
function Finances() {
  const [txs, setTxs] = useState([]);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [q, setQ] = useState("");

  useEffect(() => { try { const raw = localStorage.getItem(LS_FIN); if (raw) setTxs(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(LS_FIN, JSON.stringify(txs)); } catch {} }, [txs]);

  const add = () => {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return;
    const tx = { id: uid(), type, amount: amt, category: category.trim() || "General", note: note.trim(), date };
    setTxs((p) => [tx, ...p]);
    setAmount(""); setCategory(""); setNote("");
  };
  const del = (id) => setTxs((p) => p.filter((t) => t.id !== id));

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return txs;
    return txs.filter(t => `${t.type} ${t.category} ${t.note}`.toLowerCase().includes(s));
  }, [txs, q]);

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    for (const t of txs) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, net: income - expense };
  }, [txs]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card title="Add Transaction">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <select className="rounded-xl border border-black/10 px-3 py-2 text-sm" value={type} onChange={(e)=>setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <TextInput type="number" step="0.01" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
          </div>
          <TextInput placeholder="Category (e.g., Food, Rent)" value={category} onChange={(e)=>setCategory(e.target.value)} />
          <TextInput type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          <TextInput placeholder="Note (optional)" value={note} onChange={(e)=>setNote(e.target.value)} />
          <Primary onClick={add}>Add</Primary>
        </div>
      </Card>

      <Card title="Overview">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border bg-green-50 p-3 border-green-200">
            <div className="text-xs uppercase text-green-700">Income</div>
            <div className="text-xl font-bold">{currency(totals.income)}</div>
          </div>
          <div className="rounded-xl border bg-red-50 p-3 border-red-200">
            <div className="text-xs uppercase text-red-700">Expense</div>
            <div className="text-xl font-bold">{currency(totals.expense)}</div>
          </div>
          <div className="rounded-xl border bg-gray-50 p-3 border-gray-200">
            <div className="text-xs uppercase text-gray-700">Net</div>
            <div className="text-xl font-bold">{currency(totals.net)}</div>
          </div>
        </div>
      </Card>

      <Card title="Transactions" actions={
        <TextInput placeholder="Search (type/category/note)" value={q} onChange={(e)=>setQ(e.target.value)} />
      }>
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">No transactions.</div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 border-b border-black/5 py-2">
                <div className="min-w-0">
                  <div className="text-sm">
                    <span className={cls(t.type === "income" ? "text-green-700" : "text-red-700", "font-semibold")}>{t.type}</span>{" "}
                    <span className="font-medium">{currency(t.amount)}</span>{" "}
                    <span className="text-gray-500">• {t.category}</span>
                  </div>
                  <div className="truncate text-xs text-gray-500">{t.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{t.date}</div>
                  <Button className="text-red-600" onClick={() => del(t.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------- Journal ---------- */
const LS_JOURNAL = "journal_v1";
function parseTags(input) {
  return input.split(",").map(s => s.trim()).filter(Boolean);
}
function Journal() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => { try { const raw = localStorage.getItem(LS_JOURNAL); if (raw) setEntries(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(LS_JOURNAL, JSON.stringify(entries)); } catch {} }, [entries]);

  const add = () => {
  const t = title.trim();
  const c = content.trim();
  if (!t && !c) return;
  const tags = parseTags(tagsInput);
  const now = Date.now();
  const defaultTitle = new Date(now).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  setEntries(p => [{
    id: uid(),
    title: t || defaultTitle,   // ← use date if no title
    content: c,
    tags,
    createdAt: now,
    updatedAt: now
  }, ...p]);
  setTitle(""); setContent(""); setTagsInput("");
};

  const del = (id) => setEntries(p => p.filter(e => e.id !== id));
  const save = (id, patch) => setEntries(p => p.map(e => e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e));

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return entries;
    return entries.filter(e =>
      (e.title.toLowerCase().includes(s)) ||
      (e.content.toLowerCase().includes(s)) ||
      (e.tags.join(" ").toLowerCase().includes(s))
    );
  }, [entries, q]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card title="New Entry">
        <div className="flex flex-col gap-4">
          <TextInput placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <textarea
          className="w-full resize-none rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Write your thoughts…"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            e.target.style.height = "auto";        // reset
            e.target.style.height = e.target.scrollHeight + "px";  // grow
  }}
  style={{ minHeight: "10px" }}
/>

          <TextInput placeholder="Tags (comma-separated)" value={tagsInput} onChange={(e)=>setTagsInput(e.target.value)} />
          <Primary onClick={add}>Add Entry</Primary>
        </div>
      </Card>

      <Card title="Entries" actions={<TextInput placeholder="Search title/content/tags" value={q} onChange={(e)=>setQ(e.target.value)} />}>
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">No entries.</div>
        ) : (
          <div className="flex flex-col">
            {filtered.map(e => <JournalRow key={e.id} entry={e} onDelete={del} onSave={save} />)}
          </div>
        )}
      </Card>

      <Card title="Tips">
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Use tags like <code>ideas, school, finance</code> to organize.</li>
          <li>Search matches title, content, and tags.</li>
          <li>Everything is saved locally on this device.</li>
        </ul>
      </Card>
    </div>
  );
}
function JournalRow({ entry, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [t, setT] = useState(entry.title);
  const [c, setC] = useState(entry.content);
  const [tags, setTags] = useState(entry.tags.join(", "));

  useEffect(() => { setT(entry.title); setC(entry.content); setTags(entry.tags.join(", ")); }, [entry]);

  const saveNow = () => {
    onSave(entry.id, { title: t.trim() || "Untitled", content: c, tags: parseTags(tags) });
    setEditing(false);
  };

  const ts = new Date(entry.updatedAt || entry.createdAt).toLocaleString();

  return (
    <div className="border-b border-black/5 py-3">
      {editing ? (
        <div className="flex flex-col gap-2">
          <TextInput value={t} onChange={(e)=>setT(e.target.value)} />
          <textarea
            className="min-h-[100px] rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
            value={c}
            onChange={(e)=>setC(e.target.value)}
          />
          <TextInput placeholder="Tags (comma-separated)" value={tags} onChange={(e)=>setTags(e.target.value)} />
          <div className="flex gap-2">
            <Primary onClick={saveNow}>Save</Primary>
            <Button onClick={()=>setEditing(false)}>Cancel</Button>
            <Button className="text-red-600" onClick={()=>onDelete(entry.id)}>Delete</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold truncate">{entry.title}</div>
            <div className="text-xs text-gray-500">{ts}</div>
          </div>
          <div className="whitespace-pre-wrap text-sm text-gray-800">{entry.content}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {entry.tags.map(tag => (
              <span key={tag} className="rounded-full border border-black/10 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">#{tag}</span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Primary onClick={()=>setEditing(true)}>Edit</Primary>
            <Button className="text-red-600" onClick={()=>onDelete(entry.id)}>Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- App shell with tabs ---------- */
const TABS = ["Daily", "Weekly", "Misc", "Finances", "Journal", "Schedule"];
export default function App() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">LevelUP Lite</h1>
          <p className="text-gray-600">To-Dos • Finances • Journal</p>
        </header>

        <div className="mb-4 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              className={cls(
                "rounded-2xl border px-3 py-2 text-sm",
                tab === t ? "border-black bg-black text-white" : "border-black/10 bg-white hover:bg-gray-50"
              )}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Daily" && <DailyTodo />}
        {tab === "Weekly" && <WeeklyTodo />}
        {tab === "Misc" && <MiscTodo />}
        {tab === "Finances" && <Finances />}
        {tab === "Journal" && <Journal />}
        {tab === "Schedule" && <Schedule />}
      </div>
    </div>
  );
}

/* ---------- Schedule ---------- */
const LS_SCHEDULE = "schedule_v1";

function Schedule() {
  const [blocks, setBlocks] = useState([]);
  const [activity, setActivity] = useState("");
  const [time, setTime] = useState("09:00");

  // Load + Save
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_SCHEDULE);
      if (raw) setBlocks(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_SCHEDULE, JSON.stringify(blocks));
    } catch {}
  }, [blocks]);

  // Add a block
  const add = () => {
    const a = activity.trim();
    if (!a) return;
    setBlocks((prev) => [
      { id: uid(), time, activity: a },
      ...prev.sort((x, y) => x.time.localeCompare(y.time)),
    ]);
    setActivity("");
  };

  const del = (id) => setBlocks((prev) => prev.filter((b) => b.id !== id));
  const edit = (id, newActivity) =>
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, activity: newActivity } : b))
    );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Add Block */}
      <Card title="Add Block">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl border border-black/10 px-3 py-2 text-sm"
            />
            <TextInput
              placeholder="Activity (e.g., Study, Workout)"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <Primary onClick={add}>Add</Primary>
          </div>
        </div>
      </Card>

      {/* Day Plan */}
      <Card title="Today's Schedule">
        {blocks.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">
            No blocks yet. Add your first activity!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {blocks
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((b) => (
                <ScheduleRow
                  key={b.id}
                  block={b}
                  onDelete={del}
                  onEdit={edit}
                />
              ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function ScheduleRow({ block, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(block.activity);

  const save = () => {
    if (draft.trim()) onEdit(block.id, draft.trim());
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/5 p-2 hover:border-black/10">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-gray-600">{block.time}</span>
        {editing ? (
          <input
            className="rounded border border-black/10 px-2 py-1 text-sm"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            autoFocus
          />
        ) : (
          <span className="text-sm">{block.activity}</span>
        )}
      </div>
      <div className="flex gap-1">
        <Button onClick={() => (editing ? save() : setEditing(true))}>
          {editing ? "Save" : "Edit"}
        </Button>
        <Button className="text-red-600" onClick={() => onDelete(block.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
