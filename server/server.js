/**
 * Career Planning Agent - Express Backend Server
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const aiService = require('./agent/aiService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Standard Testing Presets
const PRESETS = [
  {
    id: 'mca_ai',
    name: 'MCA Student → AI Engineer (User Test Case)',
    academicQualifications: 'MCA student (Master of Computer Applications)',
    technicalSkills: 'Python, Java, SQL, HTML, CSS',
    areasOfInterest: 'Artificial Intelligence and Software Development',
    careerGoal: 'AI Engineer',
    experienceLevel: 'Beginner',
    availableTime: '2 hours per day',
    additionalNotes: 'Interested in hands-on practical projects, building LLM apps and deploying models.'
  },
  {
    id: 'btech_fullstack',
    name: 'B.Tech CSE → Full-Stack Cloud Engineer',
    academicQualifications: 'B.Tech in Computer Science & Engineering (3rd Year)',
    technicalSkills: 'JavaScript, C++, React, Git, basic MongoDB',
    areasOfInterest: 'Web Systems, Cloud Architecture, Scalable Backends',
    careerGoal: 'Full-Stack Software Engineer',
    experienceLevel: 'Intermediate',
    availableTime: '3 hours per day',
    additionalNotes: 'Wants to crack product-based company campus placements.'
  },
  {
    id: 'math_datascientist',
    name: 'B.Sc Statistics / Math → Data Scientist',
    academicQualifications: 'B.Sc in Statistics & Mathematics',
    technicalSkills: 'Python, R, Excel, Basic SQL',
    areasOfInterest: 'Predictive Analytics, Machine Learning, Statistical Modeling',
    careerGoal: 'Data Scientist',
    experienceLevel: 'Beginner',
    availableTime: '2.5 hours per day',
    additionalNotes: 'Strong in probability and calculus, needs guidance on ML libraries and databases.'
  },
  {
    id: 'devops_cloud',
    name: 'IT Professional → Cloud & DevOps Engineer',
    academicQualifications: 'BCA graduate, working in technical support',
    technicalSkills: 'Linux command line, Bash, Networking, basic Python',
    areasOfInterest: 'Cloud Automation, CI/CD, Containerization',
    careerGoal: 'DevOps / Cloud Engineer',
    experienceLevel: 'Intermediate',
    availableTime: '1.5 hours per day',
    additionalNotes: 'Looking to transition from support to high-paying cloud infrastructure engineering.'
  }
];

// Routes
// 1. System Status
app.get('/api/status', (req, res) => {
  res.json(aiService.getStatus());
});

// 2. Preset profiles for instant testing
app.get('/api/presets', (req, res) => {
  res.json(PRESETS);
});

// 3. Settings update (allows setting GEMINI_API_KEY from UI or testing)
app.post('/api/settings', (req, res) => {
  try {
    const { geminiKey, openaiKey, geminiModel } = req.body;
    aiService.updateConfig({ geminiKey, openaiKey, geminiModel });

    // Optionally save to .env
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath) && geminiKey) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('GEMINI_API_KEY=')) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY=${geminiKey}`);
      } else {
        envContent += `\nGEMINI_API_KEY=${geminiKey}`;
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      status: aiService.getStatus()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Generate Career Plan
app.post('/api/analyze', async (req, res) => {
  try {
    const studentData = req.body.studentData || req.body;
    const clientApiKey = req.body.clientApiKey || null;

    // Validate required fields
    if (!studentData.careerGoal || !studentData.careerGoal.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Career Goal is required. Please specify what role you aspire to reach (e.g. AI Engineer, Data Scientist, Full-Stack Developer).'
      });
    }

    if (!studentData.academicQualifications || !studentData.academicQualifications.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Academic Qualification is required (e.g. MCA student, B.Tech CSE, Bachelor in Arts).'
      });
    }

    const result = await aiService.generateCareerPlan(studentData, clientApiKey);
    res.json(result);
  } catch (err) {
    console.error('Error generating career plan:', err);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while generating the career plan: ' + err.message
    });
  }
});

// 5. Refine / Iterate on Career Plan (Follow-up & Feedback)
app.post('/api/refine', async (req, res) => {
  try {
    const { currentPlan, studentData, userFeedback, chatHistory, clientApiKey } = req.body;

    if (!userFeedback || !userFeedback.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a question or feedback instruction for the Career Agent.'
      });
    }

    const result = await aiService.refineCareerPlan(
      currentPlan,
      studentData || {},
      userFeedback,
      chatHistory || [],
      clientApiKey
    );

    res.json(result);
  } catch (err) {
    console.error('Error refining career plan:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process feedback: ' + err.message
    });
  }
});

// Fallback route for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Career Planning Agent running on port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`🤖 AI Status: ${aiService.getStatus().activeProvider}`);
  console.log(`====================================================`);
});
