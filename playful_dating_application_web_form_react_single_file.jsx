import React, { useState, useMemo } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState([]);
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [extra, setExtra] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjkendbg";

  function toggleLang(v) {
    setQ3(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }

  const answeredCount = useMemo(() => {
    let count = 0;
    if (name.trim()) count++;
    if (status.trim()) count++;
    if (q1.trim()) count++;
    if (q2.trim()) count++;
    if (q3.length > 0) count++;
    if (q4.trim()) count++;
    if (q5.trim()) count++;
    return count;
  }, [name, status, q1, q2, q3, q4, q5]);

  const totalQuestions = 7;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const summary = `Applicant: ${name}\nStatus: ${status}\n1) Relationship goals: ${q1}\n2) Ideal weekend vibe: ${q2}\n3) Love languages: ${q3.join(", ")}\n4) Biggest dealbreaker: ${q4}\n5) 2–3 year vision: ${q5}\nExtra notes: ${extra}`;

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes("yourFormIdHere")) {
      setSubmitted(true);
      return;
    }
    try {
      setSending(true);
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: "New Touchdown Application 🏈",
          applicant_name: name,
          status,
          relationship_goals: q1,
          weekend_vibe: q2,
          love_languages: q3.join(", "),
          dealbreaker: q4,
          future_vision: q5,
          extra,
          summary,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Couldn't send email. Check your Formspree link and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative bg-green-700 overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="relative w-full border-t border-white/30 flex justify-start">
            <span className="absolute left-2 -top-3 text-white text-[10px] sm:text-xs font-bold">{i * 10}</span>
            <span className="absolute right-2 -top-3 text-white text-[10px] sm:text-xs font-bold">{i * 10}</span>
          </div>
        ))}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-10 sm:h-12 bg-red-700 flex items-center justify-center text-white font-extrabold text-sm sm:text-lg tracking-widest transition-all ${submitted ? "animate-pulse" : ""}`}>
        GOAL
      </div>

      <div className="w-full max-w-lg sm:max-w-2xl bg-white border border-red-700 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-neutral-900 relative z-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-red-700 font-mono">Touchdown Application 🏈💘</h1>
        <p className="text-xs sm:text-sm text-neutral-600 mb-4 font-mono">Step onto the field: drop your name and answer quick plays to win big points.</p>

        {!submitted && (
          <div className="w-full bg-neutral-200 rounded-lg h-10 sm:h-12 mb-4 sm:mb-6 border border-red-600 flex items-center justify-between px-2 sm:px-4 font-mono text-xs sm:text-sm">
            <span className="text-red-700 font-bold">SCOREBOARD</span>
            <div className="flex-1 mx-2 sm:mx-3 h-2 sm:h-3 bg-neutral-300 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-red-700 font-bold">{progress}%</span>
          </div>
        )}

        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</div>
        )}

        {submitted ? (
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-bold mb-3 font-mono">Is there anything else you would like to add?</h2>
            <textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              rows="4"
              placeholder="Write your extra thoughts here..."
              className="w-full rounded-xl border border-red-600 px-3 py-2 bg-white text-neutral-900 text-sm mb-4"
            ></textarea>
            <p className="text-sm text-neutral-700 mb-4">Your answer will be reviewed and you will receive a response in 5–7 business days.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6 font-mono">
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Your name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full rounded-xl border border-red-600 px-3 py-2 bg-white text-neutral-900 text-sm" required />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Are you in a relationship or a free agent?</label>
              <div className="flex flex-wrap gap-2">
                {["Free Agent", "In a Relationship"].map((opt) => (
                  <button key={opt} type="button" onClick={() => setStatus(opt)} className={`px-2 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm ${status === opt ? "bg-red-600 text-white border-red-600" : "bg-white border-red-500 text-red-700"}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">1) Game plan (relationship goals)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Serious relationship","Casual fun","Let’s see where it goes","Friends first","Open to open"].map((opt) => (
                  <button key={opt} type="button" onClick={() => setQ1(opt)} className={`px-2 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm ${q1 === opt ? "bg-red-600 text-white border-red-600" : "bg-white border-red-500 text-red-700"}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">2) Weekend playbook</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Outdoors & brunch","Gym + grocery + cuddle","Netflix & chill (for real)","City adventures","Game night & takeout"].map((opt) => (
                  <button key={opt} type="button" onClick={() => setQ2(opt)} className={`px-2 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm ${q2 === opt ? "bg-red-600 text-white border-red-600" : "bg-white border-red-500 text-red-700"}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">3) Love languages (your favorite plays)</label>
              <div className="flex flex-wrap gap-2">
                {["Words of affirmation","Quality time","Acts of service","Gifts","Physical touch"].map((opt) => (
                  <button key={opt} type="button" onClick={() => toggleLang(opt)} className={`px-2 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm ${q3.includes(opt) ? "bg-red-600 text-white border-red-600" : "bg-white border-red-500 text-red-700"}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">4) Biggest flag on the play (dealbreaker)</label>
              <textarea value={q4} onChange={(e) => setQ4(e.target.value)} placeholder="Example: poor communication, dishonesty, inconsistent effort, etc." rows="3" className="w-full rounded-xl border border-red-600 px-3 py-2 bg-white text-neutral-900 text-sm"></textarea>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">5) Future season (2–3 year vision)</label>
              <textarea value={q5} onChange={(e) => setQ5(e.target.value)} rows="4" placeholder="Tell me about your goals, lifestyle, and what partnership looks like to you." className="w-full rounded-xl border border-red-600 px-3 py-2 bg-white text-neutral-900 text-sm"></textarea>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={sending} className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-white font-bold tracking-wide text-sm ${sending ? "bg-red-400" : "bg-red-600 hover:bg-red-700 animate-bounce"}`}>{sending ? "Sending…" : "Enter NOW 🏈"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
