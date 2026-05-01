import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById, updateEvent } from "../api/api";

const FIELDS = [
  { key: "title",       label: "Event Title",    placeholder: "e.g. Tech Summit 2025",    type: "text"   },
  { key: "description", label: "Description",    placeholder: "What's this event about?", type: "text"   },
  { key: "date",        label: "Date",            placeholder: "",                          type: "date"   },
  { key: "venue",       label: "Venue",           placeholder: "e.g. Convention Center",   type: "text"   },
  { key: "capacity",    label: "Capacity",        placeholder: "e.g. 200",                 type: "number" },
];

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getEventById(id)
      .then((res) => setForm(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.title?.trim()) e.title = "Title is required.";
    if (!form.date) e.date = "Date is required.";
    if (!form.venue?.trim()) e.venue = "Venue is required.";
    return e;
  };

  const handleUpdate = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      await updateEvent(id, form);
      showToast("Event updated successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch {
      showToast("Failed to update event.", "error");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 animate-pulse">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="mb-5">
              <div className="h-3 bg-slate-800 rounded w-1/4 mb-2" />
              <div className="h-11 bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl transition-all ${
          toast.type === "error"
            ? "bg-red-500/10 border border-red-500/30 text-red-400"
            : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
        }`}>
          {toast.type === "success" ? "✓ " : "✕ "}{toast.message}
        </div>
      )}

      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Events
      </Link>

      {/* Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Edit Event</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Editing
            </span>
          </div>
          <p className="text-slate-400 text-sm">Update the event details below.</p>
        </div>

        <div className="flex flex-col gap-5">
          {FIELDS.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                {label}
                {["title", "date", "venue"].includes(key) && (
                  <span className="text-violet-400 ml-1">*</span>
                )}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key] || ""}
                onChange={(e) =>
                  setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })
                }
                className={`w-full bg-slate-800 border ${
                  errors[key] ? "border-red-500/50" : "border-slate-700"
                } rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all [color-scheme:dark]`}
              />
              {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Link
              to="/"
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-center bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all duration-200"
            >
              Cancel
            </Link>
            <button
              onClick={handleUpdate}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-violet-500/20"
            >
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}