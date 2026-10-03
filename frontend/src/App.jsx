import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Search, Bell, Cloud, Activity, AlertTriangle, CheckCircle2, Clock3, RefreshCw, ArrowUpRight, Server, Database, X, Plus } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
const severityClass = (s) => (s || '').toLowerCase();
const prettyTime = (s) => s ? new Date(s).toLocaleString() : '—';

export default function App() {
  const [findings, setFindings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/findings`);
      if (!res.ok) throw new Error('Backend did not respond. Start Spring Boot on port 8081.');
      setFindings(await res.json());
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => findings.filter(f =>
    (filter === 'ALL' || f.status === filter) &&
    `${f.title} ${f.resource} ${f.severity} ${f.product}`.toLowerCase().includes(query.toLowerCase())
  ), [findings, filter, query]);

  const count = (s) => findings.filter(f => f.severity === s).length;
  const updateSelected = (f) => { setSelected(f); setNote(''); };

  async function changeStatus(status) {
    if (!selected) return;
    try {
      const res = await fetch(`${API}/findings/${selected.id}/status`, {
        method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({status})
      });
      if (!res.ok) throw new Error('Could not update status.');
      const updated = await res.json();
      setSelected(updated); await load();
    } catch (e) { setError(e.message); }
  }
  async function addNote() {
    if (!selected || !note.trim()) return;
    try {
      const res = await fetch(`${API}/findings/${selected.id}/notes`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({note})
      });
      if (!res.ok) throw new Error('Could not save note.');
      const updated = await res.json(); setSelected(updated); setNote(''); await load();
    } catch (e) { setError(e.message); }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><ShieldCheck size={22}/></div><div><b>Sentinel</b><span>AWS SECURITY MONITOR</span></div></div>
      <div className="nav-label">WORKSPACE</div>
      <div className="nav-item active"><Activity size={17}/> Overview</div>
      <div className="nav-item"><AlertTriangle size={17}/> Findings <span className="nav-count">{findings.length}</span></div>
      <div className="nav-item"><Database size={17}/> Resources</div>
      <div className="sidebar-bottom"><div className="status-dot"></div><div><b>Demo environment</b><span>Sample findings only</span></div></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><div className="eyebrow">SECURITY OPERATIONS / OVERVIEW</div><h1>Security dashboard</h1><p>Monitor findings, prioritize risk, and track investigation progress.</p></div>
        <div className="top-actions"><span className="region"><Cloud size={15}/> us-east-1</span><button className="icon-button" onClick={load} title="Refresh"><RefreshCw size={17}/></button><div className="avatar">PS</div></div>
      </header>

      <div className="demo-banner"><span className="pulse"></span><div><b>DEMO MODE</b><span>Showing simulated findings from the local backend — not live AWS alerts.</span></div><button onClick={load}>Refresh data <RefreshCw size={14}/></button></div>
      {error && <div className="error-banner">{error}</div>}

      <section className="metric-grid">
        <Metric icon={<Activity/>} label="Total findings" value={findings.length} foot="Loaded from backend" />
        <Metric icon={<AlertTriangle/>} label="High severity" value={count('HIGH')} foot="Review promptly" tone="red"/>
        <Metric icon={<Clock3/>} label="New findings" value={findings.filter(f=>f.status==='NEW').length} foot="Awaiting triage" tone="amber"/>
        <Metric icon={<CheckCircle2/>} label="Resolved" value={findings.filter(f=>f.status==='RESOLVED').length} foot="Workflow marked resolved" tone="green"/>
      </section>

      <section className="content-card">
        <div className="section-head"><div><h2>Security findings</h2><p>Review the alert details and record investigation notes.</p></div><span className="sample-chip">SAMPLE DATA</span></div>
        <div className="toolbar">
          <div className="searchbox"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search findings or resources..."/></div>
          <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="ALL">All statuses</option><option value="NEW">New</option><option value="NOTIFIED">Notified</option><option value="RESOLVED">Resolved</option></select>
          <button className="refresh-button" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
        </div>
        <div className="table-wrap"><table><thead><tr><th>FINDING</th><th>SEVERITY</th><th>RESOURCE</th><th>STATUS</th><th>DETECTED</th><th></th></tr></thead>
          <tbody>{visible.map(f=><tr key={f.id} onClick={()=>updateSelected(f)} className={selected?.id===f.id?'selected-row':''}>
            <td><div className="finding-title"><span className={`finding-icon ${severityClass(f.severity)}`}><AlertTriangle size={16}/></span><div><b>{f.title}</b><small>{f.product} · {f.resourceType}</small></div></div></td>
            <td><span className={`severity ${severityClass(f.severity)}`}>{f.severity}</span></td>
            <td className="resource">{f.resource}</td><td><span className={`status ${severityClass(f.status)}`}>{f.status}</span></td><td className="time">{prettyTime(f.createdAt)}</td>
            <td><button className="row-open" onClick={(e)=>{e.stopPropagation();updateSelected(f)}}><ArrowUpRight size={16}/></button></td>
          </tr>)}
          {!visible.length && <tr><td colSpan="6" className="empty">No findings match your search.</td></tr>}
          </tbody></table></div>
        <div className="table-footer">Showing {visible.length} of {findings.length} findings <span>Source: local Spring Boot API</span></div>
      </section>

      <footer><span><ShieldCheck size={15}/> Sentinel Security Monitor</span><span>GuardDuty + Security Hub CSPM project prototype</span></footer>
    </main>

    {selected && <div className="drawer-backdrop" onClick={()=>setSelected(null)}>
      <section className="drawer" onClick={e=>e.stopPropagation()}>
        <div className="drawer-head"><div><span className="eyebrow">FINDING DETAILS</span><h2>Investigation</h2></div><button className="icon-button" onClick={()=>setSelected(null)}><X size={18}/></button></div>
        <span className={`severity ${severityClass(selected.severity)}`}>{selected.severity} SEVERITY</span>
        <h3>{selected.title}</h3><p className="drawer-description">{selected.description}</p>
        <div className="detail-grid"><Detail label="Finding ID" value={selected.id}/><Detail label="Product" value={selected.product}/><Detail label="Resource type" value={selected.resourceType}/><Detail label="Affected resource" value={selected.resource}/><Detail label="Detected at" value={prettyTime(selected.createdAt)}/><Detail label="Data type" value={selected.sample?'Simulated sample':'AWS finding'}/></div>
        <label className="field-label">Workflow status</label><select className="status-select" value={selected.status} onChange={e=>changeStatus(e.target.value)}><option value="NEW">NEW</option><option value="NOTIFIED">NOTIFIED</option><option value="RESOLVED">RESOLVED</option></select>
        <label className="field-label">Investigation note</label><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Example: Reviewed finding details; checking bucket policy..." rows="3"/>
        <button className="primary-button" onClick={addNote} disabled={!note.trim()}><Plus size={16}/> Add investigation note</button>
        <div className="notes-head">ACTIVITY NOTES <span>{selected.notes?.length || 0}</span></div>
        {selected.notes?.length ? <div className="notes-list">{[...selected.notes].reverse().map((n,i)=><div className="note" key={i}>{n}</div>)}</div> : <div className="no-notes">No investigation notes yet.</div>}
        <div className="drawer-warning">Changing workflow status or adding a note updates this demo app's local backend only. It does not change an AWS finding.</div>
      </section>
    </div>}
  </div>;
}

function Metric({icon,label,value,foot,tone=''}) { return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-foot">{foot}</div></div>; }
function Detail({label,value}) { return <div className="detail"><span>{label}</span><b>{value}</b></div>; }
