import express from 'express';
import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// ── HTML formatting helpers for PDF export ────────────────────────────────────

function formatExperienceHTML(exp) {
  if (!exp) return '';
  if (typeof exp === 'string') return exp.trim() ? `<p>${exp.trim()}</p>` : '';
  if (!Array.isArray(exp) || exp.length === 0) return '';

  const itemsHTML = exp.map(item => {
    if (typeof item === 'string' && item.trim()) {
      return `<p>${item.trim()}</p>`;
    }
    if (typeof item === 'object' && item !== null) {
      const title = [item.role, item.company ? `at ${item.company}` : ''].filter(Boolean).join(' ');
      const dates = [item.startDate, item.endDate].filter(Boolean).join(' – ');
      
      if (!title && !dates && !item.description) return '';

      const header = `
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 4px;">
          <strong style="font-size: 15px; color: #1a1a1a;">${title || 'Position'}</strong>
          <span style="font-size: 13px; color: #666;">${dates}</span>
        </div>`;

      let bullets = '';
      if (Array.isArray(item.description) && item.description.length > 0) {
        const validBullets = item.description.filter(b => typeof b === 'string' && b.trim());
        if (validBullets.length > 0) {
          bullets = `<ul style="margin: 4px 0 12px 20px; padding: 0;">${validBullets.map(b => `<li style="margin-bottom: 3px;">${b.trim()}</li>`).join('')}</ul>`;
        }
      } else if (typeof item.description === 'string' && item.description.trim()) {
        bullets = `<p style="margin: 4px 0 12px;">${item.description.trim()}</p>`;
      }

      return `<div style="margin-bottom: 12px;">${header}${bullets}</div>`;
    }
    return '';
  }).filter(Boolean).join('');

  return itemsHTML;
}

function formatEducationHTML(edu) {
  if (!edu) return '';
  if (typeof edu === 'string') return edu.trim() ? `<p>${edu.trim()}</p>` : '';
  if (!Array.isArray(edu) || edu.length === 0) return '';

  const itemsHTML = edu.map(item => {
    if (typeof item === 'string' && item.trim()) {
      return `<p>${item.trim()}</p>`;
    }
    if (typeof item === 'object' && item !== null) {
      const degree = item.degree || item.institution || '';
      const school = item.degree && item.institution ? item.institution : '';
      const date = item.graduationDate || item.year || item.endDate || '';

      if (!degree && !school && !date && !item.details) return '';

      const header = `
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 2px;">
          <strong style="font-size: 15px; color: #1a1a1a;">${degree}</strong>
          <span style="font-size: 13px; color: #666;">${date}</span>
        </div>
        ${school ? `<div style="font-style: italic; color: #4a4a4a; margin-bottom: 4px;">${school}</div>` : ''}`;

      let details = '';
      if (Array.isArray(item.details) && item.details.length > 0) {
        const validDetails = item.details.filter(d => typeof d === 'string' && d.trim());
        if (validDetails.length > 0) {
          details = `<ul style="margin: 4px 0 10px 20px; padding: 0;">${validDetails.map(d => `<li style="margin-bottom: 2px;">${d.trim()}</li>`).join('')}</ul>`;
        }
      } else if (typeof item.details === 'string' && item.details.trim()) {
        details = `<p style="margin: 4px 0 10px;">${item.details.trim()}</p>`;
      }

      return `<div style="margin-bottom: 10px;">${header}${details}</div>`;
    }
    return '';
  }).filter(Boolean).join('');

  return itemsHTML;
}

function formatSkillsHTML(skills) {
  if (!skills) return '';
  if (typeof skills === 'string') return skills.trim() ? `<p>${skills.trim()}</p>` : '';
  if (Array.isArray(skills) && skills.length > 0) {
    const list = skills.map(s => typeof s === 'object' ? (s.name || s.skill || '') : String(s)).filter(s => s.trim());
    if (list.length === 0) return '';
    return `<p style="line-height: 1.6;">${list.join('  •  ')}</p>`;
  }
  return '';
}

