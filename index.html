import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => it.str).join(" ") + "\n\n";
  }
  return text.trim();
}

async function extractDocxText(file) {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return (result.value || "").trim();
}

async function extractTxtText(file) {
  return (await file.text()).trim();
}

/**
 * Extract plain text from a File object. Supports .txt, .pdf, .docx.
 * Throws a descriptive Error for unsupported types or parse failures.
 */
export async function extractTextFromFile(file) {
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith(".txt")) return await extractTxtText(file);
    if (name.endsWith(".pdf")) return await extractPdfText(file);
    if (name.endsWith(".docx")) return await extractDocxText(file);
  } catch (err) {
    throw new Error(`Couldn't read "${file.name}" — the file may be corrupted, scanned-image-only, or password protected.`);
  }
  throw new Error(`Unsupported file type: "${file.name}". Please upload a .txt, .pdf, or .docx file.`);
}
