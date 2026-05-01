import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../api/api";
import { Link } from "react-router-dom";

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block">
      <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 5.5H13" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4.5 1V3.5M9.5 1V3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block">
      <path d="M7 1C4.79 1 3 2.79 3 5C3 7.83 7 13 7 13C7 13 11 7.83 11 5C11 2.79 9.21 1 7 1Z" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse">
      <div className="h-5 bg-slate-800 rounded w-3/4 mb-3" />
      <div className="h-3 bg-slate-800 rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-800 rounded w-2/3 mb-6" />
      <div className="flex gap-2 mt-auto">
        <div className="h-8 bg-slate-800 rounded-lg flex-1" />
        <div className="h-8 bg-slate-800 rounded-lg flex-1" />
        <div className="h-8 bg-slate-800 rounded-lg w-16" />
      </div>
    </div>
  );
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getEvents()
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e._id !== id));
      showToast("Event deleted successfully.");
    } catch {
      showToast("Failed to delete event.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl transition-all duration-300 ${
            toast.type === "error"
              ? "bg-red-500/10 border border-red-500/30 text-red-400"
              : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
          }`}
        >
          {toast.type === "success" ? "✓ " : "✕ "}{toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Upcoming Events</h1>
        <p className="text-slate-400 mt-1.5 text-sm">Browse and manage all your events in one place.</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="3" y="5" width="22" height="20" rx="3" stroke="#64748b" strokeWidth="1.8"/>
              <path d="M3 10H25" stroke="#64748b" strokeWidth="1.8"/>
              <path d="M9 3V7M19 3V7" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-slate-300 font-semibold text-lg">No events yet</p>
          <p className="text-slate-500 text-sm mt-1 mb-6">Create your first event to get started.</p>
          <Link
            to="/create"
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all duration-200"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((e, i) => (
            <div
              key={e._id}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-black/30"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Badge + Title */}
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3">
                  Event
                </span>
                <h3 className="text-white font-semibold text-lg leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors duration-200">
                  {e.title}
                </h3>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-2 text-slate-400 text-sm">
                <span className="flex items-center gap-2">
                  <CalendarIcon />
                  {formatDate(e.date)}
                </span>
                <span className="flex items-center gap-2">
                  <LocationIcon />
                  {e.venue || "—"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-2 border-t border-slate-800">
                <Link
                  to={`/event/${e._id}`}
                  className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-violet-600 hover:text-white transition-all duration-200"
                >
                  View
                </Link>
                <Link
                  to={`/edit/${e._id}`}
                  className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(e._id)}
                  disabled={deletingId === e._id}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition-all duration-200 disabled:opacity-40"
                >
                  {deletingId === e._id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}