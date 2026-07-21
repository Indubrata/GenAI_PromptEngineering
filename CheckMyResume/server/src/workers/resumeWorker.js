import { Worker } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { getIo } from '../config/socket.js';
import { extractTextFromPDF } from '../services/pdfParser.js';
import { generateCompletion } from '../services/aiGateway.js';

const RESUME_PARSER_SYSTEM_PROMPT = `
You are an expert technical recruiter and Applicant Tracking System (ATS) parser.
Your task is to take a raw, unstructured resume text and intelligently extract it into a structured JSON schema.
You will evaluate the resume against the Target Role and Target Description provided by the user.

Follow these rules STRICTLY:
1. Fix any OCR typos or weird formatting from the PDF extraction.
2. If a section is missing from the resume, leave it as an empty array or null.
3. Critically evaluate how well the resume matches the target role, and calculate an 'atsScore' out of 100.
4. Provide a 'feedback' summary with actionable advice to improve the resume for this role.
5. The output MUST be valid JSON matching this exact schema:
{
  "atsScore": 85,
  "feedback": "Your resume has a strong structure, but lacks quantifiable metrics...",
  "contact": {
    "name": "Full Name",
    "email": "Email Address",
    "phone": "Phone Number",
    "location": "City, State",
    "linkedin": "URL",
    "portfolio": "URL"
  },
  "summary": "A professional summary (extract if exists, otherwise leave empty string)",
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "startDate": "YYYY-MM or string",
      "endDate": "YYYY-MM or string or Present",
      "description": ["bullet point 1", "bullet point 2"]
    }
  ],
  "education": [
    {
      "institution": "School Name",
      "degree": "Degree and Major",
      "graduationDate": "YYYY or string"
    }
  ],
  "skills": ["Skill 1", "Skill 2"]
}
`;

export const resumeWorker = new Worker('resumeProcessing', async (job) => {
  const { sessionId, fileBuffer, targetRole, targetDescription } = job.data;
  const io = getIo();
  
  try {
    // Notify client: Step 1
    io.to(sessionId).emit('analysis-progress', { 
      step: 'parsing', 
      message: 'Extracting text from PDF...' 
    });

    // 1. Convert base64 back to buffer and extract text
    const buffer = Buffer.from(fileBuffer, 'base64');
    const rawText = await extractTextFromPDF(buffer);

    // Notify client: Step 2
    io.to(sessionId).emit('analysis-progress', { 
      step: 'analyzing', 
      message: 'AI is analyzing structure and matching keywords...' 
    });

    // 2. Call AI Gateway to parse and structure the data
    const userPrompt = `
      Target Role: ${targetRole || 'Not specified'}
      Target Description: ${targetDescription || 'Not specified'}
      
      Raw Resume Text:
      ${rawText}
    `;

    // Use robust model (true) and request JSON format (true)
    const structuredResume = await generateCompletion(
      RESUME_PARSER_SYSTEM_PROMPT, 
      userPrompt, 
      true, 
      true
    );

    // Explicitly embed the targetRole that was used for parsing into the final data
    if (structuredResume && typeof structuredResume === 'object') {
      structuredResume.targetRole = targetRole || 'Software Engineer';
    }

    // Notify client: Done
    io.to(sessionId).emit('analysis-complete', {
      success: true,
      data: structuredResume
    });

    return { success: true };

  } catch (error) {
    console.error(`Error processing resume job ${job.id}:`, error);
    
    io.to(sessionId).emit('analysis-error', {
      success: false,
      error: error.message || 'Failed to process resume'
    });
    
    throw error;
  }
}, { 
  connection: redisClient // BullMQ worker reuses the standard redis client
});

resumeWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});
