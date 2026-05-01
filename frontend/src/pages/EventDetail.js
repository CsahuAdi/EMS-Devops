import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById, registerUser } from "../api/api";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getEventById(id)
      .then((res) => setEvent(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
    return e;
  };

  const handleRegister = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      await registerUser({ eventId: id, name, email });
      showToast("You're registered! See you there.");
      setName("");
      setEmail("");
    } catch {
      showToast("Registration failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-1/2 mb-4" />
        <div className="h-4 bg-slate-800 rounded w-full mb-2" />
        <div className="h-4 bg-slate-800 rounded w-3/4" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-400">Event not found.</p>
        <Link to="/" className="mt-4 inline-block text-violet-400 hover:underline text-sm">← Back to events</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

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

      {/* Event Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4">
          Event
        </span>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-4">{event.title}</h1>

        {event.description && (
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{event.description}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Date</p>
            <p className="text-white text-sm font-medium">{formatDate(event.date)}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Venue</p>
            <p className="text-white text-sm font-medium">{event.venue || "—"}</p>
          </div>
          {event.capacity && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Capacity</p>
              <p className="text-white text-sm font-medium">{event.capacity} seats</p>
            </div>
          )}
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-1">Register for this event</h2>
        <p className="text-slate-500 text-sm mb-6">Fill in your details to secure your spot.</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-slate-800 border ${errors.name ? "border-red-500/50" : "border-slate-700"} rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-slate-800 border ${errors.email ? "border-red-500/50" : "border-slate-700"} rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <button
            onClick={handleRegister}
            disabled={submitting}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-violet-500/20 mt-1"
          >
            {submitting ? "Registering…" : "Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
}