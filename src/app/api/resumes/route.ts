import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/resumes - Get all resumes for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const resumes = await db.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    // Parse JSON fields
    const parsedResumes = resumes.map(resume => ({
      ...resume,
      experience: JSON.parse(resume.experienceJson || '[]'),
      education: JSON.parse(resume.educationJson || '[]'),
      skills: JSON.parse(resume.skillsJson || '[]'),
    }));

    return NextResponse.json(parsedResumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

// POST /api/resumes - Create a new resume
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      title,
      folder,
      fullName,
      email,
      phone,
      location,
      website,
      summary,
      templateId,
      experience,
      education,
      skills,
    } = body;

    if (!userId || !fullName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resume = await db.resume.create({
      data: {
        userId,
        title: title || 'Untitled Resume',
        folder: folder || 'General',
        fullName,
        email,
        phone: phone || '',
        location: location || '',
        website: website || null,
        summary: summary || '',
        templateId: templateId || 'cyber',
        experienceJson: JSON.stringify(experience || []),
        educationJson: JSON.stringify(education || []),
        skillsJson: JSON.stringify(skills || []),
        lethalityScore: 0,
      },
    });

    // Return parsed resume
    const parsedResume = {
      ...resume,
      experience: JSON.parse(resume.experienceJson),
      education: JSON.parse(resume.educationJson),
      skills: JSON.parse(resume.skillsJson),
    };

    return NextResponse.json(parsedResume, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
