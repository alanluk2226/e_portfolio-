export const workExperience = [
  {
    company: 'Starrycraze Technology Limited',
    role: 'AI & Full-Stack Engineer Intern',
    period: 'Mar 2026 — Jul 2026',
    location: 'Internship',
    bullets: [
      'Wrote documentation for an internal tool I had built, to support handoff and onboarding with the engineering team.',
      'Early in the internship, collaborated with engineers to improve the product dashboard — shipping new features and localizing the UI into English, Simplified Chinese, and Traditional Chinese.',
      'Later produced a promotional video for leadership using Seedance 2.0 together with CapCut.',
      'Ran day-to-day social operations across Instagram, YouTube, and Threads; over about 1.5 months on YouTube, grew the channel to 109 subscribers and ~96K views.',
      'Developed the company marketing landing page with Three.js interactive visuals and a responsive product narrative (starrycraze.com).',
    ],
  },
]

export const myProjects = [
  {
    title: 'Pop Culture Auto-Post Bot',
    tags: ['Internship'],
    images: [
      { src: '/assets/images/autopost-discord-review.png', alt: 'Internal review workflow preview' },
      { src: '/assets/images/autopost-news-embed.png', alt: 'Generated content preview' },
      { src: '/assets/images/autopost-shorts-preview.png', alt: 'Short-form media preview' },
    ],
    description:
      'Internship project at Starrycraze Technology Limited: an internal entertainment content automation system with AI-assisted production and human approval before publishing. Technical and operational details are confidential.',
    credentials: null,
    links: [],
  },
  {
    title: 'StarryCraze Landing Page',
    tags: ['Internship', 'Three.js', 'JavaScript', 'Landing Page', 'Responsive UI'],
    images: [
      { src: '/assets/images/starrycraze-landing.png', alt: 'StarryCraze landing page with Three.js hero' },
    ],
    description:
      'Company marketing site for StarryCraze — an entertainment AI agent product. Built an interactive landing experience with Three.js visuals, clear product storytelling, and responsive layout to introduce star tracking and messaging-app entry points.',
    credentials: null,
    links: [
      { label: 'Live Site', href: 'https://starrycraze.com/' },
    ],
  },
  {
    title: 'WorkHard — Fitness Platform',
    tags: ['Node.js', 'Express', 'MongoDB', 'EJS', 'REST API', 'Render'],
    images: [
      { src: '/assets/images/workout.png', alt: 'WorkHard dashboard' },
      { src: '/assets/images/workout2.png', alt: 'WorkHard courses' },
      { src: '/assets/images/workout3.png', alt: 'WorkHard workout tracking' },
      { src: '/assets/images/workout4.png', alt: 'WorkHard analytics' },
      { src: '/assets/images/workout5.png', alt: 'WorkHard mobile view' },
      { src: '/assets/images/Mongodb1.png', alt: 'MongoDB schema overview' },
      { src: '/assets/images/mongodb2.png', alt: 'MongoDB collections' },
      { src: '/assets/images/mongodb3.png', alt: 'MongoDB query view' },
      { src: '/assets/images/mongodb4.png', alt: 'MongoDB data model' },
      { src: '/assets/images/API1.png', alt: 'API endpoint overview' },
      { src: '/assets/images/API2.png', alt: 'API authentication' },
      { src: '/assets/images/API3.png', alt: 'API course routes' },
      { src: '/assets/images/API4.png', alt: 'API workout routes' },
      { src: '/assets/images/API5.png', alt: 'API admin routes' },
    ],
    description:
      'Full-stack fitness platform with authentication, course enrollment, workout CRUD, progress analytics, and an admin console for courses, coaches, and users. Built with a responsive UI so the timetable and core flows work on mobile.',
    credentials:
      'Demo — user: test123456 / 123456\nDemo — admin: admin123456 / 123456\nNote: avoid “Remember me” on the admin login.',
    links: [
      { label: 'Live Demo', href: 'https://workhard-b5zs.onrender.com/' },
      { label: 'GitHub', href: 'https://github.com/alanluk2226/Workhard' },
    ],
  },
  {
    title: 'HKschool — School Directory App',
    tags: ['React Native', 'Mobile', 'Group Project'],
    images: [
      { src: '/assets/images/Mobileapp1.png', alt: 'HKschool home screen' },
      { src: '/assets/images/Mobileapp2.png', alt: 'HKschool school list' },
      { src: '/assets/images/Mobileapp3.png', alt: 'HKschool search' },
      { src: '/assets/images/Mobileapp4.png', alt: 'HKschool school detail' },
      { src: '/assets/images/Mobileapp5.png', alt: 'HKschool filters' },
      { src: '/assets/images/Mobileapp6.png', alt: 'HKschool map view' },
      { src: '/assets/images/Mobileapp7.png', alt: 'HKschool favorites' },
      { src: '/assets/images/Mobileapp8.png', alt: 'HKschool profile' },
      { src: '/assets/images/Mobileapp9.png', alt: 'HKschool settings' },
    ],
    description:
      'Mobile app for browsing Hong Kong school information. Built as a group project with a focus on clear navigation, searchable listings, and practical day-to-day usability.',
    credentials: null,
    links: [
      { label: 'GitHub', href: 'https://github.com/alanluk2226/COMP3130_MobileAppDevelopment' },
    ],
  },
  {
    title: 'Course Portal — Spring Boot Web App',
    tags: ['Spring Boot', 'Spring Security', 'MVC', 'JSP', 'H2'],
    images: Array.from({ length: 16 }, (_, i) => ({
      src: `/assets/images/webdev${i + 1}.png`,
      alt: `Course portal screenshot ${i + 1}`,
    })),
    description:
      'Role-based online course portal with teacher and student flows. Implements authentication, authorization, and MVC structure with Spring Boot, Spring Security, and an H2 database.',
    credentials:
      'Teacher: teacher / teacher123\nStudent: student1 / student123',
    links: [
      { label: 'GitHub', href: 'https://github.com/alanluk2226/Copy-of-COMP3800' },
    ],
  },
]

