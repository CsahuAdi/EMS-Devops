import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/edit/:id" element={<EditEvent />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;