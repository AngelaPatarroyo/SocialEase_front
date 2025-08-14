import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For now, return the scenarios data directly since we're not connecting to backend yet
    // This matches the structure from your scenarios page
    const scenarios = [
      {
        id: '1',
        title: 'Intro to SocialEase',
        description: 'Get started with your social anxiety journey',
        level: 'beginner',
        status: 'active',
        category: 'introduction',
        xpReward: 10,
        isVR: false
      },
      {
        id: '2',
        title: 'Order at a Cafe',
        description: 'Learn to order food and drinks confidently',
        level: 'beginner',
        status: 'active',
        category: 'service',
        xpReward: 20,
        isVR: false
      },
      {
        id: '3',
        title: 'Greet a Stranger',
        description: 'Practice introducing yourself to someone new',
        level: 'beginner',
        status: 'active',
        category: 'social',
        xpReward: 20,
        isVR: false
      },
      {
        id: '4',
        title: 'Say No Politely',
        description: 'Learn to set boundaries respectfully',
        level: 'beginner',
        status: 'active',
        category: 'boundaries',
        xpReward: 25,
        isVR: false
      },
      {
        id: '5',
        title: 'Start Small Talk',
        description: 'Practice casual conversation starters',
        level: 'beginner',
        status: 'active',
        category: 'conversation',
        xpReward: 25,
        isVR: false
      },
      {
        id: '6',
        title: 'Join Group Conversation',
        description: 'Practice participating in group discussions',
        level: 'beginner',
        status: 'active',
        category: 'group',
        xpReward: 30,
        isVR: true
      },
      {
        id: '7',
        title: 'Talk to a Co-worker',
        description: 'Build confidence in workplace interactions',
        level: 'intermediate',
        status: 'active',
        category: 'workplace',
        xpReward: 30,
        isVR: false
      },
      {
        id: '8',
        title: 'Give a Compliment',
        description: 'Learn to express genuine appreciation',
        level: 'intermediate',
        status: 'active',
        category: 'social',
        xpReward: 30,
        isVR: false
      },
      {
        id: '9',
        title: 'Ask for Help in Public',
        description: 'Practice seeking assistance confidently',
        level: 'intermediate',
        status: 'active',
        category: 'public',
        xpReward: 30,
        isVR: true
      },
      {
        id: '10',
        title: 'Speak Up in a Group',
        description: 'Build confidence in group settings',
        level: 'intermediate',
        status: 'active',
        category: 'group',
        xpReward: 30,
        isVR: false
      },
      {
        id: '11',
        title: 'Make a Phone Call',
        description: 'Practice phone communication skills',
        level: 'advanced',
        status: 'active',
        category: 'communication',
        xpReward: 35,
        isVR: false
      },
      {
        id: '12',
        title: 'Handle Criticism',
        description: 'Learn to receive feedback gracefully',
        level: 'advanced',
        status: 'active',
        category: 'feedback',
        xpReward: 35,
        isVR: false
      },
      {
        id: '13',
        title: 'Disagree Respectfully',
        description: 'Practice expressing different opinions',
        level: 'advanced',
        status: 'active',
        category: 'communication',
        xpReward: 40,
        isVR: false
      },
      {
        id: '14',
        title: 'Mock Interview',
        description: 'Practice job interview scenarios',
        level: 'advanced',
        status: 'active',
        category: 'professional',
        xpReward: 45,
        isVR: true
      },
      {
        id: '15',
        title: 'Attend a Networking Event',
        description: 'Build professional connections confidently',
        level: 'advanced',
        status: 'active',
        category: 'professional',
        xpReward: 45,
        isVR: true
      }
    ];

    return NextResponse.json(scenarios);
  } catch (error) {
    console.error('Error in admin scenarios API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenarios' },
      { status: 500 }
    );
  }
}
