export type OpportunityCategory =
  | 'Government'
  | 'Hackathon'
  | 'Internship'
  | 'Private job';

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  category: OpportunityCategory;
  location: string;
  workMode: string;
  description: string;
  longDescription: string;
  deadline: string;
  match: number;
  skills: string[];
  posted: string;
  applyUrl: string;
  accent: string;
};

export const opportunities: Opportunity[] = [
  {
    id: 'ssc-cgl-2026',
    title: 'SSC CGL 2026',
    company: 'Staff Selection Commission',
    category: 'Government',
    location: 'All India',
    workMode: 'On-site',
    description:
      'A high-impact government career path across Group B and Group C roles.',
    longDescription:
      'Start your application with the official Staff Selection Commission portal. Review the latest notice, eligibility requirements, exam dates, and document checklist before submitting.',
    deadline: '23 Aug',
    match: 91,
    skills: ['General awareness', 'Reasoning', 'Quantitative aptitude'],
    posted: '2 days ago',
    applyUrl: 'https://ssc.gov.in/',
    accent: '#e8c979',
  },
  {
    id: 'software-developer-xyz',
    title: 'Software Developer',
    company: 'XYZ Company',
    category: 'Private job',
    location: 'Bangalore',
    workMode: 'Hybrid',
    description:
      'Join a product engineering team building high-impact tools for millions of users.',
    longDescription:
      'Work with a small, thoughtful engineering team on products used every day. The role is a strong fit for someone who enjoys shipping end-to-end and learning in public.',
    deadline: '27 Aug',
    match: 95,
    skills: ['React', 'TypeScript', 'Product thinking'],
    posted: 'Today',
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=software%20developer&location=Bengaluru',
    accent: '#acd9d5',
  },
  {
    id: 'product-design-intern',
    title: 'Product Design Intern',
    company: 'Razorpay',
    category: 'Internship',
    location: 'Bangalore',
    workMode: 'Hybrid',
    description:
      'Help shape the next generation of financial products alongside a generous design team.',
    longDescription:
      'Bring your curiosity and product craft to a team working on meaningful financial tools. Explore the role and portfolio expectations on the official careers site.',
    deadline: '30 Aug',
    match: 88,
    skills: ['Figma', 'User research', 'Interaction design'],
    posted: '3 days ago',
    applyUrl: 'https://razorpay.com/jobs/',
    accent: '#f1b59a',
  },
  {
    id: 'ai-good-hackathon',
    title: 'AI for Good Hackathon',
    company: 'Microsoft Reactor',
    category: 'Hackathon',
    location: 'Online',
    workMode: 'Remote',
    description:
      'Build an AI-powered solution for a real social challenge and learn with a global community.',
    longDescription:
      'Bring a small team or work solo on an idea that uses AI for good. Find the challenge details, schedule, judging criteria, and registration instructions on Devfolio.',
    deadline: '12 Sep',
    match: 84,
    skills: ['AI', 'Prototyping', 'Social impact'],
    posted: '1 week ago',
    applyUrl: 'https://devfolio.co/hackathons',
    accent: '#b9d6c5',
  },
  {
    id: 'sbi-youth-fellowship',
    title: 'SBI Youth Fellowship',
    company: 'SBI Foundation',
    category: 'Government',
    location: 'India',
    workMode: 'On-site',
    description:
      'Spend a year building practical community impact with an interdisciplinary cohort.',
    longDescription:
      'Explore the official fellowship program and learn about the cohort, field work, stipend, and application timeline.',
    deadline: '18 Sep',
    match: 79,
    skills: ['Community', 'Leadership', 'Communication'],
    posted: '4 days ago',
    applyUrl: 'https://www.sbifoundation.in/',
    accent: '#d5c9aa',
  },
  {
    id: 'frontend-engineer-remote',
    title: 'Frontend Engineer',
    company: 'Atlan',
    category: 'Private job',
    location: 'India',
    workMode: 'Remote',
    description:
      'Make data collaboration feel clear, fast, and human for teams around the world.',
    longDescription:
      'Explore the team, open roles, and application requirements on Atlan’s official careers page.',
    deadline: 'Open',
    match: 86,
    skills: ['React', 'Accessibility', 'Design systems'],
    posted: '5 days ago',
    applyUrl: 'https://atlan.com/careers/',
    accent: '#b6c9e5',
  },
];

export const categories: OpportunityCategory[] = [
  'Government',
  'Hackathon',
  'Internship',
  'Private job',
];