import { Search, Plus, X, Phone, Mail, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";



/* ───────────────────────────────────────────────
   FLIPPABLE CARD
─────────────────────────────────────────────── */

const Field = ({ label, icon, name, value, onChange, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: ".05em" }}>
      {icon} {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onClick={(e) => e.stopPropagation()}
      style={{ width: "100%", padding: "7px 10px", fontSize: 13, borderRadius: 7, border: "1px solid #86efac", background: "rgba(255,255,255,.9)", color: "#111827", outline: "none", boxSizing: "border-box" }}
    />
  </div>
);
const FlippableCard = ({ contact, onFlipSave, onDelete }) => {
  const [flipped, setFlipped] = useState(false);
  const [form, setForm] = useState({
    pin:      contact.pin      || "",
    github:   contact.github   || "",
    linkedin: contact.linkedin || "",
    website:  contact.website  || "",
  });
  const [saved, setSaved] = useState(false);

  const initials = (name = "") => name.split(" ").map((n) => n[0]).join("");
 const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};
  const handleSave = (e) => {
    e.stopPropagation();
    onFlipSave(contact.id, form);
    setSaved(true);
    setTimeout(() => { setSaved(false); setFlipped(false); }, 900);
  };

  const stopAndUnflip = (e) => { e.stopPropagation(); setFlipped(false); };


  return (
    <div style={{ perspective: 1400, marginBottom: 14, padding: "0 24px" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: 250,
          height: "auto",
          transformStyle: "preserve-3d",
          transition: "transform .6s cubic-bezier(.4,.2,.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          willChange:"tranform"
        }}
      >
        {/* ── FRONT ── */}
        <div
          onClick={() => setFlipped(true)}
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            borderLeft: "4px solid #22c55e",
            display: "flex", alignItems: "stretch",
            overflow: "hidden", cursor: "pointer",
          }}
        >
          {/* Avatar col */}
          <div style={{ width: 155, minWidth: 155, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, borderRight: "2px solid #1a833f" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, color: "#fff" }}>
                {initials(contact.name)}
              </div>
              {contact.online && (
                <span style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
              )}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", textAlign: "center", padding: "0 8px" }}>{contact.name}</div>
            <div style={{ fontSize: 15, color: "#0a0a0a" }}>🏢 {contact.company_name}</div>
          </div>

          {/* Info grid 2×2 */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
            {[
              { icon: "✉️", val: contact.email,           bl: false, bb: true,  muted: false },
              { icon: "📞", val: contact.phone,            bl: false, bb: false, muted: false },
             
            ].map(({ icon, val, bl, bb, muted }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 18px", fontSize: 20, height: "50%", color: muted ? "#9ca3af" : "#374151", borderLeft: bl ? "2px dashed #25a552" : undefined, borderBottom: bb ? "1px dashed #dcfce7" : undefined, overflow: "hidden" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Delete button on front */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(contact.id); }}
            style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#fca5a5", padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>

          <span style={{ position: "absolute", bottom: 7, right: 10, fontSize: 10, color: "#86efac" }}>✎ click to edit</span>
        </div>

        {/* ── BACK ── */}
        <div
          onClick={() => setFlipped(false)}
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 14,
            background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
            border: "1px solid #86efac", borderLeft: "4px solid #22c55e",
            padding: "12px 18px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: ".07em" }}>✏ Add details</span>
            <button onClick={stopAndUnflip} style={{ fontSize: 17, color: "#86efac", cursor: "pointer", border: "none", background: "none", lineHeight: 1, padding: 0 }}>✕</button>
          </div>

          {/* Fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
           <Field label="Pin Code" icon="📮" name="pin"      value={form.pin}      onChange={handleChange} placeholder="e.g. 560001" />
<Field label="GitHub"   icon="🐙" name="github"   value={form.github}   onChange={handleChange} placeholder="username"    />
<Field label="LinkedIn" icon="🔗" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="profile URL" />
<Field label="Website"  icon="🌐" name="website"  value={form.website}  onChange={handleChange} placeholder="https://"    />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleSave}
              style={{ padding: "7px 24px", borderRadius: 8, border: "none", background: saved ? "#15803d" : "#22c55e", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "background .2s" }}
            >
              {saved ? "✓ Saved!" : "Save"}
            </button>
            <button
              onClick={stopAndUnflip}
              style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid #86efac", background: "transparent", color: "#166534", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────
   MAIN PAGE
─────────────────────────────────────────────── */
const Index = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/contacts/")
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  const [search,    setSearch]    = useState("");
  const [isAdding,  setIsAdding]  = useState(false);
  const [newForm,   setNewForm]   = useState({ name: "", company_name: "", phone: "", email: "", address: "" });

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddContact = async () => {
    if (!newForm.name.trim() || !newForm.email.trim()) return;
    if (newForm.phone && newForm.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    const res = await fetch("http://localhost:8000/api/contacts/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm),
    });
    const saved = await res.json();
    const newContact = { ...newForm, id: saved.id, online: false };
    setContacts((prev) => [...prev, newContact]);
    setNewForm({ name: "", company_name: "", phone: "", email: "", address: "" });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8000/api/contacts/${id}/`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleFlipSave = async (id, flipData) => {
    const existing = contacts.find((c) => c.id === id);
    if (!existing) return;
    const merged = { ...existing, ...flipData };
    await fetch(`http://localhost:8000/api/contacts/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged),
    });
    setContacts((prev) => prev.map((c) => (c.id === id ? merged : c)));
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", background: "#f9fafb", color: "#1a1a2e" }}>

      {/* ── MAIN COLUMN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>
            Counter: <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 18 }}>({contacts.length})</span>
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <Search size={16} color="#9ca3af" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, border: "1px solid #e5e7eb", borderRadius: 8, outline: "none", width: 220, background: "#fff" }}
              />
            </div>
            <button
              onClick={() => { setIsAdding(true); setNewForm({ name: "", company_name: "", phone: "", email: "", address: "" }); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
            >
              <Plus size={12} /> Add Contact
            </button>
          </div>
        </div>

        {/* Cards */}
        <div style={{ flex: 1, overflowY: "auto", paddingTop: 16 }}>
          {filtered.map((contact) => (
            <FlippableCard
              key={contact.id}
              contact={contact}
              onFlipSave={handleFlipSave}
              onDelete={handleDelete}
            />
          ))}
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: 32, fontSize: 14 }}>No contacts found.</p>
          )}
        </div>
      </div>

      {/* ── ADD CONTACT PANEL ── */}
      {isAdding && (
        <div style={{ width: 300, borderLeft: "1px solid #e5e7eb", background: "#fff", padding: 24, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Add New Contact</h3>
            <button onClick={() => setIsAdding(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <EditField label="Name *"    value={newForm.name}         onChange={(v) => setNewForm({ ...newForm, name: v })} />
            <EditField label="Company"   value={newForm.company_name} onChange={(v) => setNewForm({ ...newForm, company_name: v })} />
            <EditField label="Phone"     value={newForm.phone}        onChange={(v) => { if (v.length <= 10) setNewForm({ ...newForm, phone: v }); }} />
            <EditField label="Email *"   value={newForm.email}        onChange={(v) => setNewForm({ ...newForm, email: v })} />
            <EditField label="Address"   value={newForm.address}      onChange={(v) => setNewForm({ ...newForm, address: v })} />
            <button
              onClick={handleAddContact}
              style={{ marginTop: 12, padding: "10px 0", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Add Contact
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Sub-components ── */
const EditField = ({ label, value, onChange }) => (
  <div>
    <label style={{ fontSize: 12, color: "#9ca3af" }}>{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", padding: "6px 10px", fontSize: 15, border: "2px solid #a9ecb2", borderRadius: 6, outline: "none", background: "#fff", color: "#111", boxSizing: "border-box" }}
    />
  </div>
);

export default Index;