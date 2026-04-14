export const myProjects = [
  {
    title: 'Workout app with courses enrollment, admin system',
    tags: ['Node.js', 'Express.js', 'Render', 'MongoDB', 'EJS', 'Javascript', 'CURL', 'Ubuntu'],
    images: [
      { src: '/assets/images/workout.png', alt: 'Workout App Screenshot 1' },
      { src: '/assets/images/workout2.png', alt: 'Workout App Screenshot 2' },
      { src: '/assets/images/workout3.png', alt: 'Workout App Screenshot 3' },
      { src: '/assets/images/workout4.png', alt: 'Workout App Screenshot 4' },
      { src: '/assets/images/workout5.png', alt: 'Workout App Screenshot 5' },
      { src: '/assets/images/Mongodb1.png', alt: 'MongoDB Screenshot 1' },
      { src: '/assets/images/mongodb2.png', alt: 'MongoDB Screenshot 2' },
      { src: '/assets/images/mongodb3.png', alt: 'MongoDB Screenshot 3' },
      { src: '/assets/images/mongodb4.png', alt: 'MongoDB Screenshot 4' },
      { src: '/assets/images/API1.png', alt: 'API Screenshot 1' },
      { src: '/assets/images/API2.png', alt: 'API Screenshot 2' },
      { src: '/assets/images/API3.png', alt: 'API Screenshot 3' },
      { src: '/assets/images/API4.png', alt: 'API Screenshot 4' },
      { src: '/assets/images/API5.png', alt: 'API Screenshot 5' },
    ],
    description: `A full-featured workout platform with user authentication, courses enrollment, track workout with CRUD, fast workout setup for beginner and advanced, chat bot, week and month analysis, weekly promotions. By using green as it psychologically represents growth, health, and success—perfect for tracking fitness progress and motivating users toward their goals. The project is using responsive design, viewing in mobile phone is possible especially the course timetable. There is an admin account for the admin to manage the courses, coaches, users.`,
    credentials: `Test account: test123456 | password: 123456\nAdmin account: admin123456 | password: 123456\n(For security reason, when login with admin account, do not Remember me, else it will fail to login)`,
    links: [
      { label: 'View on Render', href: 'https://workhard-b5zs.onrender.com/' },
      { label: 'View on Github', href: 'https://github.com/alanluk2226/Workhard' },
    ],
  },
  {
    title: 'HKschool - Hong Kong School Finder',
    tags: ['React Native', 'Mobile App', 'School Group Project'],
    images: [
      { src: '/assets/images/Mobileapp1.png', alt: 'HKschool Screenshot 1' },
      { src: '/assets/images/Mobileapp2.png', alt: 'HKschool Screenshot 2' },
      { src: '/assets/images/Mobileapp3.png', alt: 'HKschool Screenshot 3' },
      { src: '/assets/images/Mobileapp4.png', alt: 'HKschool Screenshot 4' },
      { src: '/assets/images/Mobileapp5.png', alt: 'HKschool Screenshot 5' },
      { src: '/assets/images/Mobileapp6.png', alt: 'HKschool Screenshot 6' },
      { src: '/assets/images/Mobileapp7.png', alt: 'HKschool Screenshot 7' },
      { src: '/assets/images/Mobileapp8.png', alt: 'HKschool Screenshot 8' },
      { src: '/assets/images/Mobileapp9.png', alt: 'HKschool Screenshot 9' },
    ],
    description: 'A mobile app developed with Android Studio to view all Hong Kong schools. Built as a group project, it allows users to browse and explore school information across Hong Kong.',
    credentials: null,
    links: [
      { label: 'View on Github', href: 'https://github.com/alanluk2226/COMP3130_MobileAppDevelopment' },
    ],
  },
  {
    title: 'Online Course Web Application',
    tags: ['Spring Boot', 'Spring MVC', 'Spring Security', 'JSP/JSTL', 'H2', 'IntelliJ IDEA', 'School Group Project'],
    images: Array.from({ length: 16 }, (_, i) => ({
      src: `/assets/images/webdev${i + 1}.png`,
      alt: `Online Course Web App Screenshot ${i + 1}`,
    })),
    description: 'A school group project — an online course web application built with Spring Boot, Spring MVC, Spring Security, JSP/JSTL, and H2 database, developed in IntelliJ IDEA.',
    credentials: `Teacher account: teacher | password: teacher123\nStudent account: student1 | password: student123\nStudent account: student2 | password: student123\nStudent account: student3 | password: student123`,
    links: [
      { label: 'View on Github', href: 'https://github.com/alanluk2226/Copy-of-COMP3800' },
    ],
  },
  {
    title: 'Simple .apk attack',
    tags: ['VMware', 'Kali', 'MSF'],
    images: [
      { src: '/assets/images/Attack1.png', alt: 'Attack App Screenshot 1' },
      { src: '/assets/images/Attack2.png', alt: 'Attack App Screenshot 2' },
      { src: '/assets/images/Attack3.png', alt: 'Attack App Screenshot 3' },
    ],
    description: 'A simple penetration (.apk) created by msfvenom, in VMWare. It helps me develop a basic concept about cyber security, how the hacker hacks a phone or pc, and how to help protect the data.',
    credentials: null,
    links: [
      { label: 'View on Github', href: 'https://github.com/alanluk2226/Simple-attack' },
    ],
  },
]

