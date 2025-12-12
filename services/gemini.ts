
import { GoogleGenAI, Chat } from "@google/genai";
import { ResumeData } from '../types';

const getAiClient = () => {
  try {
    // Priority: Env Var -> Hardcoded fallback (User provided key)
    const apiKey = process.env.API_KEY || 'AIzaSyChwGMOZvW1cLKslxqYJkSo0z7aQxeX67c';
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn("process.env not accessible");
    return null;
  }
};

export const analyzeResume = async (resume: ResumeData): Promise<string> => {
  try {
    const ai = getAiClient();
    if (!ai) return "API Key not found. Cannot analyze resume.";

    const prompt = `
      You are a strict but helpful career coach with a "Cyber-Punk" persona. 
      Review the following resume data and provide a short, punchy critique (max 100 words).
      Give it a score out of 100.
      Highlight 1 key strength and 1 key improvement.
      
      Resume Data:
      ${JSON.stringify(resume, null, 2)}
      
      Format your response like this:
      SCORE: [Score]/100
      VIBE CHECK: [Critique]
      POWER MOVE: [Strength]
      GLITCH FIX: [Improvement]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Error connecting to the mainframe. AI analysis unavailable.";
  }
};

export interface DetailedAnalysis {
  score: number;
  critique: string;
  improvements: string[];
}

export const analyzeResumeForJob = async (resume: ResumeData, targetJob: string): Promise<DetailedAnalysis | null> => {
  try {
    const ai = getAiClient();
    if (!ai) return null;

    const prompt = `
      Act as a senior hiring manager for the role of: "${targetJob}".
      Analyze this resume.
      
      Resume Data:
      ${JSON.stringify(resume, null, 2)}
      
      Return a JSON object with:
      - score: number (0-100)
      - critique: string (short summary of fit)
      - improvements: string[] (3-5 specific bullet points on what to change to fit the "${targetJob}" role better)
      
      Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const jsonString = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Detailed analysis failed:", error);
    return null;
  }
};

export const suggestBestRoles = async (resume: ResumeData): Promise<string[]> => {
  try {
    const ai = getAiClient();
    if (!ai) return ["Error connecting to AI"];

    const prompt = `
      You are an expert career strategist.
      Analyze the skills, experience, and summary of the following resume.
      Suggest the top 3 specific job titles this candidate is BEST suited for right now.
      For each title, add a very brief (5-10 words) explanation of why.
      
      Resume Data:
      ${JSON.stringify(resume, null, 2)}
      
      Return ONLY a JSON array of strings.
      Example: ["Senior Frontend Dev (Strong React skills)", "UI Engineer (Design background)", "Tech Lead (Leadership exp)"]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const jsonString = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!jsonString) return ["Could not generate suggestions"];
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Role suggestion failed:", error);
    return ["Analysis Failed"];
  }
};

export interface TransitionAnalysis {
  currentRole: string;
  targetRole: string;
  transferableSkills: string[];
  missingSkills: string[];
  resources: {
    name: string;
    provider: string; // e.g. Coursera, Udemy, University
    type: string; // Course, Cert, Degree
    description: string;
  }[];
}

export const analyzeCareerTransition = async (resume: ResumeData, targetCareer: string): Promise<TransitionAnalysis | null> => {
  try {
    const ai = getAiClient();
    if (!ai) return null;

    const prompt = `
      You are an expert Career Transition Coach.
      The user wants to transition from their current profile (based on resume) to a new career in: "${targetCareer}".
      
      Analyze their Resume:
      ${JSON.stringify(resume, null, 2)}
      
      Provide a JSON object with the following structure:
      {
        "currentRole": "string (inferred from resume)",
        "targetRole": "${targetCareer}",
        "transferableSkills": ["string", "string"], // Skills they ALREADY have that are useful for the new role
        "missingSkills": ["string", "string"], // Critical skills they are missing
        "resources": [
           {
             "name": "string (Specific course/cert name)",
             "provider": "string (e.g. Coursera, edX, University, FreeCodeCamp)",
             "type": "string (e.g. Online Course, Certification, Degree)",
             "description": "string (Short reason why this helps)"
           }
        ]
      }
      
      Directives:
      1. Be specific with "resources". Suggest real, popular courses or certifications (e.g., Google Cybersecurity Cert, AWS Solutions Architect).
      2. Identify at least 3 transferable skills and 3 missing skills.
      3. Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const jsonString = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!jsonString) return null;
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Transition analysis failed", error);
    return null;
  }
};

