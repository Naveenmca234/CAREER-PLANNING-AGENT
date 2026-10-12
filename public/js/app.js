/**
 * Career Planning Agent - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  // App State
  const state = {
    currentPlan: null,
    currentStudentData: null,
    chatHistory: [],
    presets: []
  };

  // Elements
  const careerForm = document.getElementById('careerForm');
  const generatePlanBtn = document.getElementById('generatePlanBtn');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const resultsDashboard = document.getElementById('resultsDashboard');
  const loadTestPresetBtn = document.getElementById('loadTestPresetBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const engineStatusBtn = document.getElementById('engineStatusBtn');
  const engineStatusText = document.getElementById('engineStatusText');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const settingsForm = document.getElementById('settingsForm');
  const toastNotification = document.getElementById('toastNotification');
  const refinementForm = document.getElementById('refinementForm');
  const refinementInput = document.getElementById('refinementInput');
  const printBtn = document.getElementById('printBtn');
  const exportMarkdownBtn = document.getElementById('exportMarkdownBtn');
  const scrollToChatBtn = document.getElementById('scrollToChatBtn');

  // Show Toast
  function showToast(message, type = 'info') {
    const toast = toastNotification;
    const msgEl = toast.querySelector('.toast-message');
    const iconEl = toast.querySelector('.toast-icon');

    msgEl.textContent = message;
    iconEl.className = `toast-icon fa-solid ${type === 'error' ? 'fa-triangle-exclamation text-rose' : 'fa-info-circle text-primary'}`;

    toast.style.display = 'flex';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.display = 'none';
    }, 4000);
  }

  // Check Engine Status
  async function refreshEngineStatus() {
    const status = await API.checkStatus();
    if (status.hasGeminiKey) {
      engineStatusText.textContent = `Google Gemini (${status.geminiModel || 'Live'})`;
    } else {
      engineStatusText.textContent = 'Career Expert Engine (Built-in)';
    }

    const modalStatus = document.getElementById('modalActiveEngineText');
    if (modalStatus) {
      modalStatus.textContent = status.activeProvider || 'Expert Heuristic Engine';
    }
  }
  await refreshEngineStatus();

  // Load Presets from API
  try {
    state.presets = await API.getPresets();
  } catch (err) {
    console.warn('Failed to fetch presets:', err);
  }

  // Fill Form with Preset
  function applyPreset(presetId) {
    const p = state.presets.find(item => item.id === presetId);
    if (!p) return;

    document.getElementById('academicQualifications').value = p.academicQualifications || '';
    document.getElementById('technicalSkills').value = p.technicalSkills || '';
    document.getElementById('areasOfInterest').value = p.areasOfInterest || '';
    document.getElementById('careerGoal').value = p.careerGoal || '';
    document.getElementById('experienceLevel').value = p.experienceLevel || 'Beginner';
    document.getElementById('availableTime').value = p.availableTime || '2 hours per day';
    document.getElementById('additionalNotes').value = p.additionalNotes || '';

    showToast(`Loaded preset: ${p.name}`);
  }

  // Setup Preset Buttons
  document.querySelectorAll('.preset-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetId = btn.dataset.preset;
      applyPreset(presetId);
    });
  });

  if (loadTestPresetBtn) {
    loadTestPresetBtn.addEventListener('click', () => {
      applyPreset('mca_ai');
    });
  }

  // Form Reset
  resetFormBtn.addEventListener('click', () => {
    careerForm.reset();
    showToast('Form cleared.');
  });

  // Handle Form Submission
  careerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentData = {
      academicQualifications: document.getElementById('academicQualifications').value.trim(),
      technicalSkills: document.getElementById('technicalSkills').value.trim(),
      areasOfInterest: document.getElementById('areasOfInterest').value.trim(),
      careerGoal: document.getElementById('careerGoal').value.trim(),
      experienceLevel: document.getElementById('experienceLevel').value,
      availableTime: document.getElementById('availableTime').value,
      additionalNotes: document.getElementById('additionalNotes').value.trim()
    };

    if (!studentData.academicQualifications || !studentData.careerGoal) {
      showToast('Please provide your Academic Qualifications and Career Goal.', 'error');
      return;
    }

    // Toggle Loading UI
    emptyState.style.display = 'none';
    resultsDashboard.style.display = 'none';
    loadingState.style.display = 'flex';

    const btnContent = generatePlanBtn.querySelector('.btn-content');
    const btnLoader = generatePlanBtn.querySelector('.btn-loader');
    generatePlanBtn.disabled = true;
    btnContent.style.display = 'none';
    btnLoader.style.display = 'flex';

    try {
      const response = await API.generateCareerPlan(studentData);
      state.currentPlan = response.data;
      state.currentStudentData = studentData;

      // Populate dashboard
      renderEntirePlan(response);

      // Transition to results
      loadingState.style.display = 'none';
      resultsDashboard.style.display = 'flex';
      resultsDashboard.scrollIntoView({ behavior: 'smooth' });

      showToast('Career Plan generated successfully!');
    } catch (err) {
      console.error(err);
      loadingState.style.display = 'none';
      emptyState.style.display = 'flex';
      showToast(err.message || 'Failed to generate plan. Please verify inputs or API settings.', 'error');
    } finally {
      generatePlanBtn.disabled = false;
      btnContent.style.display = 'flex';
      btnLoader.style.display = 'none';
    }
  });

  // Render Full Plan
  function renderEntirePlan(response) {
    const plan = response.data;

    // Header Badges
    document.getElementById('resultGoalTitle').textContent = `Career Plan for ${state.currentStudentData.careerGoal}`;
    document.getElementById('resultProviderBadge').innerHTML = `<i class="fa-solid fa-microchip"></i> Engine: ${response.provider || 'AI'}`;
    
    if (plan.profileAnalysis) {
      document.getElementById('resultFeasibilityBadge').innerHTML = `<i class="fa-solid fa-circle-check"></i> Feasibility: ${plan.profileAnalysis.feasibilityRating || 'High'}`;
      document.getElementById('resultTimeBadge').innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ${plan.profileAnalysis.estimatedTimeToJobReady || 'Phased Roadmap'}`;
    }

    // Section 1: Profile Analysis
    Components.renderProfileAnalysis(plan.profileAnalysis);

    // Section 2: Career Paths
    Components.renderCareerPaths(plan.recommendedCareerPaths);

    // Section 3: Existing Skills
    Components.renderExistingSkills(plan.existingSkills);

    // Section 4: Skill Gaps
    Components.renderSkillGaps(plan.identifiedSkillGaps);

    // Section 5: Learning Roadmap
    Components.renderRoadmap(plan.personalizedLearningRoadmap);

    // Section 6: Recommended Courses
    Components.renderCourses(plan.recommendedCoursesAndResources);

    // Section 7: Suggested Projects
    Components.renderProjects(plan.suggestedPracticalProjects);

    // Section 8: Career Tips
    Components.renderCareerTips(plan.careerPreparationTips);

    // Follow-up Questions
    Components.renderFollowUpQuestions(plan.followUpQuestions, (questionText) => {
      refinementInput.value = questionText;
      refinementInput.focus();
    });
  }

  // Career Tips Tabs Switching
  document.querySelectorAll('.tip-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      Components.showTipTab(btn.dataset.tab);
    });
  });

  // Refinement / Follow-up Q&A Form
  refinementForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = refinementInput.value.trim();
    if (!feedback) return;

    refinementInput.value = '';
    Components.appendChatMessage('user', feedback);
    state.chatHistory.push({ role: 'user', content: feedback });

    const sendBtn = document.getElementById('sendRefinementBtn');
    sendBtn.disabled = true;

    try {
      const response = await API.refineCareerPlan({
        currentPlan: state.currentPlan,
        studentData: state.currentStudentData,
        userFeedback: feedback,
        chatHistory: state.chatHistory
      });

      const resData = response.data;
      Components.appendChatMessage('agent', resData.agentResponse);
      state.chatHistory.push({ role: 'assistant', content: resData.agentResponse });

      // If roadmap was modified
      if (resData.updatedRoadmap && resData.updatedRoadmap.stages) {
        state.currentPlan.personalizedLearningRoadmap = resData.updatedRoadmap;
        Components.renderRoadmap(resData.updatedRoadmap);
        showToast('Your roadmap has been dynamically updated based on feedback!');
      }

      // If projects were modified
      if (resData.updatedProjects && resData.updatedProjects.length > 0) {
        state.currentPlan.suggestedPracticalProjects = resData.updatedProjects;
        Components.renderProjects(resData.updatedProjects);
      }

      // Next questions
      if (resData.suggestedNextQuestions) {
        Components.renderFollowUpQuestions(resData.suggestedNextQuestions, (q) => {
          refinementInput.value = q;
          refinementInput.focus();
        });
      }
    } catch (err) {
      showToast('Agent refinement error: ' + err.message, 'error');
      Components.appendChatMessage('agent', 'I encountered an issue processing that adjustment. Please verify your connection or try rephrasing.');
    } finally {
      sendBtn.disabled = false;
    }
  });

  // Scroll to Chat Button
  if (scrollToChatBtn) {
    scrollToChatBtn.addEventListener('click', () => {
      document.getElementById('sectionRefinement').scrollIntoView({ behavior: 'smooth' });
      refinementInput.focus();
    });
  }

  // Print / Save as PDF
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Export as Markdown
  exportMarkdownBtn.addEventListener('click', () => {
    if (!state.currentPlan) return;
    const md = generateMarkdownExport(state.currentPlan, state.currentStudentData);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Career_Roadmap_${(state.currentStudentData.careerGoal || 'Plan').replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Career Plan exported as Markdown!');
  });

  function generateMarkdownExport(plan, student) {
    let md = `# Personalized Career Plan: ${student.careerGoal}\n\n`;
    md += `**Candidate:** ${student.academicQualifications}\n`;
    md += `**Current Skills:** ${student.technicalSkills}\n`;
    md += `**Available Time:** ${student.availableTime}\n\n`;

    md += `## 1. Student Profile Analysis\n`;
    md += `${plan.profileAnalysis.summary}\n\n`;
    md += `- **Current Standing:** ${plan.profileAnalysis.currentStanding}\n`;
    md += `- **Feasibility Rating:** ${plan.profileAnalysis.feasibilityRating}\n`;
    md += `- **Estimated Time to Job-Ready:** ${plan.profileAnalysis.estimatedTimeToJobReady}\n`;
    md += `- **Core Advice:** ${plan.profileAnalysis.keyAdvice}\n\n`;

    md += `## 2. Recommended Career Paths\n`;
    plan.recommendedCareerPaths.forEach(p => {
      md += `### ${p.title} (${p.matchScore}% Match)\n`;
      md += `${p.summary}\n`;
      md += `- Market Demand: ${p.marketDemand}\n`;
      md += `- Salary Range: ${p.typicalSalaryRange}\n`;
      md += `- Target Roles: ${(p.topRoles || []).join(', ')}\n\n`;
    });

    md += `## 3. Existing Skills\n`;
    plan.existingSkills.forEach(s => {
      md += `- **${s.name}** (${s.proficiency}): ${s.relevance}\n`;
    });
    md += `\n`;

    md += `## 4. Identified Skill Gaps\n`;
    plan.identifiedSkillGaps.forEach(g => {
      md += `### [${g.priority} Priority] ${g.name}\n`;
      md += `- **Importance:** ${g.importanceReason}\n`;
      md += `- **Action:** ${g.recommendedApproach}\n\n`;
    });

    md += `## 5. Personalized Learning Roadmap (${plan.personalizedLearningRoadmap.totalDuration})\n`;
    plan.personalizedLearningRoadmap.stages.forEach(st => {
      md += `### ${st.title} (${st.duration})\n`;
      md += `*Commitment: ${st.weeklyCommitment}*\n\n`;
      md += `${st.focusDescription}\n\n`;
      md += `**Key Topics:**\n`;
      (st.keyTopics || []).forEach(t => md += `- ${t}\n`);
      md += `\n**Milestone Target:** ${st.milestone}\n`;
      if (st.deliverable) md += `**Deliverable:** ${st.deliverable}\n`;
      md += `\n`;
    });

    md += `## 6. Recommended Courses and Resources\n`;
    plan.recommendedCoursesAndResources.forEach(c => {
      md += `- **${c.title}** [${c.type} - ${c.provider}]: ${c.skillCovered}\n`;
    });
    md += `\n`;

    md += `## 7. Suggested Practical Projects\n`;
    plan.suggestedPracticalProjects.forEach(p => {
      md += `### ${p.title} (${p.level})\n`;
      md += `${p.description}\n`;
      md += `**Tech Stack:** ${(p.techStack || []).join(', ')}\n`;
      if (p.resumeImpact) md += `**Resume Impact:** ${p.resumeImpact}\n`;
      md += `\n`;
    });

    return md;
  }

  // Theme Toggle
  themeToggleBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    themeToggleBtn.innerHTML = next === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    showToast(`Switched to ${next} theme`);
  });

  // Settings Modal Controls
  const toggleApiKeyVisBtn = document.getElementById('toggleApiKeyVisBtn');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');

  toggleApiKeyVisBtn.addEventListener('click', () => {
    const isPass = geminiApiKeyInput.type === 'password';
    geminiApiKeyInput.type = isPass ? 'text' : 'password';
    toggleApiKeyVisBtn.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
  });

  function openModal() {
    settingsModal.style.display = 'flex';
  }
  function closeModal() {
    settingsModal.style.display = 'none';
  }

  engineStatusBtn.addEventListener('click', openModal);
  openSettingsBtn.addEventListener('click', openModal);
  closeSettingsBtn.addEventListener('click', closeModal);
  cancelSettingsBtn.addEventListener('click', closeModal);

  const footerSettings = document.getElementById('footerSettingsLink');
  if (footerSettings) footerSettings.addEventListener('click', openModal);

  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = geminiApiKeyInput.value.trim();
    const model = document.getElementById('geminiModelSelect').value;

    const res = await API.updateSettings({
      geminiKey: key,
      geminiModel: model
    });

    if (res.success) {
      showToast('Settings saved successfully!');
      closeModal();
      await refreshEngineStatus();
    } else {
      showToast(res.error || 'Failed to update settings', 'error');
    }
  });
});
