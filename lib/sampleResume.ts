import type { ResumeData } from './types';

/**
 * Lighthearted placeholder data shown when someone opens the builder.
 * Intentionally short so it's easy to wipe and replace. Not real.
 */
export const sampleResume: ResumeData = {
  header: {
    name: 'John Doe',
    title: 'Senior Vice President of Doing Things',
    org: 'Things LLC',
    experience: '12+ years of confidently clicking buttons',
  },
  about: {
    summary: [
      'Results-driven thought leader who synergizes paradigms and, on a good day, ships code.',
      'Fluent in buzzwords. Allergic to meetings that could have been an email.',
    ],
  },
  skills: [
    'Buzzword Fluency',
    'Advanced Googling',
    'Copy & Paste',
    'Confident Nodding',
    'Meeting Survival',
    'Turning It Off and On Again',
  ],
  experience: [
    {
      title: 'Senior Vice President of Doing Things',
      company: 'Things LLC',
      dates: 'Jan 2022 - Present',
      location: 'Remote (the couch)',
      duration: 'a while',
      description: [
        'Synergized cross-functional paradigms until everyone stopped asking questions.',
        'Turned three meetings into one email. Was hailed as a hero.',
      ],
      skills: ['Synergy', 'Buzzword Fluency'],
    },
    {
      title: 'Sr. Engineer (Code Monkey)',
      company: 'ShipShip Inc.',
      dates: 'Jun 2018 - Dec 2021',
      location: 'Cubicle 7B',
      duration: '3 yrs 6 mos',
      description: [
        'Shipped a ship that ships ships. Twice.',
        'Fixed the bug by turning it off and on again.',
      ],
      skills: ['Copy & Paste', 'Confident Nodding'],
    },
  ],
  highlight: {
    title: 'Podcast: Two Devs, One Bug',
    meta: '2023 - Present · allegedly live',
    description: 'Co-host of a podcast where we argue about tabs vs spaces for 45 minutes per episode.',
  },
  certifications: [
    { name: 'Certified Professional Button Clicker', institution: 'University of Stack Overflow', date: 'Self-Awarded' },
  ],
  contact: {
    location: 'The Cloud ☁️',
    email: 'john.doe@example.com',
  },
};