function formatProjectsHTML(projects) {
  if (!projects) return '';
  if (typeof projects === 'string') return projects.trim() ? `<p>${projects.trim()}</p>` : '';
  if (!Array.isArray(projects) || projects.length === 0) return '';

  const itemsHTML = projects.map(item => {
    if (typeof item === 'string' && item.trim()) {
      return `<p>${item.trim()}</p>`;
    }
    if (typeof item === 'object' && item !== null) {
      const name = item.name || item.title || 'Project';
      const link = item.link ? ` (<a href="${item.link}" style="color:#2563eb; text-decoration:none;">${item.link}</a>)` : '';

      let bullets = '';
      if (Array.isArray(item.description) && item.description.length > 0) {
        const validBullets = item.description.filter(b => typeof b === 'string' && b.trim());
        if (validBullets.length > 0) {
          bullets = `<ul style="margin: 4px 0 10px 20px; padding: 0;">${validBullets.map(b => `<li style="margin-bottom: 3px;">${b.trim()}</li>`).join('')}</ul>`;
        }
      } else if (typeof item.description === 'string' && item.description.trim()) {
        bullets = `<p style="margin: 4px 0 10px;">${item.description.trim()}</p>`;
      }

      return `<div style="margin-bottom: 10px;"><strong style="font-size: 15px;">${name}</strong>${link}${bullets}</div>`;
    }
    return '';
  }).filter(Boolean).join('');

  return itemsHTML;
}


/**
 * POST /api/export/pdf
 * Generates a PDF from resume data using Puppeteer.
 */
