import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// POST /api/analyze/resume - Analyze a resume with AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume, targetJob, analysisType = 'general' } = body;

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Format resume for AI analysis
    const resumeText = `
Name: ${resume.fullName}
Email: ${resume.email}
Phone: ${resume.phone}
Location: ${resume.location}
Website: ${resume.website || 'N/A'}

Summary:
${resume.summary}

Skills:
${resume.skills.map((s: any) => `- ${s.name} (Level: ${s.level}/5)`).join('\n')}

Experience:
${resume.experience.map((exp: any, i: number) => `
${i + 1}. ${exp.role} at ${exp.company}
   Period: ${exp.startDate} - ${exp.endDate}
   Description: ${exp.description}
`).join('\n')}

Education:
${resume.education.map((edu: any, i: number) => `
${i + 1}. ${edu.degree} from ${edu.school}
   Year: ${edu.year}
`).join('\n')}
    `.trim();

    let systemPrompt = '';
    let userPrompt = '';

    if (analysisType === 'general') {
      systemPrompt = 'You are an expert resume analyst and career coach. Analyze resumes for strengths, weaknesses, and provide actionable feedback.';
      userPrompt = `Analyze this resume and provide a comprehensive assessment in the following JSON format:
{
  "overallScore": number (0-100),
  "strengths": [array of 3-5 key strengths],
  "weaknesses": [array of 3-5 areas for improvement],
  "suggestions": [array of 5-8 specific, actionable recommendations]
}

Resume to analyze:
${resumeText}`;
    } else if (analysisType === 'job-fit') {
      if (!targetJob) {
        return NextResponse.json(
          { error: 'Target job is required for job-fit analysis' },
          { status: 400 }
        );
      }
      systemPrompt = 'You are an expert hiring manager and ATS system evaluator. Evaluate how well a resume matches a specific job description.';
      userPrompt = `Evaluate how well this resume matches the target job and provide your assessment in this JSON format:
{
  "score": number (0-100 compatibility score),
  "critique": "detailed feedback on fit",
  "strengths": [array of 3-5 strengths for this role],
  "weaknesses": [array of 3-5 gaps for this role],
  "improvements": [array of 5-8 specific recommendations to improve fit]
}

Target Job: ${targetJob}

Resume:
${resumeText}`;
    } else if (analysisType === 'ats') {
      systemPrompt = 'You are an expert ATS (Applicant Tracking System) analyst. Evaluate resumes for ATS compatibility.';
      userPrompt = `Analyze this resume for ATS compatibility and provide your assessment in this JSON format:
{
  "score": number (0-100 ATS score),
  "passAts": boolean (will this pass most ATS systems?),
  "keywords": {
    "found": [array of important keywords found],
    "missing": [array of important keywords that should be added]
  },
  "issues": [array of 3-5 ATS issues],
  "suggestions": [array of 5-8 specific ATS recommendations]
}

Resume:
${resumeText}`;
    } else {
      return NextResponse.json(
        { error: 'Invalid analysis type. Use: general, job-fit, or ats' },
        { status: 400 }
      );
    }

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const responseText = completion.choices[0]?.message?.content || '{}';

    // Parse JSON response
    let analysisResult;
    try {
      // Extract JSON from response if there's extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : responseText;
      analysisResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysisResult = {
        error: 'Failed to parse AI response',
        rawResponse: responseText,
      };
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
