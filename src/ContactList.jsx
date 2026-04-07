import { Users, Phone, Mail, Pencil, Trash2, Search, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";


const initialContacts = [
  { id: 1, name: "Arlene Murphy", company_name: "Pinnacle Group", phone: "+44 (406) 555-0120", email: "baker@yahoo.com", online: false },
  { id: 2, name: "Bessie Cooper", company_name: "TechFlow Inc", phone: "+41 (505) 555-0125", email: "besscooper@gmail.com", online: true },
];

const Index = () => {
const [contacts, setContacts] = useState([]);

useEffect(() => {
  fetch("http://localhost:8000/api/contacts/")
    .then((res) => res.json())
    .then((data) => setContacts(data));
}, []);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("contact");
  const [isAdding, setIsAdding] = useState(false);
const [newForm, setNewForm] = useState({ name: "", company_name: "", phone: "", email: "" });


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
  setNewForm({ name: "", company_name: "", phone: "", email: "" });
  setIsAdding(false);
  setSelected(newContact);
  setForm(newContact);
};
const handleSelect = (contact) => {
    setSelected(contact);
    setForm(contact);
    setIsEditing(false);
    setActiveTab("contact");
  };

 const handleDelete = async (id) => {
  await fetch(`http://localhost:8000/api/contacts/${id}/`, { method: "DELETE" });
  setContacts((prev) => prev.filter((c) => c.id !== id));
  setSelected(null);
  setForm(null);
};

  const handleUpdate = async () => {
  if (!form) return;
  await fetch(`http://localhost:8000/api/contacts/${form.id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  setContacts((prev) => prev.map((c) => (c.id === form.id ? form : c)));
  setSelected(form);
  setIsEditing(false);
};
const initials = (name = "") => name.split(" ").map((n) => n[0]).join("");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", background: "#f9fafb", color: "#1a1a2e" }}>

      {/* ===== SIDEBAR ===== */}
    

      {/* ===== CONTACT LIST ===== */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Counter:<span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 18 }}>({contacts.length})</span></h2>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
    onClick={() => { setIsAdding(true); setSelected(null); setForm(null); setNewForm({ name: "", company_name: "", phone: "", email: "" }); }}
    style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
  >
    <Plus size={12} /> Add Contact
  </button>
</div>

          </div>
        {/* Table Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "8px 24px", fontSize: 11, fontWeight: 600, color: "#155d19", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #e5e7eb" }}>
          <span>Name</span>
          <span>Phone</span>
          <span>Email</span>
          <span>Address</span> 
        </div>

        {/* Rows */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map((contact) => (
  <button
  key={contact.id}
  onClick={() => handleSelect(contact)}
  className={`contact-row ${selected?.id === contact.id ? "selected" : ""}`}
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr ",
    alignItems: "center",
    width: "100%",
    padding: "12px 24px",
    border: "none",
    borderBottom: "2px solid #155d19",
    background: selected?.id === contact.id ? "#f0fdf4" : "transparent",
    cursor: "pointer",
    textAlign: "left",
  }}

> {/* box ni andr name varu */}
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ position: "relative" }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 600, color: "#6b7280"
      }}>
        {initials(contact.name)}
      </div>
      {contact.online && (
        <span style={{
          position: "absolute",
          bottom: -1,
          right: -1,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#22c55e",
          border: "2px solid #fff"
        }} />
      )}
    </div>
    <div>
      <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "#111" }}>{contact.name}</p>
      <p style={{ fontSize: 12, margin: 0, color: "#9ca3af" }}>{contact.company_name}</p>
    </div>
  </div>
  <span style={{ fontSize: 14, color: "#374151" }}>{contact.phone}</span>
  <span style={{ fontSize: 14, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.email}</span>
<span style={{ fontSize: 14, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.address}</span>

            
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: 32, fontSize: 14 }}>No contacts found.</p>
          )}
        </div>
      </div>
      {isAdding && (
  <div style={{ width: 300, borderLeft: "1px solid #e5e7eb", background: "#fff", padding: 24, display: "flex", flexDirection: "column", overflowY: "auto" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Add New Contact</h3>
      <button onClick={() => setIsAdding(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
        <X size={20} />
      </button>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <EditField label="Name *" value={newForm.name} onChange={(v) => setNewForm({ ...newForm, name: v })} />
      <EditField label="Company *" value={newForm.company_name} onChange={(v) => setNewForm({ ...newForm, company_name: v })} />
     <EditField label="Phone" value={newForm.phone} onChange={(v) => { if (v.length <= 10) setNewForm({ ...newForm, phone: v }); }} />
      <EditField label="Email *" value={newForm.email} onChange={(v) => setNewForm({ ...newForm, email: v })} />
      <EditField 
  label="Address *" 
  value={newForm.address || ""} 
  onChange={(v) => setNewForm({ ...newForm, address: v })} 
/>
      <button
        onClick={handleAddContact}
        style={{ marginTop: 12, padding: "10px 0", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
      >
        Add Contact
      </button>
    </div>
  </div>
)}

      {/* ===== DETAIL CARD ===== */}
      {selected && form && (
        <div style={{ width: 300, borderLeft: "2px solid #155d19", background: "#fff", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto" }}>
                {/*  Close Button */}
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <button
              onClick={() => { setSelected(null); setForm(null); setIsEditing(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
            >
              <X size={20} />
            </button>
          </div>
          {/* Avatar */}
          <div style={{ position: "relative", marginBottom: 8 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#1cc159", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 600, color: "#ffffff" }}>
              {initials(selected.name)}
            </div>
            {selected.online && <span style={{ position: "absolute", bottom: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: "#22c55e", border: "3px solid #fff" }} />}
          </div>
          {selected.online && <span style={{ fontSize: 12, color: "#22c55e", marginBottom: 4 }}>Online</span>}
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: "4px 0 2px" }}>{selected.name}</h3>
          <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16 }}>{selected.company_name}</p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, border: "1px solid #e5e7eb", borderRadius: 10, padding: 4, marginBottom: 20 }}>
            {["contact", "work", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 16px",
                  fontSize: 13,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  fontWeight: activeTab === tab ? 600 : 400,
                  background: activeTab === tab ? "#dcfce7" : "transparent",
                  color: activeTab === tab ? "#16a34a" : "#7e806bcf",
                  fontFamily: "inherit",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contact Info / Edit Form */}
          {activeTab === "contact" && !isEditing && (
            <div style={{ width: "100%" ,display: "flex", flexDirection: "column", gap: 16}}>
             
              <InfoRow icon={<Phone size={17} />} label="Phone number" value={selected.phone} />
              <InfoRow icon={<Mail size={17} />} label="Email" value={selected.email} />
              
            </div>
          )}

          {activeTab === "contact" && isEditing && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              <EditField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <EditField label="Company_name" value={form.company_name} onChange={(v) => setForm({ ...form, company_name: v })} />
           <EditField label="Phone" value={form.phone} onChange={(v) => { if (v.length <= 10) setForm({ ...form, phone: v }); }} />
              <EditField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
             <EditField label="Address" value={form.address || ""} onChange={(v) => setForm({ ...form, address: v })} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={handleUpdate} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Save</button>
                <button onClick={() => { setForm(selected); setIsEditing(false); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 500, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}

          {activeTab !== "contact" && (
            <p style={{ fontSize: 14, color: "#52aa3e" }}>No {activeTab} information available.</p>
          )}

          {/* Action Buttons */}
          {!isEditing && (
            <div style={{ display: "flex", gap: 8, marginTop: 24, width: "100%" }}>
              <button onClick={() => setIsEditing(true)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => handleDelete(selected.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ===== Sub-components defined in same file ===== */

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
      <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 500, margin: "2px 0 0", color: "#111" }}>{value}</p>
    </div>
    <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", background: "#dcfce7" }}>
      {icon}
    </div>
  </div>
);

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