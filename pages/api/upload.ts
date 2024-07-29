import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js's body parsing to use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  
  form.uploadDir = path.join(process.cwd(), '/public/uploads'); // Set upload directory
  form.keepExtensions = true; // Keep file extensions

  // Parse the form
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }

    // Check if file is uploaded
    if (!files.file) {
      res.status(400).json({ success: false, missingFields: ['file'] });
      return;
    }

    // Handle file and fields
    res.status(200).json({ success: true, fields, files });
  });
}