export const otherProjects = [
  {
    title: 'AI-Driven Phishing Detection and Mitigation Assistant',
    tags: ['NVIDIA', 'HKSTP', 'AI/ML', 'Email Security', 'NLP', 'GitHub'],
    images: [{ src: '/assets/images/Project.png', alt: 'AI Phishing Detection Overview' }],
    description: `This project proposal was developed during an NVIDIA workshop hosted by HKSTP. A comprehensive proposal for developing a prototype AI-driven phishing detection and mitigation assistant that focuses on email as the primary attack vector. The system parses incoming emails into structured features and analyzes them to produce a phishing risk score. Based on this assessment, intelligent agents decide whether to flag, quarantine, or allow messages, providing automated protection against phishing attacks while minimizing false positives.`,
    links: [
      { label: 'View Proposal (PDF)', href: '/assets/documents/Project_Proposal.pdf' },
    ],
  },
]

export const certificates = [
  {
    title: 'NVIDIA Deep Learning Certificate',
    tags: ['NVIDIA', 'Deep Learning', 'Python', 'AI Training'],
    images: [{ src: '/assets/images/Nvidia1.png', alt: 'NVIDIA Deep Learning Certificate' }],
    description: `The deep learning course focuses on how to train AI, which is a subset of machine learning. In this course, I was able to train the model to identify what animal is from a picture by using Python. It became an important foundation for my future AI training and provided hands-on experience with neural networks and model optimization.`,
    links: [
      { label: 'View Certificate', href: 'https://learn.nvidia.com/certificates?id=vpB4tLPKTf6P5H6tpWq0Mw' },
    ],
  },
  {
    title: 'NVIDIA Transformer Architecture Certificate',
    tags: ['NVIDIA', 'Transformers', 'NLP', 'Neural Networks'],
    images: [{ src: '/assets/images/Nvidia2.png', alt: 'NVIDIA Transformer Architecture Certificate' }],
    description: `I learned the concept of NVIDIA's Transformer architecture. It can transfer the user's natural language into numeric tokens, and then convert them into vectors (matrices). These matrices are processed through multiple layers of neural networks using attention mechanisms to understand context, relationships, and meaning. Finally, the model generates a response by predicting the next most likely token in sequence. It gave me a huge concept about how AI works and will help my future work related to AI engineering, particularly in building AI models.`,
    links: [
      { label: 'View Certificate', href: 'https://learn.nvidia.com/certificates?id=YjOGbXNIRNW_sCjce-pZMg' },
    ],
  },
]
