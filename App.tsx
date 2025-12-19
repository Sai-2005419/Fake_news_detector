
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeNews } from './geminiService';
import { AnalysisResult, ScanHistory } from './types';
import AnalysisView from './components/AnalysisView';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('veritas_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim() || inputText.length < 50) {
      setError("Please provide a longer text sample (at least 50 characters) for accurate analysis.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const data = await analyzeNews(inputText);
      setResult(data);
      
      const newHistoryItem: ScanHistory = {
        id: Date.now().toString(),
        title: inputText.substring(0, 60) + '...',
        timestamp: Date.now(),
        score: data.credibilityScore,
        verdict: data.verdict
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('veritas_history', JSON.stringify(updatedHistory));
    } catch (err: any) {
      console.error(err);
      setError("Failed to analyze content. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('veritas_history');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-shield-halved text-white text-lg"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Veritas <span className="text-indigo-600">AI</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Safety Guidelines</a>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all"
            >
              New Scan
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Input and Results */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyze News Content</h2>
                <p className="text-slate-500">Paste an article, text snippet, or claim to evaluate its credibility.</p>
              </div>

              <div className="relative mb-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste article text here... (e.g., 'A new study claims that drinking 10 cups of coffee daily...')"
                  className="w-full h-64 p-5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none resize-none text-slate-700 leading-relaxed"
                ></textarea>
                <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium">
                  {inputText.length} characters
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-3">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3 ${
                  isAnalyzing || !inputText.trim() 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-[0.98]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with Gemini 3 Pro...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    Start Deep Analysis
                  </>
                )}
              </button>
            </section>

            {isAnalyzing && (
              <div className="p-12 text-center space-y-4 animate-pulse">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-microscope text-3xl text-indigo-500"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-700">Checking claims and sources...</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Gemini is searching the web to verify facts and analyze linguistic bias patterns.</p>
              </div>
            )}

            {result && <AnalysisView result={result} />}
          </div>

          {/* Right Column: History and Stats */}
          <div className="space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left text-slate-400"></i> Recent Scans
                </h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fa-solid fa-inbox text-slate-300"></i>
                  </div>
                  <p className="text-sm text-slate-400">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 mt-1.5 h-2 rounded-full flex-shrink-0 ${
                          item.score >= 80 ? 'bg-emerald-500' : 
                          item.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}></div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400">{item.verdict}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Did you know?</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                  Fake news spreads 6x faster than true news on social media. Always verify multiple sources before sharing.
                </p>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <i className="fa-solid fa-lightbulb text-amber-300"></i>
                  <p className="text-xs font-medium">Check for provocative language and missing author details.</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 text-8xl">
                <i className="fa-solid fa-shield-check"></i>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Trust Indicators</h3>
              <div className="space-y-4">
                {[
                  { label: 'Neutral Language', icon: 'fa-language', color: 'bg-blue-100 text-blue-600' },
                  { label: 'Source Citation', icon: 'fa-quote-left', color: 'bg-emerald-100 text-emerald-600' },
                  { label: 'No Emotional Triggers', icon: 'fa-face-smile', color: 'bg-purple-100 text-purple-600' }
                ].map((indicator, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${indicator.color}`}>
                      <i className={`fa-solid ${indicator.icon} text-sm`}></i>
                    </div>
                    <span className="text-sm font-medium text-slate-600">{indicator.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-slate-400 text-sm">
            Powered by Google Gemini 3 Pro & Search Grounding.
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Veritas AI analysis is for informational purposes only and should not be used as the sole basis for critical decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
