import { ChatContextPayload } from '../../types/chat';

export interface AIResponseResult {
  content: string;
  quickReplies?: string[];
  actionLink?: {
    label: string;
    page: string;
  };
}

export const generateIntelligentFallbackResponse = (
  rawQuery: string,
  context: ChatContextPayload
): AIResponseResult => {
  const query = rawQuery.toLowerCase().trim();

  // 1. Security Check: State manipulation attempt (e.g. "set score to 100", "make me verified", "hack score")
  if (
    query.includes('set my') ||
    query.includes('change my score') ||
    query.includes('give me 100') ||
    query.includes('make me verified') ||
    query.includes('edit score') ||
    query.includes('modify score') ||
    query.includes('fake verification') ||
    query.includes('bypass test')
  ) {
    return {
      content: `I cannot manually modify, fabricate, or adjust assessment scores or verification statuses. On RecruitCred, all scores and verification hashes (e.g. \`RC-V92-PYT\`) are issued exclusively through standardized, proctored code evaluations to ensure authentic credibility for campus recruiters. You can take or retake an official assessment anytime to update your verified score.`,
      quickReplies: ['Prepare for Verification', 'Browse Assessments', 'Understand My Credibility Score'],
      actionLink: { label: 'Go to Assessments', page: 'assessments' }
    };
  }

  // 2. Improve My Profile ("How can I improve my profile?", "Improve My Profile", "Profile completion")
  if (
    query.includes('improve my profile') ||
    query.includes('improve profile') ||
    query.includes('profile completion') ||
    query.includes('profile tips') ||
    query.includes('boost profile')
  ) {
    const unverifiedSuggestion = (context.claimedSkills && context.claimedSkills.length > 0) ? context.claimedSkills[0] : 'Python';
    
    return {
      content: `Here are 3 concrete steps to improve your RecruitCred profile:\n\n1. **Verify ${unverifiedSuggestion}**: Take the standardized assessment to turn your self-claimed skill into a verified badge.\n2. **Add Project Evidence**: Attach GitHub repositories with active commit logs to your projects.\n3. **Complete Assessments**: Aim for ≥80% on core technical assessments to rank higher in recruiter searches.`,
      quickReplies: [`Verify ${unverifiedSuggestion}`, 'Add Project Evidence', 'Understand My Credibility Score'],
      actionLink: { label: 'Verify Skills Now', page: 'skills' }
    };
  }

  // 3. Understand My Credibility Score ("Understand my credibility score", "What is my score?", "Credibility calculation")
  if (
    query.includes('credibility score') ||
    query.includes('understand my credibility') ||
    query.includes('how is score calculated') ||
    query.includes('my score') ||
    query.includes('credibility rating')
  ) {
    return {
      content: `Your credibility rating is currently **${context.overallScore}%** based on:\n\n• **Verified Skills**: ${context.skillsCount.verified} verified competencies (objective timed assessments).\n• **Claimed Skills**: ${context.skillsCount.claimed} self-reported skills awaiting verification.\n• **Project Evidence**: ${context.projectsCount} project repositories attached.\n\nRecruiters value verified skills over claimed skills because they are backed by verifiable test proof.`,
      quickReplies: ['Prepare for Verification', 'Add Project Evidence', 'Improve My Profile'],
      actionLink: { label: 'View Profile', page: 'profile' }
    };
  }

  // 4. Add Project Evidence ("Add project evidence", "How to add evidence", "GitHub evidence")
  if (
    query.includes('project evidence') ||
    query.includes('add evidence') ||
    query.includes('add project') ||
    query.includes('github proof') ||
    query.includes('repository proof')
  ) {
    return {
      content: `To build credible project evidence on RecruitCred:\n\n1. **Connect GitHub**: Link public repositories with authentic commit histories and clean documentation.\n2. **Tag Verified Skills**: Associate each project with the specific skills you used (e.g. React, Python).\n3. **Live Demonstration**: Provide deployed links or video walk-throughs to showcase execution capability.`,
      quickReplies: ['Improve My Profile', 'Prepare for Verification', 'Browse Opportunities'],
      actionLink: { label: 'Go to Skills & Proof', page: 'skills' }
    };
  }

  // 5. Prepare for Verification ("Prepare for verification", "How to get verified", "Skill verification")
  if (
    query.includes('prepare for verification') ||
    query.includes('skill verification') ||
    query.includes('get verified') ||
    query.includes('how verification works') ||
    query.includes('what is verification') ||
    query.includes('verification process')
  ) {
    const prioritySkill = (context.claimedSkills && context.claimedSkills.length > 0) ? context.claimedSkills[0] : 'Python';
    return {
      content: `RecruitCred verification validates your practical technical capabilities:\n\n• **Assessment Format**: 8–10 timed questions covering syntax, logic analysis, and code output under a countdown timer.\n• **Passing Threshold**: 70% accuracy generates an official \`RC-V\` verification hash.\n• **Suggested First Test**: Take the **${prioritySkill}** assessment to convert your self-claim into verified proof.`,
      quickReplies: [`Take ${prioritySkill} Test`, 'Browse Assessments', 'Understand My Credibility Score'],
      actionLink: { label: 'Start Skill Assessment', page: 'assessments' }
    };
  }

  // 6. Find Relevant Opportunities ("Find relevant opportunities", "Opportunities", "Internships", "Placements", "Hackathons")
  if (
    query.includes('opportunity') ||
    query.includes('opportunities') ||
    query.includes('placement') ||
    query.includes('internship') ||
    query.includes('companies') ||
    query.includes('hackathon') ||
    query.includes('campus drive') ||
    query.includes('jobs')
  ) {
    return {
      content: `RecruitCred matches opportunities based on your verified skills and college discipline:\n\n• **Campus Placement Drives**: Visiting companies looking for verified technical stacks.\n• **Internships**: Summer & winter developer internships.\n• **Hackathons & Challenges**: University and national competitions to build project evidence.\n\nCandidates with verified skills receive priority visibility in recruiter shortlists.`,
      quickReplies: ['Find Teammates', 'Prepare for Verification', 'Understand RecruitCred Pro'],
      actionLink: { label: 'View Opportunities', page: 'dashboard' }
    };
  }

  // 7. Find Teammates ("Find teammates", "Find team", "Create team", "Squad matching")
  if (
    query.includes('teammate') ||
    query.includes('find team') ||
    query.includes('create team') ||
    query.includes('hackathon squad') ||
    query.includes('find student') ||
    query.includes('find skills')
  ) {
    return {
      content: `RecruitCred's teammate matching engine pairs students based on **complementary skills**:\n\n• Match Frontend developers with verified Backend or ML engineers.\n• Review peer verification badges and commit history before inviting.\n• Dispatch 5-minute pre-acceptance skill challenges to ensure squad balance.`,
      quickReplies: ['Find Teammates', 'My Teams', 'Improve My Profile'],
      actionLink: { label: 'Find Teammates', page: 'find-teammates' }
    };
  }

  // 8. Understand RecruitCred Pro ("Understand RecruitCred Pro", "RecruitCred Pro", "Pro features")
  if (
    query.includes('recruitcred pro') ||
    query.includes('pro features') ||
    query.includes('what is pro') ||
    query.includes('pro plan') ||
    query.includes('buy credibility')
  ) {
    return {
      content: `**RecruitCred Pro** provides enhanced visibility and analytics for students:\n\n• **Priority Recruiter Visibility**: Top-tier placement in candidate search feeds.\n• **In-depth Profile Analytics**: See which recruiters and placement officers viewed your credentials.\n\n⚠️ **Important**: Pro gives you visibility, but **Pro cannot buy credibility**. All verification badges must be earned through objective assessments.`,
      quickReplies: ['Improve My Profile', 'Prepare for Verification', 'Understand My Credibility Score']
    };
  }

  // 9. Meaning of Verified vs Claimed ("What does verified mean?", "Understand Verification")
  if (
    query.includes('what does verified mean') ||
    query.includes('understand verification') ||
    query.includes('verified vs claimed') ||
    query.includes('difference between') ||
    query.includes('what is verified')
  ) {
    return {
      content: `On RecruitCred, there is a clear distinction between claims and evidence:\n\n• **CLAIMED (○)**: Self-reported skills listed on a resume with no objective test verification.\n• **VERIFIED (✓)**: Competencies validated through timed code assessments, backed by an immutable verification hash (e.g. \`RC-V92-PYT\`).\n• **EVIDENCE-BACKED**: Projects connected to live GitHub repositories with verifiable commit histories.`,
      quickReplies: ['Prepare for Verification', 'Understand My Credibility Score', 'How RecruitCred Works']
    };
  }

  // 10. How RecruitCred Works ("How RecruitCred Works", "RecruitCred Overview")
  if (
    query.includes('how recruitcred works') ||
    query.includes('recruitcred overview') ||
    query.includes('how does it work') ||
    query.includes('about recruitcred')
  ) {
    return {
      content: `RecruitCred creates a transparent credibility layer for campus recruitment in 4 simple steps:\n\n1. **Claim**: List technical skills and projects.\n2. **Provide Evidence**: Connect GitHub repos and competitive profiles.\n3. **Assess**: Take proctored, standardized code evaluations.\n4. **Verify & Match**: Earn cryptographic proof badges (\`RC-V...\`) that recruiters and placement cells trust.`,
      quickReplies: ['Improve My Profile', 'Prepare for Verification', 'Find Teammates']
    };
  }

  // 11. Recruiter: Find Candidates ("Find Candidates", "Show me candidates with verified Python skills")
  if (
    query.includes('find candidates') ||
    query.includes('search candidates') ||
    query.includes('filter candidates')
  ) {
    return {
      content: `You can search and filter campus candidates by verified skills (e.g. Python >85%, React >80%) in the **Candidate Directory**. Candidates display match compatibility, verified proof badges, and repository evidence.`,
      quickReplies: ['Browse Candidates', 'Compare Candidates', 'Understand Verification'],
      actionLink: { label: 'Go to Candidate Directory', page: 'find-teammates' }
    };
  }

  // 12. Recruiter: Compare Candidates ("Compare Candidates")
  if (
    query.includes('compare candidates') ||
    query.includes('compare') ||
    query.includes('candidate comparison')
  ) {
    return {
      content: `When comparing candidates, evaluate 3 key pillars:\n\n1. **Standardized Assessment Scores**: Objective measure of technical problem-solving ability.\n2. **Project Code Artifacts**: Evaluates architecture, commit history, and real implementation skills.\n3. **Complementary Skill Fit**: Checks whether their verified skills balance your existing team gaps.`,
      quickReplies: ['Find Candidates', 'Understand Verification', 'Understand RecruitCred Pro']
    };
  }

  // Default helpful response
  return {
    content: `I'm CredAI, your RecruitCred Assistant! I can help you understand your credibility score, prepare for skill verification, add project evidence, explore opportunities, find teammates, or learn about RecruitCred Pro.`,
    quickReplies: [
      'Improve My Profile',
      'Understand My Credibility Score',
      'Prepare for Verification',
      'Find Relevant Opportunities',
      'Find Teammates'
    ]
  };
};
