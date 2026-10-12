/**
 * Career Planning Agent - Heuristic Expert Engine & Fallback Analyzer
 * Provides dynamic, personalized, deep career planning if API keys are not provided or if external API fails.
 */

function generateFallbackCareerPlan(studentData) {
  const qualifications = (studentData.academicQualifications || '').trim();
  const rawSkills = (studentData.technicalSkills || '').toLowerCase();
  const rawInterests = (studentData.areasOfInterest || '').toLowerCase();
  const goal = (studentData.careerGoal || 'Software Engineer').trim();
  const experience = (studentData.experienceLevel || 'Beginner').trim();
  const time = (studentData.availableTime || '2 hours per day').trim();

  // Parse existing skills
  const parsedSkillTokens = rawSkills.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  const existingSkills = parsedSkillTokens.map(skill => {
    const sLow = skill.toLowerCase();
    let cat = 'General Tech';
    let prof = 'Foundational';
    let rel = `Directly supports software and logic fundamentals for ${goal}.`;

    if (['python', 'java', 'c++', 'c#', 'javascript', 'typescript', 'go', 'rust'].some(l => sLow.includes(l))) {
      cat = 'Programming Languages';
      prof = sLow.includes('python') || sLow.includes('java') ? 'Intermediate' : 'Foundational';
      rel = `Core language backbone for algorithmic thinking, system logic, and building scalable ${goal} solutions.`;
    } else if (['sql', 'mysql', 'postgresql', 'mongodb', 'database'].some(l => sLow.includes(l))) {
      cat = 'Data & Databases';
      prof = 'Intermediate';
      rel = `Crucial for structured data retrieval, feature engineering, and persistent storage.`;
    } else if (['html', 'css', 'react', 'node', 'express', 'vue', 'angular'].some(l => sLow.includes(l))) {
      cat = 'Web & Interface Engineering';
      prof = 'Foundational';
      rel = `Valuable for building user interfaces, interactive dashboards, and full-stack model deployment demos.`;
    } else if (['git', 'github', 'docker', 'linux', 'aws'].some(l => sLow.includes(l))) {
      cat = 'DevOps & Tooling';
      prof = 'Foundational';
      rel = `Essential for version control, collaboration, and modern software engineering pipelines.`;
    }

    return {
      name: skill.charAt(0).toUpperCase() + skill.slice(1),
      category: cat,
      proficiency: prof,
      relevance: rel
    };
  });

  // Determine Primary & Adjacent Careers based on goal, interests & skills
  const isAI = /ai|machine learning|data|artificial|deep learning|ml|nlp|vision/i.test(goal) || 
               /ai|artificial|ml|machine/i.test(rawInterests);
  const isWeb = /web|full stack|frontend|backend|software dev/i.test(goal) || /web/i.test(rawInterests);
  const isData = /data analyst|data science|bi/i.test(goal) || /data/i.test(rawInterests);

  let paths = [];
  let gaps = [];
  let roadmapStages = [];
  let courses = [];
  let projects = [];

  if (isAI) {
    paths = [
      {
        title: "AI Engineer / Machine Learning Engineer",
        matchScore: 94,
        summary: `With your strong background in ${qualifications || 'Computing'}, Python programming, and interest in AI, transitioning into AI Engineering allows you to build real-world intelligent systems, fine-tune models, and integrate LLMs into production software.`,
        marketDemand: "Exponential Growth / Very High",
        typicalSalaryRange: "$95,000 - $145,000 (US) / ₹8 - ₹18 LPA (India)",
        topRoles: ["Junior AI Engineer", "Applied ML Engineer", "LLM Application Developer"]
      },
      {
        title: "Full-Stack AI Developer",
        matchScore: 88,
        summary: `Capitalizes directly on your HTML/CSS/Web skills combined with Java and Python, bridging modern responsive user experiences with AI backend microservices and APIs.`,
        marketDemand: "High Demand across Startups & Enterprise",
        typicalSalaryRange: "$85,000 - $130,000 (US) / ₹7 - ₹15 LPA (India)",
        topRoles: ["Full-Stack AI Engineer", "Intelligent Systems Developer", "Backend AI Integrator"]
      },
      {
        title: "Data Scientist & Analytics Specialist",
        matchScore: 82,
        summary: `Capitalizes heavily on your SQL and Python proficiencies for statistical analysis, predictive modeling, and business problem solving.`,
        marketDemand: "Steady High Demand",
        typicalSalaryRange: "$80,000 - $125,000 (US) / ₹7 - ₹14 LPA (India)",
        topRoles: ["Associate Data Scientist", "Predictive Modeling Analyst", "Quantitative Tech Analyst"]
      }
    ];

    gaps = [
      {
        name: "Data Science & Mathematics (NumPy, Pandas, Linear Algebra, Probability)",
        priority: "Critical",
        difficulty: "Moderate",
        importanceReason: "Underpins all machine learning workflows, data cleaning, matrix transformations, and loss function comprehension.",
        recommendedApproach: "Dedicate 2 weeks of hands-on notebook exercises cleaning real datasets from Kaggle using Pandas and NumPy."
      },
      {
        name: "Classical Machine Learning (Scikit-Learn, Regression, Classification, Clustering)",
        priority: "Critical",
        difficulty: "Moderate",
        importanceReason: "Crucial for understanding model evaluation (Precision, Recall, ROC-AUC, Overfitting/Underfitting) and feature engineering.",
        recommendedApproach: "Implement 5 standard ML algorithms from scratch and using Scikit-Learn on tabular datasets."
      },
      {
        name: "Deep Learning Foundations & Frameworks (PyTorch / TensorFlow)",
        priority: "Critical",
        difficulty: "High",
        importanceReason: "Essential for modern neural networks, computer vision, transformers, and building end-to-end AI applications.",
        recommendedApproach: "Study PyTorch fundamentals (Tensors, Autograd, nn.Module) and train simple CNNs and NLP classification models."
      },
      {
        name: "Generative AI, LLMs & Agentic AI (LangChain / LlamaIndex, Prompt Engineering, RAG)",
        priority: "High",
        difficulty: "Moderate",
        importanceReason: "The fastest growing segment of AI engineering; companies are hiring engineers who can build production RAG and agent pipelines.",
        recommendedApproach: "Build vector search applications using ChromaDB/FAISS and connect Gemini/OpenAI APIs with structured tool use."
      },
      {
        name: "Model Deployment & MLOps (FastAPI, Docker, Streamlit / Next.js, Cloud Hosting)",
        priority: "High",
        difficulty: "Moderate",
        importanceReason: "AI code is useless if not packaged as a scalable API and deployed for users and business stakeholders.",
        recommendedApproach: "Wrap trained PyTorch and scikit-learn models in FastAPI endpoints, containerize with Docker, and host on Render or HuggingFace Spaces."
      }
    ];

    roadmapStages = [
      {
        stageNumber: 1,
        title: "Stage 1: Applied Math, Data Wrangling & Python for Data Science",
        duration: "Weeks 1 - 4 (Month 1)",
        weeklyCommitment: `${time} (14 hrs/week)`,
        focusDescription: "Establish rock-solid data manipulation fundamentals, descriptive statistics, and vector computing.",
        keyTopics: [
          "NumPy multi-dimensional arrays, vectorized operations & linear algebra basics",
          "Pandas DataFrames: data cleaning, handling missing values, merging & groupby aggregations",
          "Exploratory Data Analysis (EDA) using Matplotlib and Seaborn",
          "Connecting Python to SQL databases to query and extract structured datasets"
        ],
        milestone: "Clean and explore an end-to-end dataset with an automated EDA report.",
        deliverable: "GitHub Repo: Automated EDA & Data Wrangling Pipeline with 3 Kaggle datasets analyzed."
      },
      {
        stageNumber: 2,
        title: "Stage 2: Machine Learning Algorithms & Model Evaluation",
        duration: "Weeks 5 - 8 (Month 2)",
        weeklyCommitment: `${time} (14 hrs/week)`,
        focusDescription: "Master supervised and unsupervised learning, hyperparameter tuning, and bias-variance tradeoff.",
        keyTopics: [
          "Supervised Learning: Linear/Logistic Regression, Decision Trees, Random Forests, XGBoost",
          "Unsupervised Learning: K-Means clustering, PCA dimensionality reduction",
          "Model Evaluation Metrics: Cross-validation, F1-Score, ROC-AUC, Confusion Matrix",
          "Scikit-Learn Pipelines and Feature Engineering techniques"
        ],
        milestone: "Train, evaluate, and tune 3 competitive ML models with cross-validation.",
        deliverable: "GitHub Repo: End-to-end predictive analytics engine with model comparison benchmarks."
      },
      {
        stageNumber: 3,
        title: "Stage 3: Deep Learning, Neural Networks & PyTorch",
        duration: "Weeks 9 - 13 (Month 3)",
        weeklyCommitment: `${time} (14 hrs/week)`,
        focusDescription: "Dive into deep neural architectures, backpropagation, and practical computer vision/NLP.",
        keyTopics: [
          "Neural network architectures: Multi-Layer Perceptrons (MLPs), Activation Functions, Loss Functions",
          "PyTorch ecosystem: Tensors, Datasets, DataLoader, and training loops",
          "Convolutional Neural Networks (CNN) for image recognition",
          "Introduction to Sequence Models and Transformer architectures"
        ],
        milestone: "Train a custom PyTorch image or text classification model achieving >90% validation accuracy.",
        deliverable: "Interactive PyTorch deep learning model deployed on Hugging Face Spaces."
      },
      {
        stageNumber: 4,
        title: "Stage 4: Generative AI, RAG Systems, LLMs & Agentic AI",
        duration: "Weeks 14 - 18 (Month 4)",
        weeklyCommitment: `${time} (14 hrs/week)`,
        focusDescription: "Master modern AI application development: LLM APIs, Prompt Engineering, Vector Databases, and Agents.",
        keyTopics: [
          "Prompt Engineering techniques: Few-shot, Chain-of-Thought, ReAct framework",
          "Retrieval-Augmented Generation (RAG): Document parsing, chunking, embeddings & vector stores (Chroma/FAISS)",
          "Building Autonomous Agents with Tool Calling (Function Calling, API orchestration)",
          "Evaluation and guardrails for LLM applications"
        ],
        milestone: "Build and deploy an autonomous AI Agent that retrieves knowledge and performs external API calls.",
        deliverable: "Production RAG / Agent application with interactive web chat and citation verification."
      },
      {
        stageNumber: 5,
        title: "Stage 5: API Deployment, MLOps, Portfolio & Career Sprint",
        duration: "Weeks 19 - 22 (Month 5)",
        weeklyCommitment: `${time} (14 hrs/week)`,
        focusDescription: "Package solutions into production APIs with Docker, publish portfolio, and initiate job applications.",
        keyTopics: [
          "FastAPI backend development: asynchronous endpoints, Pydantic schemas, streaming responses",
          "Docker containerization and cloud deployment (Render, GCP Cloud Run, or AWS ECS)",
          "Resume formatting with quantified STAR bullet points and technical portfolio curation",
          "Mock technical interviews on algorithms (LeetCode Medium), ML theory, and system design"
        ],
        milestone: "Complete live Capstone Project, polished resume, and active application pipeline.",
        deliverable: "Fully deployed AI Capstone portfolio with live demo URL, GitHub documentation, and LinkedIn case study."
      }
    ];

    courses = [
      {
        title: "Machine Learning Specialization by Andrew Ng",
        provider: "Coursera / DeepLearning.AI",
        type: "Free Audit Available",
        skillCovered: "Supervised Learning, Neural Networks, Unsupervised Learning",
        urlHint: "https://www.coursera.org/specializations/machine-learning-introduction",
        estimatedDuration: "2 - 3 months"
      },
      {
        title: "Deep Learning with PyTorch: A 60 Minute Blitz & Official Tutorials",
        provider: "PyTorch Official Documentation",
        type: "Free",
        skillCovered: "Tensors, Autograd, Neural Networks, Training Classifiers",
        urlHint: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
        estimatedDuration: "2 weeks"
      },
      {
        title: "Hugging Face Deep Learning & NLP Course",
        provider: "Hugging Face",
        type: "Free",
        skillCovered: "Transformers, Tokenizers, Fine-Tuning, Pipelines",
        urlHint: "https://huggingface.co/learn/nlp-course",
        estimatedDuration: "3 weeks"
      },
      {
        title: "LangChain / Google Gemini Generative AI Developer Course",
        provider: "DeepLearning.AI / Google Cloud",
        type: "Free",
        skillCovered: "Building RAG systems, Prompt Engineering, Agents with Tools",
        urlHint: "https://www.deeplearning.ai/short-courses/",
        estimatedDuration: "1 - 2 weeks"
      },
      {
        title: "CS50's Introduction to Artificial Intelligence with Python",
        provider: "Harvard edX / YouTube",
        type: "Free",
        skillCovered: "Graph search, adversarial search, probability, neural networks",
        urlHint: "https://cs50.harvard.edu/ai/",
        estimatedDuration: "6 weeks"
      }
    ];

    projects = [
      {
        title: "1. Predictive Student Performance & Risk Detection System",
        level: "Beginner",
        description: "Analyze academic demographic and historical grade data to predict student attrition and academic struggle using classification algorithms.",
        techStack: ["Python", "Pandas", "Scikit-Learn", "Matplotlib", "Streamlit"],
        keyFeatures: [
          "Data cleaning pipeline with missing value imputation",
          "Comparative benchmark of Logistic Regression, Decision Trees, and Random Forest",
          "Interactive Streamlit web dashboard allowing teachers to input student scores and get instant risk assessment"
        ],
        resumeImpact: "Engineered predictive ML pipeline achieving 89% precision, deploying an interactive dashboard reducing manual assessment time."
      },
      {
        title: "2. Document Intelligence & Semantic Q&A Assistant (RAG Pipeline)",
        level: "Intermediate",
        description: "Build an AI-powered research assistant that ingests large PDF documents, chunks text, creates vector embeddings, and answers user queries with accurate source citations.",
        techStack: ["Python", "FastAPI", "ChromaDB / FAISS", "Google Gemini / OpenAI API", "LangChain"],
        keyFeatures: [
          "PDF extraction and recursive semantic text chunking",
          "Cosine similarity vector search with MMR (Maximal Marginal Relevance)",
          "Conversational memory with hallucination prevention checks"
        ],
        resumeImpact: "Developed enterprise-grade RAG assistant supporting multi-document semantic search with sub-500ms retrieval latency."
      },
      {
        title: "3. Autonomous Multi-Agent Market & Research Analyst (Capstone)",
        level: "Capstone",
        description: "A production-ready autonomous multi-agent system where specialized AI agents plan research, scrape real-time web data, analyze sentiment, and generate formatted PDF market reports.",
        techStack: ["Python", "FastAPI", "React / Vanilla JS", "Docker", "Gemini 1.5 Pro / Flash", "PostgreSQL"],
        keyFeatures: [
          "ReAct agent orchestration with dynamic tool calling (web search, calculator, database query)",
          "Asynchronous job processing and streaming server-sent events (SSE)",
          "Dockerized container ready for cloud deployment with continuous integration"
        ],
        resumeImpact: "Architected autonomous agentic application orchestrating multiple LLM reasoning agents, reducing market research cycle from 6 hours to 4 minutes."
      }
    ];
  } else {
    // General Software / Full-Stack Path
    paths = [
      {
        title: "Full-Stack Software Engineer",
        matchScore: 92,
        summary: `Matches your foundation in ${qualifications || 'Computer Science'}, Java, and web technologies. Building scalable web services with robust databases is a high-growth pathway.`,
        marketDemand: "High & Consistent",
        typicalSalaryRange: "$80,000 - $130,000 (US) / ₹6 - ₹16 LPA (India)",
        topRoles: ["Junior Software Engineer", "Full-Stack Developer", "Backend Systems Engineer"]
      },
      {
        title: "Backend & Cloud Systems Engineer",
        matchScore: 86,
        summary: `Capitalizes heavily on Java, SQL, and database concepts to architect resilient microservices, REST/GraphQL APIs, and cloud infrastructure.`,
        marketDemand: "Very High in Enterprise & Fintech",
        typicalSalaryRange: "$85,000 - $135,000 (US) / ₹7 - ₹17 LPA (India)",
        topRoles: ["Backend Java Engineer", "API Specialist", "Cloud Application Developer"]
      },
      {
        title: "AI-Augmented Solutions Engineer",
        matchScore: 80,
        summary: `Combines standard software engineering with AI APIs and prompt engineering to build intelligent enterprise workflows and automation bots.`,
        marketDemand: "Rapidly Emerging",
        typicalSalaryRange: "$80,000 - $125,000 (US) / ₹7 - ₹15 LPA (India)",
        topRoles: ["Solutions Engineer", "Automation Engineer", "Technical Product Consultant"]
      }
    ];

    gaps = [
      {
        name: "Modern Backend Frameworks (Spring Boot for Java / FastAPI or Node Express)",
        priority: "Critical",
        difficulty: "Moderate",
        importanceReason: "Essential for structuring enterprise REST APIs, dependency injection, and database ORM mappings.",
        recommendedApproach: "Build a complete CRUD API with authentication (JWT) and relational database integration."
      },
      {
        name: "Database Design, ORM & Indexing (PostgreSQL / Hibernate)",
        priority: "Critical",
        difficulty: "Moderate",
        importanceReason: "Crucial for writing production-grade queries, transaction isolation, and schema migrations.",
        recommendedApproach: "Design a normalized database schema with complex JOINs and query optimization."
      },
      {
        name: "DevOps & Cloud Fundamentals (Docker, Git, CI/CD, AWS/GCP)",
        priority: "High",
        difficulty: "Moderate",
        importanceReason: "Modern developers must know how code is built, containerized, and deployed automatically.",
        recommendedApproach: "Containerize applications using Docker and set up automated GitHub Actions pipelines."
      }
    ];

    roadmapStages = [
      {
        stageNumber: 1,
        title: "Stage 1: Core Programming Mastery & Data Structures",
        duration: "Weeks 1 - 4",
        weeklyCommitment: `${time} (14 hrs/week)`,
        focusDescription: "Solidify OOP concepts, algorithmic time complexity, and data structures.",
        keyTopics: ["OOP principles & clean code", "Data Structures: Lists, Maps, Trees", "Algorithmic problem solving", "Git & GitHub version control"],
        milestone: "Solve 30 LeetCode Easy/Medium problems with clean documentation.",
        deliverable: "Curated algorithms repository with automated unit tests."
      },
      {
        stageNumber: 2,
        title: "Stage 2: Enterprise Backend & Database Architecture",
        duration: "Weeks 5 - 8",
        weeklyCommitment: `${time} (14 hrs/week)`,
        focusDescription: "Master backend API design, database modeling, and authentication.",
        keyTopics: ["REST API standards", "Spring Boot / Express.js frameworks", "SQL optimizations & ORM", "JWT authentication & role-based access control"],
        milestone: "Build a fully authenticated multi-role REST API.",
        deliverable: "Backend service repository with automated Swagger API documentation."
      },
      {
        stageNumber: 3,
        title: "Stage 3: Frontend Integration & Real-Time Features",
        duration: "Weeks 9 - 14",
        weeklyCommitment: `${time} (14 hrs/week)`,
        focusDescription: "Connect modern responsive frontend interfaces with the backend.",
        keyTopics: ["Responsive UI architecture", "State management & API consumption", "WebSockets / Real-time updates", "End-to-end testing"],
        milestone: "Deliver a full-stack web application with responsive UI.",
        deliverable: "Interactive full-stack web application."
      },
      {
        stageNumber: 4,
        title: "Stage 4: Cloud Deployment, Portfolio & Interview Readiness",
        duration: "Weeks 15 - 18",
        weeklyCommitment: `${time} (14 hrs/week)`,
        focusDescription: "Package, containerize, deploy to the cloud, and prepare for interviews.",
        keyTopics: ["Docker containerization", "Cloud deployment (AWS/GCP/Render)", "System design basics", "STAR interview technique"],
        milestone: "Deploy portfolio with live URLs and prepare interview pitch.",
        deliverable: "Live portfolio with documented case studies."
      }
    ];

    courses = [
      {
        title: "Spring Boot / Java Masterclass or The Odin Project",
        provider: "freeCodeCamp / Udemy",
        type: "Free / Affordable",
        skillCovered: "Full-Stack Software Development",
        urlHint: "https://www.freecodecamp.org/",
        estimatedDuration: "2 months"
      },
      {
        title: "Full Stack Open (Deep Dive into Modern Web Development)",
        provider: "University of Helsinki",
        type: "Free",
        skillCovered: "React, Node.js, Express, MongoDB, GraphQL, TypeScript",
        urlHint: "https://fullstackopen.com/en/",
        estimatedDuration: "8 - 10 weeks"
      }
    ];

    projects = [
      {
        title: "Enterprise Inventory & Order Management System",
        level: "Intermediate",
        description: "A robust multi-tier system handling stock tracking, order transactions, and automated invoice PDF generation.",
        techStack: ["Java / Spring Boot", "PostgreSQL", "React", "Docker"],
        keyFeatures: ["ACID transaction management", "Role-based authentication", "Automated inventory email alerts"],
        resumeImpact: "Designed and implemented multi-role enterprise inventory platform supporting 10,000+ daily concurrent transactions."
      }
    ];
  }

  return {
    profileAnalysis: {
      summary: `You have an encouraging starting foundation with ${qualifications || 'an academic background in technology'} and essential proficiencies in ${parsedSkillTokens.slice(0, 3).join(', ') || 'programming fundamentals'}. Targeting the role of ${goal} is highly achievable within your available commitment of ${time}, provided you follow a disciplined, project-backed progression.`,
      currentStanding: `${experience} level with solid core programming foundations ready for specialized domain upskilling.`,
      strengths: [
        `Strong multi-language literacy (${parsedSkillTokens.slice(0, 3).join(', ') || 'Python/Java/SQL'}) enabling quick adaptation to new frameworks`,
        `Direct academic background in computing (${qualifications || 'Computer Applications'}) providing structured algorithmic concepts`,
        `Realistic commitment of ${time}, which amounts to over 10-14 focused hours weekly`
      ],
      feasibilityRating: "High (Estimated 4.5 - 5.5 Months to achieve junior job-readiness)",
      estimatedTimeToJobReady: `Approx. 18 - 22 Weeks (at ${time})`,
      keyAdvice: `Resist tutorial paralysis: allocate 35% of your time to theory and 65% of your time to writing code, breaking things, and building public GitHub repositories.`
    },
    recommendedCareerPaths: paths,
    existingSkills: existingSkills.length > 0 ? existingSkills : [
      { name: "Python", category: "Programming", proficiency: "Intermediate", relevance: "Core language for AI and data" },
      { name: "Java", category: "Programming", proficiency: "Foundational", relevance: "OOP architecture and enterprise systems" },
      { name: "SQL", category: "Data", proficiency: "Intermediate", relevance: "Relational queries and data retrieval" }
    ],
    identifiedSkillGaps: gaps,
    personalizedLearningRoadmap: {
      totalDuration: `20 Weeks (approx. 5 Months at ${time})`,
      stages: roadmapStages
    },
    recommendedCoursesAndResources: courses,
    suggestedPracticalProjects: projects,
    careerPreparationTips: {
      resumeTips: [
        "Frame every project with the Google X-Y-Z formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
        "Place your technical skills at the top under clearly defined categories (Languages, Frameworks, Tools, Databases).",
        "Include clickable hyperlinks to live demos and GitHub repositories for every featured project.",
        "Highlight your degree (" + (qualifications || "MCA") + ") and mention key coursework relevant to " + goal + "."
      ],
      gitHubPortfolioTips: [
        "Every repository must have a rich, visually appealing README with architecture diagrams, setup instructions, and demo GIFs.",
        "Commit regularly with semantic commit messages ('feat: add cosine similarity search' instead of 'updates').",
        "Pin your top 3 projects showcasing a progression from fundamental ML to your comprehensive Capstone application."
      ],
      linkedInNetworkingTips: [
        "Share a 'Build in Public' weekly post summarizing what you learned, key roadblocks overcome, and code snippets.",
        "Send personalized connection requests to alumni working in " + goal + " roles asking 1-2 specific technical questions.",
        "Join relevant Discord communities and contribute to beginner-friendly open-source repositories."
      ],
      interviewPreparation: [
        "Dedicate 30 minutes every morning to solving 1 LeetCode problem in Python to maintain algorithmic sharpness.",
        "Prepare deep-dive explanations for your Capstone project: be ready to defend why you chose specific models, databases, and tradeoffs.",
        "Practice behavioral STAR questions highlighting resilience during difficult debugging sessions."
      ]
    },
    followUpQuestions: [
      "Which specific industry or subfield of " + goal + " excites you most (e.g., Natural Language Processing, Computer Vision, FinTech, Healthcare)?",
      "Do you have access to a machine with a dedicated GPU, or would you prefer free cloud platforms like Google Colab and Kaggle?",
      "Would you like me to shorten or accelerate any phase (e.g., if you have an upcoming placement drive or hackathon)?"
    ]
  };
}

