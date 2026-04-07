import { useState } from "react";
import { useContacts } from "../context/ContactsContext";
import { QRCodeSVG } from "qrcode.react";
import { UserPlus, X } from "lucide-react";

// ✅ removed useNavigate — no BrowserRouter needed here anymore
export default function QRPage({ onGoToContacts }) {
  const { contacts } = useContacts();
  const [selected, setSelected] = useState(null);

  if (contacts.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", color: "#9ca3af" }}>
        <UserPlus size={64} style={{ marginBottom: 16, opacity: 0.2 }} />
        <p style={{ fontSize: 18, fontWeight: 600 }}>No contacts yet</p>
        {/* ✅ uses prop instead of navigate("/") */}
        <button onClick={onGoToContacts} style={{ padding: "8px 20px", borderRadius: 8, background: "#28aa4f", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>
          Add Contact
        </button>
      </div>
    );
  }

  const qrData = selected ? `BEGIN:VCARD
VERSION:3.0
FN:${selected.name || ""}
ORG:${selected.company_name || ""}
TEL:${selected.phone || ""}
EMAIL:${selected.email || ""}
ADR:;;${selected.address || ""};;;;
END:VCARD` : "";

  return (
    <div style={{ padding: 32, background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, color: "#1e293b" }}>QR Codes</h2>

      {/* ── CENTERED CONTACT LIST ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420, margin: "0 auto" }}>
        {contacts.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 18px", borderRadius: 12,
              border: "1.5px solid #e2e8f0", background: "#fff",
              cursor: "pointer", fontSize: 15, textAlign: "left",
              transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.05)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(34,197,94,.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.05)"; }}
          >
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
              {c.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>{c.name}</p>
              {c.company_name && <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>{c.company_name}</p>}
            </div>
          </button>
        ))}
      </div>

      {/* ── BLUR OVERLAY + QR MODAL ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,.4)",
            backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 20, padding: "36px 40px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
              boxShadow: "0 24px 64px rgba(0,0,0,.22)", position: "relative", minWidth: 300,
            }}
          >
            <button onClick={() => setSelected(null)}
              style={{ position: "absolute", top: 14, right: 14, background: "#f3f4f6", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>
              <X size={16} />
            </button>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 700 }}>
              {selected.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, fontSize: 18, color: "#1e293b", margin: "0 0 4px" }}>{selected.name}</p>
              {selected.company_name && <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{selected.company_name}</p>}
            </div>
            <div style={{ height: 1, width: "100%", background: "#e2e8f0" }} />
            <div style={{ padding: 12, border: "2px solid #dcfce7", borderRadius: 14 }}>
              <QRCodeSVG value={qrData} size={200} bgColor="#ffffff" fgColor="#1e293b" level="M" />
            </div>
            <span style={{ fontSize: 12, color: "#94a3b8", letterSpacing: "0.1em" }}>SCAN ME</span>
          </div>
        </div>
      )}
    </div>
  );
}