import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useResume } from '../../context/ResumeContext';
import SpecularButton from '../ui/SpecularButton';
import './UploadSection.css';

// ─── Upload pipeline steps ──────────────────────────────────────────────────
const STEPS = [
  { id: 'upload',   label: 'Uploading resume',           icon: 'ph:upload-simple-bold' },
  { id: 'parsing',  label: 'Extracting text from PDF',   icon: 'ph:file-search-bold' },
  { id: 'analyzing', label: 'AI analysing your resume',  icon: 'ph:brain-bold' },
  { id: 'done',     label: 'Done!',                       icon: 'ph:check-circle-bold' },
];

function getStepIndex(stepId) {
  return STEPS.findIndex((s) => s.id === stepId);
}

export default function UploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [error, setError] = useState(null);

  // ── Progress state ────────────────────────────────────────────────────────
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);      // 0-100, HTTP upload progress
  const [activeStep, setActiveStep] = useState(null); // one of STEPS[].id or null

  const fileInputRef = useRef(null);
  const requestRef = useRef(null);
  const timerRef = useRef(null);
  const { updateState } = useResume();
  const navigate = useNavigate();

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      requestRef.current?.abort();
      clearTimeout(timerRef.current);
    };
  }, []);

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
    setFile(null);
    if (!/\.pdf$/i.test(selectedFile.name) || (selectedFile.type && !['application/pdf', 'application/octet-stream'].includes(selectedFile.type))) {
      setError('Please upload a PDF file.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const handleAnalyze = () => {
    if (isUploading) return;
    if (!file) {
      setError('Please upload a resume first.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadPct(0);
    setActiveStep('upload');

    // 1. Save to global state
    updateState({
      fileName: file.name,
      fileType: file.type,
      jobRole,
      jobDescription: jobDesc,
      currentStep: 'analysis'
    });

    // 2. Build FormData
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', jobRole);
    formData.append('targetDescription', jobDesc);

    // 3. Use XHR so we get real upload progress
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const xhr = new XMLHttpRequest();
    requestRef.current = xhr;
    xhr.timeout = 120000; // allow for a cold-starting host (e.g. Render free tier)

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        setUploadPct(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        let msg = 'Upload failed. Please try again.';
        try {
          const body = JSON.parse(xhr.responseText);
          if (body.error) {
            // Translate common server errors into plain English
            if (body.error.includes('Only PDF')) msg = 'Only PDF files are accepted. Please choose a .pdf file.';
            else if (xhr.status === 413) msg = 'Your file is too large. Please keep it under 5 MB.';
            else msg = body.error;
          }
        } catch { /* use default msg */ }
        setError(msg);
        setIsUploading(false);
        setActiveStep(null);
        return;
      }

      let result;
      try { result = JSON.parse(xhr.responseText); if (!result.jobId) throw new Error(); }
      catch { setError('The server returned an invalid upload response. Please retry.'); setIsUploading(false); return; }
      const deadline = Date.now() + 180000;
      setActiveStep('parsing');
      const poll = async () => {
        const controller = new AbortController();
        requestRef.current = controller;
        const timeout = setTimeout(() => controller.abort(), 45000);
        try {
          const response = await fetch(`${apiUrl}/api/upload/${result.jobId}`, { credentials: 'include', signal: controller.signal });
          const status = await response.json();
          if (response.status === 404) throw new Error('Your session expired before the analysis finished. Please upload again.');
          if (!response.ok || status.status === 'failed') throw new Error(status.error || 'Analysis failed. Please retry.');
          if (status.status === 'completed') {
            if (!status.data) throw new Error('Analysis returned no resume data. Please retry.');
            setActiveStep('done');
            navigate('/analysis', { state: { sessionId: result.sessionId, data: status.data } });
            return;
          }
          if (Date.now() > deadline) throw new Error('Analysis took too long. Please try again shortly.');
          setActiveStep(status.step);
          timerRef.current = setTimeout(poll, 1500);
        } catch (err) {
          setError(err.name === 'AbortError' ? 'The server took too long to respond. Please retry.' : err.message);
          setIsUploading(false);
          setActiveStep(null);
        } finally { clearTimeout(timeout); }
      };
      poll();
    });
    xhr.addEventListener('timeout', () => {
      setError('Upload timed out. Please try again.');
      setIsUploading(false);
      setActiveStep(null);
    });

    xhr.addEventListener('error', () => {
      setError('Could not reach the server. Check your internet connection and try again.');
      setIsUploading(false);
      setActiveStep(null);
    });

    xhr.open('POST', `${apiUrl}/api/upload`);
    xhr.withCredentials = true;
    xhr.send(formData);
  };

  // ── Derived progress percentage across all steps ────────────────────────────
  const stepIdx      = activeStep ? getStepIndex(activeStep) : -1;
  // Each step is worth 100 / STEPS.length of the total bar.
  // For the 'upload' step we use the real XHR percentage within that slice.
  const totalSteps   = STEPS.length;
  const stepShare    = 100 / totalSteps;
  let   overallPct   = 0;
  if (activeStep === 'upload') {
    overallPct = (uploadPct / 100) * stepShare;
  } else if (stepIdx > 0) {
    overallPct = stepIdx * stepShare;
  }
  if (activeStep === 'done') overallPct = 100;

  return (
    <section id="upload" className="upload-section container">
      <div className="upload__header reveal">
        <h2 className="upload__title">Let's see what you're working with.</h2>
        <p className="upload__subtitle">Upload your current resume. We'll extract the data and analyze it against your target role instantly.</p>
      </div>

      {/* ── Minimalist error box ──────────────────────────────────────────── */}
      {error && !isUploading && (
        <div className="upload__error-box" role="alert">
          <Icon icon="ph:x-circle-fill" width="16" height="16" aria-hidden="true" />
          <span>{error}</span>
          <button
            className="upload__error-dismiss"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            <Icon icon="ph:x-bold" width="12" height="12" />
          </button>
        </div>
      )}

      <div className="upload__grid">
        {/* ── Drag & Drop Zone ───────────────────────────────────────────── */}
        <div 
          className={`upload__dropzone ${isDragging ? 'upload__dropzone--active' : ''} ${file ? 'upload__dropzone--has-file' : ''} ${isUploading ? 'upload__dropzone--uploading' : ''} reveal-left`}
          onDragEnter={isUploading ? undefined : handleDrag}
          onDragLeave={isUploading ? undefined : handleDrag}
          onDragOver={isUploading ? undefined : handleDrag}
          onDrop={isUploading ? undefined : handleDrop}
          onClick={isUploading ? undefined : () => fileInputRef.current?.click()}
          role="button" tabIndex={isUploading ? -1 : 0} aria-label="Choose PDF resume"
          onKeyDown={e => { if (!isUploading && e.target === e.currentTarget && ['Enter', ' '].includes(e.key)) { e.preventDefault(); fileInputRef.current?.click(); } }}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".pdf" 
            onChange={handleChange}
            onClick={e => { e.stopPropagation(); e.currentTarget.value = ''; }}
            style={{ display: 'none' }} 
            aria-label="Upload Resume PDF"
            disabled={isUploading}
          />

          {/* ── Progress overlay ─────────────────────────────────────── */}
          {isUploading ? (
            <div className="upload__progress-view">
              {/* Step indicators */}
              <div className="upload__steps">
                {STEPS.map((step, idx) => {
                  const current = activeStep === step.id;
                  const done    = stepIdx > idx || activeStep === 'done';
                  return (
                    <div
                      key={step.id}
                      className={`upload__step ${
                        done    ? 'upload__step--done'
                        : current ? 'upload__step--active'
                        : ''
                      }`}
                    >
                      <div className="upload__step-icon">
                        {done && !current
                          ? <Icon icon="ph:check-bold" width="14" height="14" />
                          : <Icon icon={step.icon} width="14" height="14" />
                        }
                      </div>
                      <span className="upload__step-label">{step.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Overall progress bar */}
              <div className="upload__bar-track" role="progressbar" aria-valuenow={Math.round(overallPct)} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="upload__bar-fill"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <p className="upload__bar-label">
                {activeStep === 'done' ? 'All done!' : STEPS[Math.max(0, stepIdx)].label}
                {activeStep === 'upload' && ` · ${uploadPct}%`}
              </p>
            </div>
          ) : !file ? (
            <div className="upload__dropzone-content">
              <div className="upload__icon-wrap">
                <Icon icon="ph:upload-simple-bold" width="32" height="32" />
              </div>
              <h3>Drag &amp; drop your resume</h3>
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
                aria-label="Remove resume"
                onClick={(e) => { e.stopPropagation(); setFile(null); setError(null); }}
              >
                <Icon icon="ph:trash-bold" width="20" height="20" />
              </button>
            </div>
          )}


        </div>

        {/* ── Job Context Form ───────────────────────────────────────────── */}
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
              disabled={isUploading}
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
              disabled={isUploading}
            ></textarea>
          </div>

          <div className="upload__action">
            <SpecularButton 
              size="lg" 
              className="w-full"
              disabled={!file || isUploading}
              onClick={handleAnalyze}
            >
              {isUploading ? 'Processing…' : 'Analyze My Resume'}
            </SpecularButton>
          </div>
        </div>
      </div>
    </section>
  );
}
