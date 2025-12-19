
import React from 'react';
import { AnalysisResult } from '../types';
import Gauge from './Gauge';

interface AnalysisViewProps {
  result: AnalysisResult;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result }) => {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Reliable': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Partially Reliable': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Unreliable': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Likely Fake': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="flex-shrink-0">
            <Gauge score={result.credibilityScore} label="Credibility" size={160} />
          </div>
          <div className="flex-grow space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getVerdictColor(result.verdict)}`}>
                {result.verdict}
              </span>
              <h2 className="text-2xl font-bold text-slate-800">Analysis Summary</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              {result.summary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-scale-balanced text-indigo-500"></i> Bias Analysis
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                result.biasAnalysis.level === 'Low' ? 'bg-emerald-100 text-emerald-700' :
                result.biasAnalysis.level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              }`}>
                {result.biasAnalysis.level} Bias
              </span>
            </div>
            <p className="text-sm text-slate-600">{result.biasAnalysis.description}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-500"></i> Accuracy
            </h4>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `${result.factualAccuracy.score}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600">
              {result.factualAccuracy.issues.length > 0 
                ? `${result.factualAccuracy.issues.length} potential inaccuracies detected.`
                : "No major factual errors found."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-bullhorn text-orange-500"></i> Clickbait Risk
            </h4>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${result.clickbaitPotential.score}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600">{result.clickbaitPotential.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <i className="fa-solid fa-magnifying-glass-chart text-indigo-500"></i> Key Claims Verification
          </h3>
          <div className="space-y-3">
            {result.keyClaims.map((claim, idx) => (
              <div key={idx} className="p-4 border border-slate-100 rounded-lg flex gap-4 bg-white">
                <div className={`flex-shrink-0 mt-1 ${claim.isVerified ? 'text-emerald-500' : 'text-red-500'}`}>
                  <i className={`fa-solid ${claim.isVerified ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                </div>
                <div>
                  <h5 className="font-semibold text-slate-800 text-sm mb-1">{claim.claim}</h5>
                  <p className="text-sm text-slate-500">{claim.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result.sourcesFound.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-indigo-500"></i> Grounding Sources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.sourcesFound.map((source, idx) => (
              <a 
                key={idx}
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <i className="fa-solid fa-globe text-slate-400 group-hover:text-indigo-500"></i>
                  <span className="text-sm font-medium text-slate-700 truncate">{source.title}</span>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-slate-300 text-xs"></i>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
