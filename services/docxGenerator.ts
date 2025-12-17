
// @ts-ignore
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import saveAs from 'file-saver';
import { ResumeData } from '../types';

export const downloadDocx = async (data: ResumeData) => {
    try {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Header: Name
                    new Paragraph({
                        text: data.fullName.toUpperCase(),
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 }
                    }),
                    // Header: Title
                    new Paragraph({
                        text: data.title,
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 }
                    }),
                    // Contact Info
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: `${data.email} | ${data.phone} | ${data.location}`, size: 20 }),
                            new TextRun({ text: data.website ? ` | ${data.website}` : "", size: 20 }),
                        ],
                        border: {
                            bottom: { color: "000000", space: 1, value: BorderStyle.SINGLE, size: 6 }
                        },
                        spacing: { after: 400 }
                    }),

                    // Summary
                    new Paragraph({
                        text: "PROFESSIONAL SUMMARY",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        text: data.summary,
                        spacing: { after: 300 }
                    }),

                    // Experience
                    new Paragraph({
                        text: "WORK EXPERIENCE",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 100 }
                    }),
                    ...data.experience.flatMap(exp => [
                        new Paragraph({
                            children: [
                                new TextRun({ text: exp.role, bold: true, size: 24 }),
                                new TextRun({ text: ` | ${exp.company}`, size: 24 }),
                            ],
                            spacing: { before: 100 }
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: `${exp.startDate} - ${exp.endDate}`, italics: true, size: 20 }),
                            ],
                            spacing: { after: 50 }
                        }),
                        new Paragraph({
                            text: exp.description,
                            spacing: { after: 200 }
                        })
                    ]),

                    // Education
                    new Paragraph({
                        text: "EDUCATION",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 100 }
                    }),
                    ...data.education.map(edu => 
                        new Paragraph({
                            children: [
                                new TextRun({ text: edu.school, bold: true }),
                                new TextRun({ text: ` - ${edu.degree}`, italics: true }),
                                new TextRun({ text: ` (${edu.year})` }),
                            ],
                            spacing: { after: 100 }
                        })
                    ),

                    // Skills
                    new Paragraph({
                        text: "SKILLS",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 100 }
                    }),
                    new Paragraph({
                        text: data.skills.map(s => s.name).join(" • "),
                        spacing: { after: 100 }
                    })
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${data.fullName.replace(/\s+/g, '_')}_Resume.docx`);
    } catch (e) {
        console.error("DOCX Generation Error:", e);
        alert("Failed to generate DOCX. Please try again.");
    }
};
