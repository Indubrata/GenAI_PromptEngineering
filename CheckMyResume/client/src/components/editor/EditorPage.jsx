import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import SpecularButton from '../ui/SpecularButton';
import LineSidebar from '../ui/LineSidebar';
import './EditorPage.css';

const DEFAULT_SECTIONS = ['Contact Info', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'];

// Map active section to AI suggestions
const AI_SUGGESTIONS = {
  'contact info': [
    { text: 'Add a professional LinkedIn profile link', points: 5, field: 'linkedin', value: 'linkedin.com/in/yourprofile' },
    { text: 'Add a link to your portfolio or GitHub', points: 3, field: 'portfolio', value: 'github.com/yourusername' }
  ],
  'summary': [
    { text: 'Start with a strong action verb (e.g., "Spearheaded", "Architected")', points: 3, append: 'Spearheaded ' },
    { text: 'Include a quantifiable achievement in your summary', points: 4, append: ' delivering 20% growth ' }
  ],
  'experience': [
    { text: '"Led a team" → "Spearheaded a cross-functional team of 10"', points: 4, append: 'Spearheaded a cross-functional team of 10' },
    { text: '"Fixed bugs" → "Resolved critical production bugs reducing downtime by 15%"', points: 5, append: 'Resolved critical production bugs reducing downtime by 15%' }
  ],
  'education': [
    { text: 'Include your GPA if it is above 3.5', points: 2, append: 'GPA: 3.8' },
    { text: 'Add relevant coursework to highlight specific knowledge', points: 3, append: 'Relevant Coursework: Data Structures, Algorithms' }
  ],
  'skills': [
    { text: 'Add highly sought-after skill: React.js', points: 2, append: 'React.js' },
    { text: 'Add highly sought-after skill: Node.js', points: 2, append: 'Node.js' }
  ],
  'projects': [
    { text: 'Include technologies used for each project', points: 4, append: 'Technologies: React, Node, MongoDB' },
    { text: 'Add a link to the live project or repository', points: 3, append: 'Link: github.com/repo' }
  ]
};

export default function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Starting score: 0 for scratch, or the analyzed score if uploaded
  const baseScore = location.state?.score !== undefined ? location.state.score : 0;
  const [addedBonus, setAddedBonus] = useState(0);
  const [usedSuggestions, setUsedSuggestions] = useState({});
  const [validationError, setValidationError] = useState('');

  const currentScore = Math.min(100, baseScore + addedBonus);

  // Initialize resumeData safely, defaulting to empty arrays/objects
  const initialData = location.state?.resumeData || {};
  const [resumeData, setResumeData] = useState({
    summary: initialData.summary || '',
    experience: initialData.experience || [],
    education: initialData.education || [],
    skills: initialData.skills || [],
    contact: initialData.contact || {},
    projects: initialData.projects || []
  });

  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [activeIndex, setActiveIndex] = useState(0); // Default to Contact Info (index 0)
  const activeSection = sections[activeIndex]?.toLowerCase() || '';

  const handleUpdate = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleContactUpdate = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
    // Clear validation error once contact info is typed
    if (validationError) setValidationError('');
  };

  const handleAddSuggestion = (suggestion, sKey) => {
    if (usedSuggestions[sKey]) return; // Avoid adding duplicate points

    if (activeSection === 'contact info') {
      handleContactUpdate(suggestion.field, suggestion.value);
    } else if (activeSection === 'summary') {
      handleUpdate('summary', resumeData.summary + suggestion.append);
    } else if (activeSection === 'skills') {
      const currentSkills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
      handleUpdate('skills', [...currentSkills, suggestion.append]);
    } else if (activeSection === 'experience') {
       const newExp = [...resumeData.experience];
       if (newExp.length > 0) {
         if (!newExp[0].description) newExp[0].description = [];
         newExp[0].description.push(suggestion.append);
       } else {
         newExp.push({ role: '', company: '', description: [suggestion.append] });
       }
       handleUpdate('experience', newExp);
    } else if (activeSection === 'education') {
      const newEdu = [...resumeData.education];
      if (newEdu.length > 0) {
         if (!newEdu[0].details) newEdu[0].details = [];
         newEdu[0].details.push(suggestion.append);
      } else {
         newEdu.push({ degree: '', institution: '', year: '', details: [suggestion.append] });
      }
      handleUpdate('education', newEdu);
    } else if (activeSection === 'projects') {
      const newProj = [...resumeData.projects];
      if (newProj.length > 0) {
         if (!newProj[0].description) newProj[0].description = [];
         newProj[0].description.push(suggestion.append);
       } else {
         newProj.push({ name: '', link: '', description: [suggestion.append] });
       }
       handleUpdate('projects', newProj);
    }

    // Add points to real-time ATS score
    setAddedBonus(prev => prev + (suggestion.points || 0));
    setUsedSuggestions(prev => ({ ...prev, [sKey]: true }));
  };

  // Validation: Must enter at least Full Name and an Email or Phone number
  const handleReviewAndExport = () => {
    const name = resumeData.contact?.name?.trim();
    const email = resumeData.contact?.email?.trim();
    const phone = resumeData.contact?.phone?.trim();

    if (!name || (!email && !phone)) {
      setValidationError('Please enter at least your Full Name and Email or Phone in Contact Info before export.');
      setActiveIndex(0); // Switch to Contact Info tab
      return;
    }

    setValidationError('');
    navigate('/export', { state: { resumeData } });
  };

  return (
    <div className="editor-page">
      {/* Column 1: Navigation Sidebar */}
      <div className="editor-page__nav">
        <LineSidebar 
          items={sections}
          activeIndex={activeIndex}
          onItemClick={(idx) => setActiveIndex(idx)}
        />
        <button 
          className="sidebar__add-btn" 
          style={{ marginTop: '20px', background: 'transparent', border: '1px dashed #6c6c6c', color: '#c4c4c4', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }} 
          onClick={() => {
            const newSection = prompt('Enter new section name:');
            if (newSection && newSection.trim() !== '') {
              setSections(prev => [...prev, newSection]);
              setActiveIndex(sections.length);
            }
          }}
        >
          <Icon icon="ph:plus-bold" />
          <span>Add Section</span>
        </button>
      </div>
      
      {/* Column 2: Main Editor Canvas */}
      <main className="editor-page__canvas">
        <header className="editor-page__header">
          <h2>Editing: {sections[activeIndex]}</h2>
        </header>

        {validationError && (
          <div className="editor-contact-error">
            <Icon icon="ph:warning-circle-bold" width="20" />
            <span>{validationError}</span>
          </div>
        )}
        
        <div className="editor-page__content">
          {!['contact info', 'summary', 'experience', 'education', 'skills', 'projects'].includes(activeSection) && (
            <textarea 
              className="editor-input editor-input--large"
              value={resumeData[activeSection] || ''}
              onChange={(e) => handleUpdate(activeSection, e.target.value)}
              placeholder={`Write your ${sections[activeIndex]} details here...`}
            />
          )}
          {activeSection === 'contact info' && (
            <div className="editor-form">
              <label className="editor-label">Full Name *</label>
              <input 
                className={`editor-input ${!resumeData.contact?.name?.trim() && validationError ? 'editor-input--error' : ''}`}
                value={resumeData.contact?.name || ''}
                onChange={(e) => handleContactUpdate('name', e.target.value)}
                placeholder="Full Name (Required)"
              />
              <label className="editor-label">Email Address *</label>
              <input 
                className={`editor-input ${!resumeData.contact?.email?.trim() && validationError ? 'editor-input--error' : ''}`}
                value={resumeData.contact?.email || ''}
                onChange={(e) => handleContactUpdate('email', e.target.value)}
                placeholder="Email Address"
              />
              <label className="editor-label">Phone Number</label>
              <input 
                className="editor-input"
                value={resumeData.contact?.phone || ''}
                onChange={(e) => handleContactUpdate('phone', e.target.value)}
                placeholder="Phone Number"
              />
              <label className="editor-label">LinkedIn URL</label>
              <input 
                className="editor-input"
                value={resumeData.contact?.linkedin || ''}
                onChange={(e) => handleContactUpdate('linkedin', e.target.value)}
                placeholder="LinkedIn URL"
              />
              <label className="editor-label">Portfolio / GitHub URL</label>
              <input 
                className="editor-input"
                value={resumeData.contact?.portfolio || ''}
                onChange={(e) => handleContactUpdate('portfolio', e.target.value)}
                placeholder="Portfolio / GitHub URL"
              />
            </div>
          )}

          {activeSection === 'summary' && (
            <textarea 
              className="editor-input editor-input--large"
              value={resumeData.summary}
              onChange={(e) => handleUpdate('summary', e.target.value)}
              placeholder="Write a professional summary..."
            />
          )}

          {activeSection === 'experience' && (
            <div className="editor-list">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="editor-card">
                  <input 
                    className="editor-input"
                    value={exp.role || ''} 
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[idx].role = e.target.value;
                      handleUpdate('experience', newExp);
                    }}
                    placeholder="Job Title"
                  />
                  <input 
                    className="editor-input"
                    value={exp.company || ''} 
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[idx].company = e.target.value;
                      handleUpdate('experience', newExp);
                    }}
                    placeholder="Company"
                  />
                  <textarea 
                    className="editor-input editor-input--medium"
                    value={exp.description ? exp.description.join('\n') : ''}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[idx].description = e.target.value.split('\n');
                      handleUpdate('experience', newExp);
                    }}
                    placeholder="Bullet points (one per line)"
                  />
                </div>
              ))}
              <button 
                className="btn-secondary"
                onClick={() => handleUpdate('experience', [...resumeData.experience, { role: '', company: '', description: [] }])}
              >
                + Add Experience
              </button>
            </div>
          )}

          {activeSection === 'education' && (
            <div className="editor-list">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="editor-card">
                  <input 
                    className="editor-input"
                    value={edu.degree || ''} 
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[idx].degree = e.target.value;
                      handleUpdate('education', newEdu);
                    }}
                    placeholder="Degree / Certificate"
                  />
                  <input 
                    className="editor-input"
                    value={edu.institution || ''} 
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[idx].institution = e.target.value;
                      handleUpdate('education', newEdu);
                    }}
                    placeholder="Institution"
                  />
                  <input 
                    className="editor-input"
                    value={edu.year || ''} 
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[idx].year = e.target.value;
                      handleUpdate('education', newEdu);
                    }}
                    placeholder="Year (e.g. 2020 - 2024)"
                  />
                  <textarea 
                    className="editor-input editor-input--small"
                    value={edu.details ? edu.details.join('\n') : ''}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[idx].details = e.target.value.split('\n');
                      handleUpdate('education', newEdu);
                    }}
                    placeholder="Details (e.g. GPA, Coursework - one per line)"
                  />
                </div>
              ))}
              <button 
                className="btn-secondary"
                onClick={() => handleUpdate('education', [...resumeData.education, { degree: '', institution: '', year: '', details: [] }])}
              >
                + Add Education
              </button>
            </div>
          )}

          {activeSection === 'skills' && (
            <textarea 
              className="editor-input editor-input--large"
              value={Array.isArray(resumeData.skills) ? resumeData.skills.join(', ') : ''}
              onChange={(e) => handleUpdate('skills', e.target.value.split(',').map(s => s.trim()))}
              placeholder="Skills (comma separated)"
            />
          )}

          {activeSection === 'projects' && (
            <div className="editor-list">
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="editor-card">
                  <input 
                    className="editor-input"
                    value={proj.name || ''} 
                    onChange={(e) => {
                      const newProj = [...resumeData.projects];
                      newProj[idx].name = e.target.value;
                      handleUpdate('projects', newProj);
                    }}
                    placeholder="Project Name"
                  />
                  <input 
                    className="editor-input"
                    value={proj.link || ''} 
                    onChange={(e) => {
                      const newProj = [...resumeData.projects];
                      newProj[idx].link = e.target.value;
                      handleUpdate('projects', newProj);
                    }}
                    placeholder="Project Link"
                  />
                  <textarea 
                    className="editor-input editor-input--medium"
                    value={proj.description ? proj.description.join('\n') : ''}
                    onChange={(e) => {
                      const newProj = [...resumeData.projects];
                      newProj[idx].description = e.target.value.split('\n');
                      handleUpdate('projects', newProj);
                    }}
                    placeholder="Description (one per line)"
                  />
                </div>
              ))}
              <button 
                className="btn-secondary"
                onClick={() => handleUpdate('projects', [...resumeData.projects, { name: '', link: '', description: [] }])}
              >
                + Add Project
              </button>
            </div>
          )}

        </div>
      </main>
      
      {/* Column 3: Tools Sidebar (AI Assistant / Score Meter) */}
      <aside className="editor-page__tools">
        <div className="editor-tool-card">
          <h3>Real-time ATS Score</h3>
          <div className="mini-score">
             <span className="mini-score__val">{currentScore}</span>/100
          </div>
          <p>Optimize your {activeSection} to gain more points.</p>
        </div>
        
        <div className="editor-tool-card">
          <h3>AI Suggestions for {sections[activeIndex]}</h3>
          <ul className="ai-suggestions">
            {AI_SUGGESTIONS[activeSection]?.map((suggestion, idx) => {
              const sKey = `${activeSection}-${idx}`;
              const isUsed = !!usedSuggestions[sKey];
              return (
                <li key={idx} className="ai-suggestion-item">
                  <div className="ai-suggestion-text">
                    <span>{suggestion.text}</span>
                    <span className="ai-suggestion-points">+{suggestion.points} pts</span>
                  </div>
                  <button 
                    className={`btn-add-suggestion ${isUsed ? 'btn-add-suggestion--used' : ''}`}
                    onClick={() => handleAddSuggestion(suggestion, sKey)}
                    disabled={isUsed}
                  >
                    <Icon icon={isUsed ? "ph:check-bold" : "ph:plus-bold"} /> {isUsed ? 'Added' : 'Add'}
                  </button>
                </li>
              );
            }) || <li>No specific suggestions for this section yet.</li>}
          </ul>
        </div>

        {/* Review & Export Button */}
        <div className="editor-page__export-action" style={{ marginTop: '20px' }}>
          <SpecularButton onClick={handleReviewAndExport}>
            Review & Export
          </SpecularButton>
        </div>
      </aside>
    </div>
  );
}
