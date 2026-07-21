import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useResume } from '../../context/ResumeContext';
import SpecularButton from '../ui/SpecularButton';
import './UploadSection.css';

export default function UploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { updateState } = useResume();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setError(null);
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume first.');
      return;
    }

    try {
      // 1. Save to global state (useful for UI elements that want to show the selected file immediately)
      updateState({
        fileName: file.name,
        fileType: file.type,
        jobRole,
        jobDescription: jobDesc,
        currentStep: 'analysis'
      });
      
      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', jobRole);
      formData.append('targetDescription', jobDesc);

      // 3. Make API Call to backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header manually when sending FormData, the browser sets it automatically with the correct boundary!
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to upload resume');
      }

      const data = await response.json();

      // 4. Navigate to Analysis page with the sessionId
      navigate('/analysis', { state: { sessionId: data.sessionId } });
      
    } catch (err) {
      setError(err.message || 'An error occurred during upload.');
      console.error('Upload Error:', err);
    }
  };

  return (
    <section id="upload" className="upload-section container">
      <div className="upload__header reveal">
        <h2 className="upload__title">Let's see what you're working with.</h2>
        <p className="upload__subtitle">Upload your current resume. We'll extract the data and analyze it against your target role instantly.</p>
      </div>

      <div className="upload__grid">
        {/* Drag & Drop Zone */}
        <div 
          className={`upload__dropzone ${isDragging ? 'upload__dropzone--active' : ''} ${file ? 'upload__dropzone--has-file' : ''} reveal-left`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".pdf" 
            onChange={handleChange}
            style={{ display: 'none' }} 
            aria-label="Upload Resume PDF"
          />
          
          {!file ? (
            <div className="upload__dropzone-content">
              <div className="upload__icon-wrap">
                <Icon icon="ph:upload-simple-bold" width="32" height="32" />
              </div>
              <h3>Drag & drop your resume</h3>
              <p>Supports PDF (Max 5MB)</p>
              <button className="upload__browse-btn">Browse Files</button>
            </div>
          ) : (
            <div className="upload__file-preview">
              <div className="upload__file-icon">
                <Icon icon="ph:file-pdf-fill" width="48" height="48" color="#E74C3C" />
              </div>
              <div className="upload__file-info">
                <h4>{file.name}</h4>
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                className="upload__remove-btn"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
              >
                <Icon icon="ph:trash-bold" width="20" height="20" />
              </button>
            </div>
          )}
          
          {error && <div className="upload__error"><Icon icon="ph:warning-circle-bold" /> {error}</div>}
        </div>

        {/* Job Context Form */}
        <div className="upload__context form-glass reveal-right">
          <div className="upload__context-header">
            <h3>Target Role Context</h3>
            <p>Tell the AI what you're aiming for to get tailored ATS optimization.</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="jobRole">Target Job Title</label>
            <input 
              type="text" 
              id="jobRole"
              placeholder="e.g. Senior Frontend Engineer" 
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobDesc">Job Description (Optional)</label>
            <textarea 
              id="jobDesc"
              placeholder="Paste the job description here for keyword matching..." 
              rows="4"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            ></textarea>
          </div>

          <div className="upload__action">
            <SpecularButton 
              size="lg" 
              className="w-full"
              disabled={!file}
              onClick={handleAnalyze}
            >
              Analyze My Resume
            </SpecularButton>
          </div>
        </div>
      </div>
    </section>
  );
}
