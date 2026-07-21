import { PDFParse } from 'pdf-parse';

/**
 * Extracts plain text from a given PDF buffer.
 * @param {Buffer} fileBuffer - The buffer of the PDF file
 * @returns {Promise<string>} The extracted text
 */
export async function extractTextFromPDF(fileBuffer) {
  let parser = null;
  try {
    parser = new PDFParse({ data: fileBuffer });
    const data = await parser.getText();
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF appears to be empty or contains only images (scanned document).');
    }

    // Clean up the text: remove excessive newlines and weird spaces
    let cleanText = data.text
      .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with a single newline
      .replace(/\r/g, '')        // Remove carriage returns
      .replace(/[^\x20-\x7E\n\t]/g, ''); // Remove non-printable characters

    return cleanText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}
