import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useResume } from '../../context/ResumeContext';
import SpecularButton from '../ui/SpecularButton';
import './ExportPage.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ExportPage() {
  const { jobRole } = useResume();
  const location = useLocation();
  const navigate = useNavigate();
  const resumeData = location.state?.resumeData;
  // Use targetRole from resumeData (which survives refreshes), then context, then fallback
  const userTitle = resumeData?.targetRole || jobRole || resumeData?.contact?.title || 'Software Engineer';

  const [jobMatches, setJobMatches]       = useState([]);
  const [jobsIsLive, setJobsIsLive]       = useState(false);
  const [jobSearchUrls, setJobSearchUrls] = useState({});
  const [loadingJobs, setLoadingJobs]     = useState(true);

  const [recruiters, setRecruiters]       = useState([]);
  const [recIsLive, setRecIsLive]         = useState(false);
  const [recSearchUrls, setRecSearchUrls] = useState({});
  const [loadingRec, setLoadingRec]       = useState(false);

  const [activeMsg, setActiveMsg]         = useState(0);
  const [downloading, setDownloading]     = useState(null);
  const [copyDone, setCopyDone]           = useState(false);

  /* ── Fetch live job matches ── */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API}/api/jobs/matches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobTitle: userTitle, limit: 3 })
        });
        if (!response.ok) throw new Error(`Server ${response.status}`);
        const data = await response.json();
        setJobsIsLive(!!data.isLive);
        if (data.jobs?.length) setJobMatches(data.jobs);
        if (data.searchUrls) setJobSearchUrls(data.searchUrls);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [userTitle]);

  /* ── Fetch recruiters ── */
  useEffect(() => {
    const fetchRecruiters = async () => {
      setLoadingRec(true);
      try {
        const companyName = jobMatches[0]?.company || 'Tech';
        const res = await fetch(`${API}/api/jobs/recruiters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company: companyName, jobTitle: userTitle, limit: 2 })
        });
        if (!res.ok) throw new Error(`Server ${res.status}`);
        const data = await res.json();
        setRecIsLive(!!data.isLive);
        if (data.recruiters?.length) setRecruiters(data.recruiters);
        if (data.searchUrls) setRecSearchUrls(data.searchUrls);
      } catch (err) {
        console.error('Error fetching recruiters:', err);
      } finally {
        setLoadingRec(false);
      }
    };

    fetchRecruiters();
  }, [jobMatches, userTitle]);

  /* ── Download handlers ── */
  const handleDownload = async (format) => {
    setDownloading(format);
    try {
      const res = await fetch(`${API}/api/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
        throw new Error(err.error || `Failed to generate ${format.toUpperCase()}`);
      }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `Optimized_Resume.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err.message || `Failed to generate ${format.toUpperCase()}`);
    } finally {
      setDownloading(null);
    }
  };

  /* ── Recruiter message builder ── */
  const currentEntry = recruiters[activeMsg];
  const targetRecruiterName = recIsLive && currentEntry?.name ? currentEntry.name : 'Hiring Manager';
  const targetCompany = recIsLive && currentEntry?.company ? currentEntry.company : 'your team';

  const messageText = `Hi ${targetRecruiterName},\n\nI came across open ${userTitle} positions at ${targetCompany} and was genuinely excited — your team's work aligns closely with my technical background. I've spent the past several years building production-grade systems and would love to explore how I can contribute.\n\nI've attached my ATS-optimized resume for your review. Would you be open to a brief 15-minute chat this week or next?\n\nLooking forward to connecting!\n\nBest regards`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  };

  const handleOpenUrl = (url) => {
    if (url) window.open(url, '_blank');
  };

  // Targeted search fallback URLs
  const defaultJobSearchLinkedIn = jobSearchUrls.linkedin || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(userTitle)}`;
  const defaultJobSearchGoogle = jobSearchUrls.google || `https://www.google.com/search?q=${encodeURIComponent(`${userTitle} open jobs hiring`)}`;
  const defaultJobSearchIndeed = jobSearchUrls.indeed || `https://www.indeed.com/jobs?q=${encodeURIComponent(userTitle)}`;

  const defaultRecSearchLinkedIn = recSearchUrls.linkedin || `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`recruiter OR "hiring manager" OR "talent acquisition" "${userTitle}"`)}`;
  const defaultRecSearchGoogle = recSearchUrls.google || `https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/in/ recruiter OR "talent acquisition" "${userTitle}"`)}`;

  return (
    <div className="export-page">
      <header className="export-page__header">
        <h1 className="export-page__title">Your Resume is Ready</h1>
        <p className="export-page__subtitle">
          Based on our AI analysis, your resume is now highly optimized for ATS tracking systems.
        </p>
      </header>

      {/* ── Download buttons ── */}
      <section className="export-actions">
        <SpecularButton
          size="lg"
          onClick={() => handleDownload('pdf')}
          disabled={!!downloading}
        >
          <Icon icon="ph:file-pdf-bold" width="22" />
          {downloading === 'pdf' ? 'Generating…' : 'Download PDF'}
        </SpecularButton>

        <button
          className="btn-secondary"
          onClick={() => handleDownload('docx')}
          disabled={!!downloading}
        >
          <Icon icon="ph:file-doc-bold" width="22" />
          {downloading === 'docx' ? 'Generating…' : 'Download DOCX'}
        </button>
      </section>

      {/* ── Top Job Matches Section ── */}
      <section className="job-matches">
        <div className="job-matches__header">
          <h2>Targeted Job Search ({userTitle})</h2>
          <span className="live-indicator">
            <span className={`pulse ${jobsIsLive ? 'pulse--active' : ''}`} />
            {loadingJobs ? 'Searching…' : jobsIsLive ? 'Bright Data Live Sync' : 'Direct Search Ready'}
          </span>
        </div>

        <div className="job-matches__content">
          {loadingJobs ? (
            <div className="loading-jobs">
              <Icon icon="ph:spinner" width="28" className="spin" />
              <p>Searching for live {userTitle} opportunities…</p>
            </div>
          ) : jobsIsLive && jobMatches.length > 0 ? (
            /* Scraped live jobs grid */
            <div className="job-matches__grid">
              {jobMatches.map((job, idx) => (
                <div key={idx} className="job-card">
                  <div className="job-card__header">
                    <h3>{job.role}</h3>
                    <span className="job-card__match">{job.match} Match</span>
                  </div>
                  <p className="job-card__company">{job.company}</p>
                  <div className="job-card__details">
                    <span className="job-badge"><Icon icon="ph:money" /> {job.salary}</span>
                    <span className="job-badge"><Icon icon="ph:map-pin" /> {job.location}</span>
                  </div>
                  <button className="btn-primary job-card__apply" onClick={() => handleOpenUrl(job.url)}>
                    Apply on LinkedIn
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Targeted Browser Search Launcher */
            <div className="search-fallback-card">
              <div className="search-fallback-header">
                <Icon icon="ph:magnifying-glass-bold" width="32" className="search-icon" />
                <div>
                  <h3>Find Real Openings for "{userTitle}"</h3>
                  <p>Launch targeted live searches directly in your browser with optimized search parameters:</p>
                </div>
              </div>
              <div className="search-fallback-actions">
                <button className="btn-primary search-btn" onClick={() => handleOpenUrl(defaultJobSearchLinkedIn)}>
                  <Icon icon="ph:linkedin-logo" width="20" /> Search LinkedIn Jobs
                </button>
                <button className="btn-secondary search-btn" onClick={() => handleOpenUrl(defaultJobSearchGoogle)}>
                  <Icon icon="logos:google-icon" width="18" /> Search Google Jobs
                </button>
                <button className="btn-secondary search-btn" onClick={() => handleOpenUrl(defaultJobSearchIndeed)}>
                  <Icon icon="ph:briefcase-bold" width="18" /> Search Indeed Jobs
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Auto-Drafted Recruiter Messages Section ── */}
      <section className="recruiter-outreach">
        <h2>Auto-Drafted Recruiter Messages</h2>
        <p className="recruiter-outreach__subtitle">
          Ready-to-send cold outreach message customized for <strong>{userTitle}</strong> opportunities
        </p>

        {loadingRec && (
          <div className="loading-jobs">
            <Icon icon="ph:spinner" width="24" className="spin" />
            <p>Preparing recruiter outreach details…</p>
          </div>
        )}

        {!loadingRec && recIsLive && recruiters.length > 0 && (
          <div className="recruiter-tabs">
            {recruiters.map((entry, i) => (
              <button
                key={i}
                className={`recruiter-tab${i === activeMsg ? ' recruiter-tab--active' : ''}`}
                onClick={() => setActiveMsg(i)}
              >
                {entry.company || `Contact ${i + 1}`}
              </button>
            ))}
          </div>
        )}

        {!loadingRec && (
          <div className="outreach-card">
            <div className="outreach-card__to-block">
              <p className="outreach-card__to">
                <strong>To:</strong>{' '}
                {recIsLive && currentEntry ? (
                  <a href={currentEntry.linkedinUrl} target="_blank" rel="noreferrer" className="recruiter-link">
                    {currentEntry.name} ({currentEntry.title} @ {currentEntry.company})
                  </a>
                ) : (
                  <span>Recruiter / Hiring Manager ({userTitle} Roles)</span>
                )}
              </p>
            </div>

            <div className="outreach-card__body">
              {messageText.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </div>

            <div className="outreach-actions">
              <button className="btn-secondary" onClick={handleCopy}>
                <Icon icon={copyDone ? 'ph:check' : 'ph:copy'} />
                {copyDone ? 'Copied Message!' : 'Copy Message'}
              </button>

              <button className="btn-primary" onClick={() => handleOpenUrl(defaultRecSearchLinkedIn)}>
                <Icon icon="ph:linkedin-logo" /> Find Recruiters on LinkedIn
              </button>

              <button className="btn-secondary" onClick={() => handleOpenUrl(defaultRecSearchGoogle)}>
                <Icon icon="logos:google-icon" width="16" /> Find Recruiters on Google
              </button>
            </div>
          </div>
        )}
      </section>

      <button
        className="export-page__back"
        onClick={() => navigate('/editor', { state: { resumeData } })}
      >
        <Icon icon="ph:arrow-left" /> Back to Editor
      </button>
    </div>
  );
}