export const otherProjects = [
  {
    title: 'AI Phishing Detection Assistant',
    tags: ['NVIDIA', 'HKSTP', 'AI/ML', 'Email Security', 'NLP'],
    images: [{ src: '/assets/images/Project.png', alt: 'AI phishing detection proposal overview' }],
    description:
      'Proposal developed during an NVIDIA × HKSTP workshop for an AI assistant that scores email phishing risk and recommends flag, quarantine, or allow actions. Focused on structured feature extraction and reducing false positives.',
    links: [
      { label: 'View Proposal (PDF)', href: '/assets/documents/Project_Proposal.pdf' },
    ],
  },
  {
    title: 'Android Security Lab — Controlled APK Analysis',
    tags: ['Kali Linux', 'Metasploit', 'VMware', 'Security Research'],
    images: [
      { src: '/assets/images/Attack1.png', alt: 'Security lab environment setup' },
      { src: '/assets/images/Attack2.png', alt: 'Payload generation in isolated VM' },
      { src: '/assets/images/Attack3.png', alt: 'Analysis and mitigation notes' },
    ],
    description:
      'Controlled lab study of how malicious Android payloads are generated and delivered in an isolated VMware environment. Purpose: understand common attack paths and strengthen defensive awareness — not for real-world use.',
    credentials: null,
    links: [
      { label: 'GitHub', href: 'https://github.com/alanluk2226/Simple-attack' },
    ],
  },
]

export const certificates = [
  {
    title: 'NVIDIA — Deep Learning Fundamentals',
    tags: ['NVIDIA', 'Deep Learning', 'Python'],
    images: [{ src: '/assets/images/Nvidia1.png', alt: 'NVIDIA Deep Learning certificate' }],
    description:
      'Hands-on training covering neural network basics and model training in Python, including an image classification exercise that grounded later AI coursework.',
    links: [
      { label: 'View Certificate', href: 'https://learn.nvidia.com/certificates?id=vpB4tLPKTf6P5H6tpWq0Mw' },
    ],
  },
  {
    title: 'NVIDIA — Transformer Architecture',
    tags: ['NVIDIA', 'Transformers', 'NLP'],
    images: [{ src: '/assets/images/Nvidia2.png', alt: 'NVIDIA Transformer Architecture certificate' }],
    description:
      'Study of how transformers tokenize language, build contextual representations with attention, and generate sequences — useful foundation for NLP and applied AI work.',
    links: [
      { label: 'View Certificate', href: 'https://learn.nvidia.com/certificates?id=YjOGbXNIRNW_sCjce-pZMg' },
    ],
  },
]
