import React, { useState, useEffect } from 'react';
import { HelpCircle, PlusCircle, Award, ShieldCheck, Search, Send, ThumbsUp, Sparkles, Tag, Check } from 'lucide-react';

const CATEGORIES = [
  "General",
  "Account Security",
  "Billing",
  "Technical Support",
  "Community Policies"
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('faq');
  const [isConnected, setIsConnected] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  
  // Submit state
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newUserId, setNewUserId] = useState('');

  // Fetch data
  useEffect(() => {
    fetchFaqs();
    fetchQuestions();
  }, [search]);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/faq?search=${search}`);
      const data = await res.json();
      setFaqs(data);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/questions');
      const data = await res.json();
      setQuestions(data);
    } catch {}
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion) return;
    try {
      const res = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_text: newQuestion,
          category: newCategory,
          user_id: newUserId || 'user_anon'
        })
      });
      if (res.ok) {
        setNewQuestion('');
        fetchQuestions();
        setCurrentTab('vote');
      }
    } catch {}
  };

  const handleUpvote = async (cid) => {
    try {
      const res = await fetch('http://localhost:5000/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cluster_id: cid,
          user_id: `user_${Math.floor(Math.random() * 10000)}`
        })
      });
      if (res.ok) {
        fetchQuestions();
      }
    } catch {}
  };

  return (
    <div className="text-gray-100 min-h-screen font-inter flex flex-col antialiased bg-[#0b0f19]">
      {/* Header */}
      <header class="w-full bg-[#111827]/70 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-2.5 rounded-xl shadow-lg">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-outfit text-white">CrowdFAQ</h1>
            <p class="text-xs text-gray-400">Crowd-Sourced FAQ Generation</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-white/5 text-xs text-gray-400">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`}></span>
          <span>{isConnected ? 'API Active' : 'API Offline'}</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/5 overflow-x-auto shrink-0">
          <button onClick={() => setCurrentTab('submit')} className={`px-6 py-3 text-sm font-semibold border-b-2 flex items-center gap-2.5 ${currentTab === 'submit' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <PlusCircle className="w-4.5 h-4.5" /> Submit Question
          </button>
          <button onClick={() => setCurrentTab('vote')} className={`px-6 py-3 text-sm font-semibold border-b-2 flex items-center gap-2.5 ${currentTab === 'vote' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <Award className="w-4.5 h-4.5" /> Voting Queue
          </button>
          <button onClick={() => setCurrentTab('faq')} className={`px-6 py-3 text-sm font-semibold border-b-2 flex items-center gap-2.5 ${currentTab === 'faq' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <Search className="w-4.5 h-4.5" /> Public FAQ Base
          </button>
        </div>

        {/* Tab Submissions */}
        {currentTab === 'submit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#111827]/70 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-white font-outfit">Ask the Community</h2>
                <p className="text-sm text-gray-400">Have a question? Put it in. If it is already asked, we will automatically group it to avoid clutter.</p>
              </div>

              <form onSubmit={handleSubSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">User Identification</label>
                  <input type="text" value={newUserId} onChange={e => setNewUserId(e.target.value)} placeholder="e.g. user_9824" className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-600" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Category Tag</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white">
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Question Content</label>
                  <textarea rows="4" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} required placeholder="Type your detailed question here..." className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-gray-600"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Submit to Pipeline
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab Voting Queue */}
        {currentTab === 'vote' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map(q => (
              <div key={q.id} className="bg-[#111827]/70 backdrop-blur-md rounded-xl p-5 border border-white/5 hover:border-blue-500/30 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full text-xs font-semibold uppercase">{q.category}</span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Tag className="w-3.5 h-3.5 text-blue-500" />
                      Score: <strong className="text-blue-500">{q.priority_score.toFixed(2)}</strong>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">{q.representative_question}</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-xs text-gray-500">Votes: {q.upvotes}</span>
                  <button onClick={() => handleUpvote(q.id)} className="flex items-center gap-1.5 text-xs bg-gray-900 border border-white/10 hover:border-blue-500 text-gray-300 px-3 py-1.5 rounded-lg">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-500" /> Upvote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Published FAQs */}
        {currentTab === 'faq' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white font-outfit">Published Knowledge Base</h2>
                <p className="text-sm text-gray-400">Search and navigate through community-curated, verified FAQs.</p>
              </div>
              <div className="relative w-full md:max-w-md">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search keywords..." className="w-full bg-[#111827]/80 border border-white/10 rounded-xl pl-4 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map(f => (
                <div key={f.faq_id} className="bg-[#111827]/70 backdrop-blur-md rounded-xl p-5 border border-white/5 flex flex-col gap-3">
                  <span className="bg-blue-500/10 text-blue-500 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase w-fit">{f.category}</span>
                  <h4 className="text-md font-bold text-white flex items-center gap-2">{f.question}</h4>
                  <p className="text-sm text-gray-400 bg-gray-900/40 p-3.5 rounded-xl border border-white/5 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="w-full text-center py-6 border-t border-white/5 text-xs text-gray-500 mt-auto">
        <p>&copy; 2026 CrowdFAQ. Scaffolded for Ganeshprabu BO (Team Lead).</p>
      </footer>
    </div>
  );
}