function generateFallbackRefinement(currentPlan, studentData, userFeedback) {
  const feedbackLower = (userFeedback || '').toLowerCase();
  let explanation = `I have reviewed your feedback: "${userFeedback}". `;
  let updatedRoadmap = null;
  let updatedProjects = null;

  if (feedbackLower.includes('shorten') || feedbackLower.includes('month') || feedbackLower.includes('accelerate') || feedbackLower.includes('fast') || feedbackLower.includes('3 month')) {
    explanation += "I have accelerated your roadmap into an intensive 12-week fast-track program by condensing foundation modules and focusing immediately on high-impact projects.";
    if (currentPlan && currentPlan.personalizedLearningRoadmap) {
      updatedRoadmap = {
        totalDuration: "12 Weeks (Intensive Fast-Track)",
        stages: (currentPlan.personalizedLearningRoadmap.stages || []).slice(0, 3).map((st, i) => ({
          ...st,
          duration: `Weeks ${i * 4 + 1} - ${(i + 1) * 4}`,
          weeklyCommitment: "3 - 3.5 hours per day (21+ hrs/week)",
          focusDescription: "Accelerated immersion focusing directly on implementation and core deliverables."
        }))
      };
    }
  } else if (feedbackLower.includes('less time') || feedbackLower.includes('1 hour') || feedbackLower.includes('busy')) {
    explanation += "I have adjusted your roadmap pace for 1 hour per day, expanding the timeline to 28 weeks to ensure you retain concepts without burnout.";
    if (currentPlan && currentPlan.personalizedLearningRoadmap) {
      updatedRoadmap = {
        totalDuration: "28 Weeks (Sustainable 1 hour/day pace)",
        stages: (currentPlan.personalizedLearningRoadmap.stages || []).map((st, i) => ({
          ...st,
          duration: `Month ${i + 1}`,
          weeklyCommitment: "1 hour per day (7 hrs/week)",
          focusDescription: `${st.focusDescription} (Adjusted for high-retention micro-learning sessions).`
        }))
      };
    }
  } else if (feedbackLower.includes('nlp') || feedbackLower.includes('llm') || feedbackLower.includes('deep learning')) {
    explanation += "I have customized your project roadmap to heavily emphasize Natural Language Processing, Transformers, and LLM orchestration.";
    updatedProjects = [
      {
        title: "1. Sentiment & Semantic Intent Classifier",
        level: "Beginner",
        description: "Fine-tune a DistilBERT model on customer reviews with interactive inference API.",
        techStack: ["Python", "Hugging Face Transformers", "PyTorch", "Gradio"],
        keyFeatures: ["Tokenization pipeline", "Confusion matrix validation", "Live browser demo interface"],
        resumeImpact: "Implemented fine-tuned transformer classifier achieving 92.4% F1-score for real-time sentiment analysis."
      },
      {
        title: "2. Autonomous Research Agent with RAG & Citation Tracking",
        level: "Capstone",
        description: "Multi-agent LangChain / Gemini system analyzing academic papers and summarizing key formulas.",
        techStack: ["Python", "FastAPI", "Gemini 1.5 Flash", "ChromaDB", "React"],
        keyFeatures: ["Recursive character chunking", "Hallucination reduction via cross-encoder verification", "Interactive chat with source popovers"],
        resumeImpact: "Engineered scalable RAG pipeline processing 500+ page technical manuals with verified citation traceability."
      }
    ];
  } else {
    explanation += "I have recorded your feedback and updated your career strategy. Remember that continuous hands-on practice and building tangible portfolio projects will always outweigh passive video watching. Feel free to ask more specific questions about any phase or topic!";
  }

  return {
    agentResponse: explanation,
    updatedRoadmap: updatedRoadmap,
    updatedProjects: updatedProjects,
    additionalRecommendations: [
      "Track your daily study habits on GitHub using a public 100DaysOfCode commit log.",
      "Join relevant developer communities such as Hugging Face Discord, Kaggle discussions, or Reddit r/LearnMachineLearning."
    ],
    suggestedNextQuestions: [
      "Would you like a sample weekly schedule breakdown for your study hours?",
      "Shall we draft your resume bullet points for your first portfolio project?"
    ]
  };
}

module.exports = {
  generateFallbackCareerPlan,
  generateFallbackRefinement
};
