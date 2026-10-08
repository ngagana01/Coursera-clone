export type CourseSummary = {
  id: string;
  title: string;
  provider: string;
  type: string;
  description: string;
  image: string;
  tags: string[];
};

export const courseSummaries: CourseSummary[] = [
  {
    id: "microsoft-front-end",
    title: "Microsoft Front-End Developer",
    provider: "Microsoft",
    type: "Professional Certificate",
    description:
      "Learn front-end development with HTML, CSS, JavaScript, React, responsive web design, and modern web development.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    tags: [
      "Programming",
      "Web Development",
      "Design",
    ],
  },

  {
    id: "microsoft-backend",
    title: "Microsoft Back-End Developer",
    provider: "Microsoft",
    type: "Professional Certificate",
    description:
      "Learn backend programming, APIs, servers, databases, software development, and backend application development.",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80",
    tags: [
      "Programming",
      "Backend",
      "Database",
    ],
  },

  {
    id: "microsoft-fullstack",
    title: "Microsoft Full-Stack Developer",
    provider: "Microsoft",
    type: "Professional Certificate",
    description:
      "Build complete web applications using front-end development, backend development, databases, JavaScript, and modern programming technologies.",
    image:
      "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=800&q=80",
    tags: [
      "Programming",
      "Web Development",
      "Backend",
      "Database",
    ],
  },

  {
    id: "microsoft-project-management",
    title: "Microsoft Project Management",
    provider: "Microsoft",
    type: "Professional Certificate",
    description:
      "Learn project planning, project management, leadership, business strategy, communication, and team management.",
    image:
      "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=800&q=80",
    tags: [
      "Business",
      "Management",
    ],
  },

  {
    id: "ibm-backend",
    title: "IBM Back-End Development",
    provider: "IBM",
    type: "Professional Certificate",
    description:
      "Learn backend programming, APIs, databases, Python, application development, and server-side technologies.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    tags: [
      "Programming",
      "Backend",
      "Database",
    ],
  },

  {
    id: "ibm-fullstack",
    title: "IBM Full Stack Software Developer",
    provider: "IBM",
    type: "Professional Certificate",
    description:
      "Learn full stack software development, front-end development, backend programming, databases, and cloud technologies.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80",
    tags: [
      "Programming",
      "Web Development",
      "Backend",
      "Database",
    ],
  },

  {
    id: "ibm-developer",
    title: "IBM Developer",
    provider: "IBM",
    type: "Professional Certificate",
    description:
      "Develop software engineering and programming skills using modern development technologies.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    tags: [
      "Programming",
      "Web Development",
    ],
  },

  {
    id: "ibm-devops",
    title: "IBM DevOps and Software Engineering",
    provider: "IBM",
    type: "Professional Certificate",
    description:
      "Learn DevOps, software engineering, cloud development, programming, automation, and modern application development.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    tags: [
      "Programming",
      "Management",
    ],
  },

  {
    id: "ibm-generative-ai",
    title: "IBM Generative AI Engineering",
    provider: "IBM",
    type: "Professional Certificate",
    description:
      "Learn artificial intelligence, generative AI, machine learning, Python programming, and AI engineering.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    tags: [
      "Programming",
      "AI & ML",
      "Data Science",
    ],
  },

  {
    id: "ai-agents-leaders",
    title: "Agents: AI and AI Agents for Leaders",
    provider: "DeepLearning.AI",
    type: "Specialization",
    description:
      "Learn artificial intelligence, AI agents, generative AI, business strategy, and AI leadership.",
    image:
      "https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=800&q=80",
    tags: [
      "AI & ML",
      "Business",
      "Management",
    ],
  },

  {
    id: "microsoft-ai-ml",
    title: "Microsoft AI & ML Engineering",
    provider: "Microsoft",
    type: "Professional Certificate",
    description:
      "Learn artificial intelligence, machine learning, data science, Python programming, and AI engineering.",
    image:
      "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=800&q=80",
    tags: [
      "AI & ML",
      "Data Science",
      "Programming",
    ],
  },
];

