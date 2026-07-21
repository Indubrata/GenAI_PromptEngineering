/**
 * BrightData Job Scraper Service
 *
 * Uses BrightData Dataset APIs when available.
 * When BrightData is unavailable or returns 0 results, it returns structured, targeted search URLs
 * for LinkedIn and Google so the frontend can launch real live searches on the user's browser
 * rather than displaying fake/simulated data.
 */

const BRIGHTDATA_BASE = 'https://api.brightdata.com';
const JOBS_DATASET_ID = 'gd_lpfll7v4igqq1c98l';
const PEOPLE_DATASET_ID = 'gd_l1viktl72bvl7bjuj0';

/** Poll for dataset results (BrightData async trigger → poll pattern) */
async function pollSnapshot(snapshotId, apiKey, maxWaitMs = 30_000) {
  const start = Date.now();
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  while (Date.now() - start < maxWaitMs) {
    await delay(3000);
    const res = await fetch(
      `${BRIGHTDATA_BASE}/datasets/v3/snapshot/${snapshotId}?format=json`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!res.ok) throw new Error(`Snapshot poll failed: ${res.status}`);
    const body = await res.json();

    if (body.status === 'ready' && Array.isArray(body.data)) return body.data;
    if (body.status === 'failed') throw new Error('BrightData snapshot failed');
  }

  throw new Error('BrightData snapshot timed out');
}

/** Trigger a BrightData dataset collection and wait for results */
async function triggerAndCollect(datasetId, payload, apiKey, limit) {
  const triggerRes = await fetch(
    `${BRIGHTDATA_BASE}/datasets/v3/trigger?dataset_id=${datasetId}&include_errors=false`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!triggerRes.ok) {
    const errText = await triggerRes.text();
    throw new Error(`BrightData trigger failed (${triggerRes.status}): ${errText}`);
  }

  const { snapshot_id } = await triggerRes.json();
  if (!snapshot_id) throw new Error('No snapshot_id returned from BrightData');

  const rows = await pollSnapshot(snapshot_id, apiKey);
  return rows.slice(0, limit);
}

/**
 * Fetch live LinkedIn job postings matching a job title.
 * Returns { isLive: boolean, jobs: Array, searchUrls: Object }
 */
export async function fetchLiveJobs(jobTitle, limit = 3) {
  const apiKey = process.env.BRIGHT_DATA_API_KEY || process.env.BRIGHTDATA_API_KEY;

  if (!apiKey) {
    return { isLive: false, jobs: [], searchUrls: buildTargetedJobSearchUrls(jobTitle) };
  }

  try {
    const rows = await triggerAndCollect(
      JOBS_DATASET_ID,
      [{ keyword: jobTitle, location: 'United States', country: 'US' }],
      apiKey,
      limit
    );

    if (!rows || rows.length === 0) {
      return { isLive: false, jobs: [], searchUrls: buildTargetedJobSearchUrls(jobTitle) };
    }

    return {
      isLive: true,
      jobs: rows.map((job, i) => ({
        role: job.title || job.job_title || jobTitle,
        company: job.company_name || job.company || 'Unknown Company',
        match: matchScore(i),
        salary: job.salary || job.salary_range || 'Competitive',
        location: job.location || job.job_location || 'Remote',
        url: job.url || job.job_url || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}`,
      })),
      searchUrls: buildTargetedJobSearchUrls(jobTitle)
    };
  } catch (error) {
    console.error('BrightData Jobs Error:', error.message);
    return { isLive: false, jobs: [], searchUrls: buildTargetedJobSearchUrls(jobTitle) };
  }
}

/**
 * Fetch real recruiters/hiring managers at a specific company via BrightData.
 * Returns { isLive: boolean, recruiters: Array, searchUrls: Object }
 */
export async function fetchRecruitersAtCompany(company, jobTitle, limit = 3) {
  const apiKey = process.env.BRIGHT_DATA_API_KEY || process.env.BRIGHTDATA_API_KEY;

  if (!apiKey) {
    return { isLive: false, recruiters: [], searchUrls: buildTargetedRecruiterSearchUrls(company, jobTitle) };
  }

  try {
    const rows = await triggerAndCollect(
      PEOPLE_DATASET_ID,
      [
        {
          search_term: `Recruiter OR "Hiring Manager" OR "Talent Acquisition" ${company}`,
          location: 'United States',
        },
      ],
      apiKey,
      limit
    );

    if (!rows || rows.length === 0) {
      return { isLive: false, recruiters: [], searchUrls: buildTargetedRecruiterSearchUrls(company, jobTitle) };
    }

    return {
      isLive: true,
      recruiters: rows.map((person) => ({
        name: person.name || person.full_name || 'Hiring Team',
        title: person.title || person.headline || 'Recruiter',
        company: person.company || company,
        linkedinUrl: person.url || person.profile_url || `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`recruiter ${company}`)}`,
      })),
      searchUrls: buildTargetedRecruiterSearchUrls(company, jobTitle)
    };
  } catch (error) {
    console.error('BrightData Recruiters Error:', error.message);
    return { isLive: false, recruiters: [], searchUrls: buildTargetedRecruiterSearchUrls(company, jobTitle) };
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function matchScore(index) {
  return ['96%', '91%', '84%', '78%', '72%'][index] || '70%';
}

function buildTargetedJobSearchUrls(jobTitle) {
  return {
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}`,
    google: `https://www.google.com/search?q=${encodeURIComponent(`${jobTitle} open jobs hiring`)}`,
    indeed: `https://www.indeed.com/jobs?q=${encodeURIComponent(jobTitle)}`
  };
}

function buildTargetedRecruiterSearchUrls(company, jobTitle) {
  const compQuery = company ? ` "${company}"` : '';
  return {
    linkedin: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`recruiter OR "hiring manager" OR "talent acquisition"${compQuery} ${jobTitle}`)}`,
    google: `https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/in/ recruiter OR "talent acquisition"${compQuery} "${jobTitle}"`)}`
  };
}