router.post('/pdf', 
  [
    body('resumeData').isObject().withMessage('Resume data must be a valid object.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resumeData } = req.body;

    try {
      const contact = resumeData.contact || resumeData['contact info'] || {};
      const name = contact.name || resumeData.name || 'Resume';

      const contactItems = [
        contact.email ? `Email: ${contact.email}` : '',
        contact.phone ? `Phone: ${contact.phone}` : '',
        contact.location ? `Location: ${contact.location}` : '',
        contact.linkedin ? `LinkedIn: ${contact.linkedin}` : '',
        contact.portfolio ? `Portfolio: ${contact.portfolio}` : ''
      ].filter(Boolean);

      // Build sections dynamically, omitting empty ones
      const dynamicSections = [];

      if (typeof resumeData.summary === 'string' && resumeData.summary.trim()) {
        dynamicSections.push(`
          <div class="section">
            <h2>Summary</h2>
            <p>${resumeData.summary.trim()}</p>
          </div>
        `);
      }

      const expHTML = formatExperienceHTML(resumeData.experience);
      if (expHTML) {
        dynamicSections.push(`
          <div class="section">
            <h2>Experience</h2>
            ${expHTML}
          </div>
        `);
      }

      const eduHTML = formatEducationHTML(resumeData.education);
      if (eduHTML) {
        dynamicSections.push(`
          <div class="section">
            <h2>Education</h2>
            ${eduHTML}
          </div>
        `);
      }

      const skillsHTML = formatSkillsHTML(resumeData.skills);
      if (skillsHTML) {
        dynamicSections.push(`
          <div class="section">
            <h2>Skills</h2>
            ${skillsHTML}
          </div>
        `);
      }

      const projHTML = formatProjectsHTML(resumeData.projects);
      if (projHTML) {
        dynamicSections.push(`
          <div class="section">
            <h2>Projects</h2>
            ${projHTML}
          </div>
        `);
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #222; line-height: 1.5; padding: 40px; }
            h1 { font-size: 26px; color: #111; margin: 0 0 6px 0; font-weight: 700; }
            h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 0.8px; color: #333; border-bottom: 1.5px solid #333; padding-bottom: 4px; margin-top: 22px; margin-bottom: 12px; }
            p { margin: 4px 0; font-size: 14px; }
            .contact-info { font-size: 13px; color: #555; margin-bottom: 20px; }
            .section { margin-bottom: 16px; }
            ul { margin-top: 4px; margin-bottom: 8px; }
            li { font-size: 13.5px; }
          </style>
        </head>
        <body>
          <h1>${name}</h1>
          ${contactItems.length > 0 ? `<div class="contact-info">${contactItems.join('  |  ')}</div>` : ''}
          ${dynamicSections.join('')}
        </body>
        </html>
      `;

      const browser = await puppeteer.launch({ 
        executablePath: process.env.BROWSER_EXECUTABLE_PATH || '/usr/bin/brave-browser',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--headless=new'
        ]
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } });
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Optimized_Resume.pdf"');
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error('PDF Generation Error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
});


/**
 * POST /api/export/docx
 * Generates a DOCX from resume data using the docx package.
 */
router.post('/docx', 
  [
    body('resumeData').isObject().withMessage('Resume data must be a valid object.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resumeData } = req.body;

    try {
      const docChildren = [];
      const contact = resumeData.contact || resumeData['contact info'] || {};
      const name = contact.name || resumeData.name || 'Resume';

      // Name header
      docChildren.push(
        new Paragraph({
          text: name,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 120 }
        })
      );

      // Contact info
      const contactItems = [
        contact.email ? `Email: ${contact.email}` : '',
        contact.phone ? `Phone: ${contact.phone}` : '',
        contact.location ? `Location: ${contact.location}` : '',
        contact.linkedin ? `LinkedIn: ${contact.linkedin}` : '',
        contact.portfolio ? `Portfolio: ${contact.portfolio}` : ''
      ].filter(Boolean);

      if (contactItems.length > 0) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: contactItems.join('  |  '), color: "555555", size: 20 })
            ],
            spacing: { after: 300 }
          })
        );
      }

      const addSectionHeading = (title) => {
        docChildren.push(
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
          })
        );
      };

      // Summary
      if (typeof resumeData.summary === 'string' && resumeData.summary.trim()) {
        addSectionHeading('Summary');
        docChildren.push(
          new Paragraph({
            text: resumeData.summary.trim(),
            spacing: { after: 200 }
          })
        );
      }

      // Experience
      if (Array.isArray(resumeData.experience) && resumeData.experience.length > 0) {
        let hasContent = false;
        const expParagraphs = [];

        resumeData.experience.forEach(item => {
          if (typeof item === 'string' && item.trim()) {
            hasContent = true;
            expParagraphs.push(new Paragraph({ text: item.trim(), spacing: { after: 100 } }));
          } else if (typeof item === 'object' && item !== null) {
            const title = [item.role, item.company ? `at ${item.company}` : ''].filter(Boolean).join(' ');
            const dates = [item.startDate, item.endDate].filter(Boolean).join(' – ');
            const headerText = [title, dates].filter(Boolean).join('  |  ');

            if (headerText) {
              hasContent = true;
              expParagraphs.push(
                new Paragraph({
                  children: [new TextRun({ text: headerText, bold: true })],
                  spacing: { before: 100, after: 60 }
                })
              );
            }

            if (Array.isArray(item.description)) {
              item.description.forEach(bullet => {
                if (typeof bullet === 'string' && bullet.trim()) {
                  hasContent = true;
                  expParagraphs.push(
                    new Paragraph({
                      text: `• ${bullet.trim()}`,
                      indent: { left: 360 },
                      spacing: { after: 40 }
                    })
                  );
                }
              });
            } else if (typeof item.description === 'string' && item.description.trim()) {
              hasContent = true;
              expParagraphs.push(
                new Paragraph({
                  text: item.description.trim(),
                  spacing: { after: 100 }
                })
              );
            }
          }
        });

        if (hasContent) {
          addSectionHeading('Experience');
          docChildren.push(...expParagraphs);
        }
      } else if (typeof resumeData.experience === 'string' && resumeData.experience.trim()) {
        addSectionHeading('Experience');
        docChildren.push(new Paragraph({ text: resumeData.experience.trim(), spacing: { after: 200 } }));
      }

      // Education
      if (Array.isArray(resumeData.education) && resumeData.education.length > 0) {
        let hasContent = false;
        const eduParagraphs = [];

        resumeData.education.forEach(item => {
          if (typeof item === 'string' && item.trim()) {
            hasContent = true;
            eduParagraphs.push(new Paragraph({ text: item.trim(), spacing: { after: 100 } }));
          } else if (typeof item === 'object' && item !== null) {
            const degree = item.degree || item.institution || '';
            const school = item.degree && item.institution ? item.institution : '';
            const date = item.graduationDate || item.year || item.endDate || '';
            const headerText = [degree, school, date].filter(Boolean).join('  |  ');

            if (headerText) {
              hasContent = true;
              eduParagraphs.push(
                new Paragraph({
                  children: [new TextRun({ text: headerText, bold: true })],
                  spacing: { before: 100, after: 60 }
                })
              );
            }

            if (Array.isArray(item.details)) {
              item.details.forEach(d => {
                if (typeof d === 'string' && d.trim()) {
                  hasContent = true;
                  eduParagraphs.push(
                    new Paragraph({
                      text: `• ${d.trim()}`,
                      indent: { left: 360 },
                      spacing: { after: 40 }
                    })
                  );
                }
              });
            } else if (typeof item.details === 'string' && item.details.trim()) {
              hasContent = true;
              eduParagraphs.push(
                new Paragraph({
                  text: item.details.trim(),
                  spacing: { after: 100 }
                })
              );
            }
          }
        });

        if (hasContent) {
          addSectionHeading('Education');
          docChildren.push(...eduParagraphs);
        }
      } else if (typeof resumeData.education === 'string' && resumeData.education.trim()) {
        addSectionHeading('Education');
        docChildren.push(new Paragraph({ text: resumeData.education.trim(), spacing: { after: 200 } }));
      }

      // Skills
      if (Array.isArray(resumeData.skills) && resumeData.skills.length > 0) {
        const skillList = resumeData.skills
          .map(s => typeof s === 'object' ? (s.name || s.skill || '') : String(s))
          .filter(s => s.trim());

        if (skillList.length > 0) {
          addSectionHeading('Skills');
          docChildren.push(
            new Paragraph({
              text: skillList.join(', '),
              spacing: { after: 200 }
            })
          );
        }
      } else if (typeof resumeData.skills === 'string' && resumeData.skills.trim()) {
        addSectionHeading('Skills');
        docChildren.push(new Paragraph({ text: resumeData.skills.trim(), spacing: { after: 200 } }));
      }

      // Projects
      if (Array.isArray(resumeData.projects) && resumeData.projects.length > 0) {
        let hasContent = false;
        const projParagraphs = [];

        resumeData.projects.forEach(item => {
          if (typeof item === 'string' && item.trim()) {
            hasContent = true;
            projParagraphs.push(new Paragraph({ text: item.trim(), spacing: { after: 100 } }));
          } else if (typeof item === 'object' && item !== null) {
            const name = item.name || item.title || 'Project';
            const link = item.link ? ` (${item.link})` : '';
            hasContent = true;
            projParagraphs.push(
              new Paragraph({
                children: [new TextRun({ text: `${name}${link}`, bold: true })],
                spacing: { before: 100, after: 60 }
              })
            );

            if (Array.isArray(item.description)) {
              item.description.forEach(b => {
                if (typeof b === 'string' && b.trim()) {
                  hasContent = true;
                  projParagraphs.push(
                    new Paragraph({
                      text: `• ${b.trim()}`,
                      indent: { left: 360 },
                      spacing: { after: 40 }
                    })
                  );
                }
              });
            } else if (typeof item.description === 'string' && item.description.trim()) {
              hasContent = true;
              projParagraphs.push(
                new Paragraph({
                  text: item.description.trim(),
                  spacing: { after: 100 }
                })
              );
            }
          }
        });

        if (hasContent) {
          addSectionHeading('Projects');
          docChildren.push(...projParagraphs);
        }
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: docChildren,
        }],
      });

      const buffer = await Packer.toBuffer(doc);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="Optimized_Resume.docx"');
      res.send(buffer);
    } catch (error) {
      console.error('DOCX Generation Error:', error);
      res.status(500).json({ error: 'Failed to generate DOCX' });
    }
});

export default router;