export interface JobListing {
  title: string;
  company: string;
  location: string;
  matchScore: number;
  url: string;
}

export const findJobsWithSearch = async (resume: ResumeData, location: string, preferences: string): Promise<JobListing[]> => {
  try {
    const ai = getAiClient();
    if (!ai) return [];

    const prompt = `
      Find 5 real, active job listings relevant to this candidate in ${location || "Remote"}.
      User Preferences: ${preferences}
      
      Resume Summary: ${resume.summary}
      Skills: ${resume.skills.map(s => s.name).join(', ')}
      
      Use Google Search to find real listings.
      Return a JSON array of objects.
      Structure:
      [
        {
          "title": "Job Title",
          "company": "Company Name",
          "location": "Location",
          "matchScore": 85, (0-100 based on resume fit)
          "url": "URL to job posting"
        }
      ]
      
      Important:
      - If you cannot find a direct apply URL, provide the search result URL.
      - Ensure the output is valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        // Note: responseSchema not supported with googleSearch in all regions/models, 
        // relying on prompt instruction for JSON structure.
      }
    });

    // Extract JSON from response text (which might contain grounding text)
    const text = response.text || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback: If JSON parsing fails, try to construct from grounding chunks or return mock data
    // For this implementation, we will try to parse loosely or return empty
    return [];

  } catch (error) {
    console.error("Job search failed", error);
    return [];
  }
};

export const createChatSession = (resume: ResumeData, additionalContext: string = ''): Chat | null => {
  try {
    const ai = getAiClient();
    if (!ai) return null;

    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are a helpful, cyber-punk themed career coach assistant named "VibeBot". 
        You have access to the user's resume data provided below.
        Always answer questions specifically based on their resume context.
        Keep answers punchy, helpful, and encouraging.
        
        RESUME CONTEXT:
        ${JSON.stringify(resume)}
        
        ${additionalContext ? `CURRENT ANALYSIS/CONTEXT:\n${additionalContext}` : ''}
        `,
      }
    });
  } catch (error) {
    console.error("Chat creation failed:", error);
    return null;
  }
};

export const optimizeResumeForJob = async (resume: ResumeData, targetJob: string, suggestions: string[]): Promise<ResumeData | null> => {
  try {
    const ai = getAiClient();
    if (!ai) return null;

    const prompt = `
      You are an expert resume writer. 
      Rewrite the provided resume data to perfectly target the role of "${targetJob}".
      
      Apply these suggestions:
      ${suggestions.join('\n')}
      
      Resume Data to Rewrite:
      ${JSON.stringify(resume, null, 2)}
      
      Directives:
      1. Rewrite the "summary" to be impactful and relevant to ${targetJob}.
      2. Rewrite "experience" descriptions to highlight relevant achievements. Use strong action verbs.
      3. Re-order or add/remove "skills" to match the job.
      4. Keep personal info (name, email, etc.) unchanged.
      5. Return the FULL JSON object matching the ResumeData structure exactly.
      
      Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const jsonString = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Optimization failed:", error);
    return null;
  }
};

export const parseResumeFromText = async (text: string): Promise<Partial<ResumeData> | null> => {
  try {
    const ai = getAiClient();
    if (!ai) throw new Error("API Key missing");

    const prompt = `
      You are an expert data extraction AI.
      Extract resume information from the text provided below and return it as a JSON object.
      The JSON must match the following structure exactly.
      
      Required JSON Structure:
      {
        "fullName": "string",
        "title": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "website": "string",
        "summary": "string",
        "experience": [
          {
            "company": "string",
            "role": "string",
            "startDate": "string",
            "endDate": "string",
            "description": "string"
          }
        ],
        "education": [
          {
            "school": "string",
            "degree": "string",
            "year": "string"
          }
        ],
        "skills": [
          {
            "name": "string",
            "level": 3 
          }
        ]
      }

      Directives:
      1. Return ONLY valid JSON. Do not include markdown formatting (like \`\`\`json).
      2. If a field is not found in the text, leave it as an empty string or empty array.
      3. Summarize long descriptions to be punchy and effective.
      4. Infer skill levels (1-5) if possible, otherwise default to 3.
      
      Resume Text to Parse:
      ${text.substring(0, 30000)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const jsonString = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!jsonString) return null;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini parsing failed:", error);
    return null;
  }
};
