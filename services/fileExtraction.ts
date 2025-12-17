
// Shared service for file text extraction

export const extractTextFromFile = async (file: File): Promise<string> => {
    const fileName = file.name.toLowerCase();

    return new Promise((resolve, reject) => {
        // PDF Handling
        if (fileName.endsWith('.pdf')) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    // @ts-ignore
                    const pdfjsLib = window.pdfjsLib;
                    if (!pdfjsLib) throw new Error("PDF Library not loaded. Check internet connection.");

                    const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        // @ts-ignore
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }
                    resolve(fullText);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
        } 
        // DOCX Handling
        else if (fileName.endsWith('.docx')) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    // @ts-ignore
                    const mammoth = window.mammoth;
                    if (!mammoth) throw new Error("DOCX Library not loaded. Check internet connection.");

                    const result = await mammoth.extractRawText({ arrayBuffer: event.target?.result });
                    resolve(result.value);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
        } 
        // Plain Text / JSON / Markdown Handling
        else {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = (err) => reject(err);
            reader.readAsText(file);
        }
    });
};
