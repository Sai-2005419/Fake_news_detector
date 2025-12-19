
export interface AnalysisResult {
  credibilityScore: number;
  verdict: 'Reliable' | 'Partially Reliable' | 'Unreliable' | 'Likely Fake';
  summary: string;
  biasAnalysis: {
    level: 'Low' | 'Medium' | 'High';
    description: string;
  };
  factualAccuracy: {
    score: number;
    issues: string[];
  };
  clickbaitPotential: {
    score: number;
    description: string;
  };
  keyClaims: {
    claim: string;
    isVerified: boolean;
    explanation: string;
  }[];
  sourcesFound: {
    title: string;
    url: string;
  }[];
}

export interface ScanHistory {
  id: string;
  title: string;
  timestamp: number;
  score: number;
  verdict: string;
}
