import { createContext, useContext, useState, useCallback } from 'react';

const ResumeContext = createContext(null);

const initialState = {
  /* Upload data */
  rawText: '',
  fileName: '',
  fileType: '',

  /* User inputs */
  jobRole: '',
  jobDescription: '',

  /* Parsed resume sections */
  sections: {
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    customSections: []
  },

  /* Section order for LineSidebar */
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications', 'projects'],

  /* AI analysis results */
  score: null,
  feedback: null,
  recommendations: [],
  suggestedSkills: [],

  /* Template state */
  templateData: null,
  viewingTemplate: false,

  /* Job matches */
  jobMatches: [],
  recruiterMatches: [],
  jobSearchId: null,

  /* Flow state */
  currentStep: 'landing', /* landing | analysis | editor | export */
  isAnalyzing: false,
  isExporting: false,
  buildFromScratch: false
};

export function ResumeProvider({ children }) {
  const [state, setState] = useState(initialState);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSections = useCallback((sectionKey, value) => {
    setState(prev => ({
      ...prev,
      sections: { ...prev.sections, [sectionKey]: value }
    }));
  }, []);

  const reorderSections = useCallback((newOrder) => {
    setState(prev => ({ ...prev, sectionOrder: newOrder }));
  }, []);

  const addSkill = useCallback((skill) => {
    setState(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        skills: [...prev.sections.skills, skill]
      }
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <ResumeContext.Provider value={{
      ...state,
      updateState,
      updateSections,
      reorderSections,
      addSkill,
      resetState
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
