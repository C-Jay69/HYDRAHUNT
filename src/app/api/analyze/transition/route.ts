import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// POST /api/analyze/transition - Analyze career transition feasibility
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume, targetCareer } = body;

    if (!resume || !targetCareer) {
      return NextResponse.json(
        { error: 'Resume and target career are required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Format resume for AI analysis
    const resumeText = `
Name: ${resume.fullName}

Summary:
${resume.summary}

Skills:
${resume.skills.map((s: any) => `- ${s.name} (Level: ${s.level}/5)`).join('\n')}

Experience:
${resume.experience.map((exp: any, i: number) => `
${i + 1}. ${exp.role} at ${exp.company}
   Description: ${exp.description}
`).join('\n')}
    `.trim();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are an expert career transition coach. Analyze career paths, identify transferable skills, and create actionable roadmaps for career changes.',
        },
        {
          role: 'user',
          content: `Analyze the feasibility of transitioning from the current background to a new career path and provide your assessment in this JSON format:
{
  "feasibility": number (0-100 feasibility score),
  "gaps": [array of 3-5 skill/experience gaps],
  "strengths": [array of 3-5 transferable strengths],
  "roadmap": [array of 5-8 actionable steps to make the transition],
  "courses": [array of 5-10 recommended courses/certifications]
}

Target Career: ${targetCareer}

Current Background:
${resumeText}`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const responseText = completion.choices[0]?.message?.content || '{}';

    // Parse JSON response
    let analysisResult;
    try {
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
    console.error('Error analyzing transition:', error);
    return NextResponse.json(
      { error: 'Failed to analyze career transition', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
