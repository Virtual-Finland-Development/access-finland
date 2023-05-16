import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// https://github.com/mozilla/pdf.js/issues/8305
// @ts-ignore
GlobalWorkerOptions.workerSrc = (async () => {
  try {
    // @ts-ignore
    return await import('pdfjs-dist/build/pdf.worker.entry');
  } catch (error) {
    return 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.js';
  }
})();

function isValidTextItem(item: any): item is TextItem {
  return Boolean(item.str);
}

// Extract all text content from a PDF file
export async function extractPdfTextContent(data: any) {
  try {
    const pdf = await getDocument(data).promise;

    const pages = [];

    for (let i = 0; i < pdf.numPages; i++) {
      pages.push(i + 1);
    }

    const getPageContent = async (pageNumber: number) => {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      return content.items
        .map(item => {
          if (isValidTextItem(item)) {
            return item.str;
          }
          return '';
        })
        .join(' ');
    };

    const pdfTextContent = (await Promise.all(pages.map(getPageContent))).join(
      '\r\n'
    );

    return pdfTextContent;
  } catch (error: any) {
    throw new Error(
      `Could not parse document: ${
        error?.message || 'unexpected error occured'
      }`
    );
  }
}

// "Convert" RTF text to plain text, not a very robust solution...
// Use rtf.js to convert RTF ArrayBuffer to html elements, loop trough all elements and parse text contents from them.
// There seems to be no better way (in browser) to do this, other than using some regex hacks for RTF files, which do not work correclty.
// Idea came from here: https://stackoverflow.com/questions/51096049/how-can-i-get-the-text-from-a-word-document-with-rtf-extension
export async function convertRtfToPlainText(rtf: ArrayBuffer) {
  try {
    const rtfjsModule = await import('rtf.js');
    rtfjsModule.RTFJS.loggingEnabled(false);
    const doc = new rtfjsModule.RTFJS.Document(rtf, {});
    const contents: string[] = [];

    const htmlElements = await doc.render();

    for (let el of htmlElements) {
      if (el.textContent) {
        contents.push(el.textContent);
      }
    }

    return contents.join(' ');
  } catch (error: any) {
    throw new Error(
      `Could not parse document: ${
        error?.message || 'unexpected error occured'
      }`
    );
  }
}
