/**
 * Career Planning Agent - UI Component Renderers
 */

const Components = {
  // 1. Render Student Profile Analysis
  renderProfileAnalysis(analysis) {
    if (!analysis) return;

    document.getElementById('analysisSummaryText').textContent = analysis.summary || 'Profile analysis complete.';
    document.getElementById('analysisCurrentStanding').textContent = analysis.currentStanding || 'Ready for Upskilling';
    document.getElementById('analysisEstimatedTime').textContent = analysis.estimatedTimeToJobReady || '4 - 6 Months';
    document.getElementById('analysisFeasibilityRating').textContent = analysis.feasibilityRating || 'High';

    // Strengths list
    const strengthsContainer = document.getElementById('analysisStrengthsList');
    strengthsContainer.innerHTML = '';
    (analysis.strengths || []).forEach(str => {
      const li = document.createElement('li');
      li.textContent = str;
      strengthsContainer.appendChild(li);
    });

    // Key Advice
    const adviceBox = document.getElementById('analysisAdviceBox');
    adviceBox.innerHTML = `<strong>Strategic Counsel:</strong> ${analysis.keyAdvice || 'Focus on building demonstrable projects and consistent daily practice.'}`;
  },

  // 2. Render Recommended Career Paths (3 Paths)
  renderCareerPaths(paths) {
    const container = document.getElementById('careerPathsContainer');
    container.innerHTML = '';

    if (!paths || !Array.isArray(paths)) return;

    paths.slice(0, 3).forEach((path, idx) => {
      const card = document.createElement('div');
      card.className = `career-path-card ${idx === 0 ? 'primary-fit' : ''}`;
      
      const rolesHTML = (path.topRoles || [])
        .map(r => `<span class="role-pill">${r}</span>`)
        .join('');

      card.innerHTML = `
        <div class="card-top-row">
          <span class="match-score-badge">
            <i class="fa-solid fa-chart-simple"></i> ${path.matchScore || 90}% Match
          </span>
          ${idx === 0 ? '<span class="section-tag success">Top Recommendation</span>' : ''}
        </div>
        <h4>${path.title}</h4>
        <p class="career-summary-text">${path.summary}</p>
        <div class="career-meta-box">
          <div class="career-meta-item">
            <span class="meta-k"><i class="fa-solid fa-fire"></i> Market Demand:</span>
            <span class="meta-v">${path.marketDemand || 'High'}</span>
          </div>
          <div class="career-meta-item">
            <span class="meta-k"><i class="fa-solid fa-money-bill-wave"></i> Typical Salary:</span>
            <span class="meta-v">${path.typicalSalaryRange || 'Competitive'}</span>
          </div>
          <div class="career-meta-item" style="flex-direction: column; gap: 4px; margin-top: 4px;">
            <span class="meta-k"><i class="fa-solid fa-briefcase"></i> Associated Roles:</span>
            <div class="target-roles-tags">${rolesHTML}</div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  // 3. Render Existing Skills
  renderExistingSkills(skills) {
    const container = document.getElementById('existingSkillsContainer');
    container.innerHTML = '';

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      container.innerHTML = '<p class="section-desc">No specific skills parsed.</p>';
      return;
    }

    skills.forEach(skill => {
      const item = document.createElement('div');
      item.className = 'skill-item-card';
      item.innerHTML = `
        <div class="skill-item-header">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-badge">${skill.proficiency || 'Foundational'} &bull; ${skill.category || 'Tech'}</span>
        </div>
        <div class="skill-rel-text">${skill.relevance || 'Directly transferable to target role'}</div>
      `;
      container.appendChild(item);
    });
  },

  // 4. Render Identified Skill Gaps
  renderSkillGaps(gaps) {
    const container = document.getElementById('skillGapsContainer');
    container.innerHTML = '';

    if (!gaps || !Array.isArray(gaps) || gaps.length === 0) {
      container.innerHTML = '<p class="section-desc">No critical gaps detected.</p>';
      return;
    }

    gaps.forEach(gap => {
      const prioClass = (gap.priority || '').toLowerCase();
      const item = document.createElement('div');
      item.className = 'gap-item-card';
      item.innerHTML = `
        <div class="gap-item-header">
          <span class="gap-title">${gap.name}</span>
          <span class="gap-priority ${prioClass}">${gap.priority || 'High'} Priority</span>
        </div>
        <p class="gap-reason"><strong>Why it matters:</strong> ${gap.importanceReason}</p>
        <div class="gap-approach">
          <i class="fa-solid fa-bullseye"></i>
          <span><strong>Action:</strong> ${gap.recommendedApproach}</span>
        </div>
      `;
      container.appendChild(item);
    });
  },

  // 5. Render Personalized Learning Roadmap
  renderRoadmap(roadmap) {
    const container = document.getElementById('roadmapTimelineContainer');
    container.innerHTML = '';

    if (!roadmap || !roadmap.stages) return;

    const durationBadge = document.getElementById('roadmapDurationBadge');
    if (durationBadge) {
      durationBadge.textContent = roadmap.totalDuration || 'Phased Roadmap';
    }

    roadmap.stages.forEach((stage, idx) => {
      const card = document.createElement('div');
      card.className = 'timeline-stage-card';
      card.id = `roadmapStage_${idx}`;

      const topicsHTML = (stage.keyTopics || [])
        .map(t => `<span class="topic-tag">${t}</span>`)
        .join('');

      card.innerHTML = `
        <div class="stage-top-bar">
          <div class="stage-title-wrap">
            <div class="stage-checkbox-wrap">
              <input type="checkbox" id="chk_stage_${idx}" data-stage-idx="${idx}" class="stage-complete-chk">
            </div>
            <h4>${stage.title}</h4>
          </div>
          <div class="stage-meta-pills">
            <span class="stage-duration-pill"><i class="fa-regular fa-calendar"></i> ${stage.duration || 'Weeks'}</span>
            <span class="stage-commitment-pill"><i class="fa-regular fa-clock"></i> ${stage.weeklyCommitment || '14 hrs/wk'}</span>
          </div>
        </div>
        <p class="stage-desc">${stage.focusDescription}</p>
        <div class="stage-topics-tags">${topicsHTML}</div>
        <div class="stage-deliverable-box">
          <i class="fa-solid fa-flag-checkered"></i>
          <span><strong>Milestone Target:</strong> ${stage.milestone}</span>
        </div>
        ${stage.deliverable ? `
          <div class="stage-deliverable-box" style="border-color: rgba(99, 102, 241, 0.3);">
            <i class="fa-solid fa-box-archive text-primary"></i>
            <span><strong>Deliverable:</strong> ${stage.deliverable}</span>
          </div>
        ` : ''}
      `;
      container.appendChild(card);
    });

    // Checkbox completion listeners
    document.querySelectorAll('.stage-complete-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const stageCard = document.getElementById(`roadmapStage_${e.target.dataset.stageIdx}`);
        if (e.target.checked) {
          stageCard.classList.add('completed');
        } else {
          stageCard.classList.remove('completed');
        }
        Components.updateProgress();
      });
    });

    Components.updateProgress();
  },

  updateProgress() {
    const checkboxes = document.querySelectorAll('.stage-complete-chk');
    if (!checkboxes.length) return;
    const checked = document.querySelectorAll('.stage-complete-chk:checked').length;
    const pct = Math.round((checked / checkboxes.length) * 100);

    const progressBar = document.getElementById('roadmapProgressBar');
    const progressText = document.getElementById('roadmapProgressPercent');
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `${pct}% Completed (${checked}/${checkboxes.length} Stages)`;
  },

  // 6. Render Recommended Courses & Resources
  renderCourses(courses) {
    const container = document.getElementById('coursesGridContainer');
    container.innerHTML = '';

    if (!courses || !Array.isArray(courses)) return;

    courses.forEach(c => {
      const typeClass = (c.type || '').toLowerCase().includes('free') ? 'free' : 'paid';
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <div class="course-top">
          <span class="course-type-badge ${typeClass}">${c.type || 'Recommended'}</span>
          <span class="course-provider">${c.provider || 'Online'}</span>
        </div>
        <h4>${c.title}</h4>
        <p class="course-skill"><i class="fa-solid fa-award"></i> ${c.skillCovered}</p>
        <div class="course-bottom">
          <span><i class="fa-regular fa-clock"></i> ${c.estimatedDuration || 'Self-paced'}</span>
          <a href="${c.urlHint && c.urlHint.startsWith('http') ? c.urlHint : 'https://www.google.com/search?q=' + encodeURIComponent(c.title + ' ' + (c.provider || ''))}" 
             target="_blank" rel="noopener noreferrer" class="course-link">
            Explore <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  },

  // 7. Render Suggested Practical Projects
  renderProjects(projects) {
    const container = document.getElementById('projectsGridContainer');
    container.innerHTML = '';

    if (!projects || !Array.isArray(projects)) return;

    projects.forEach(p => {
      const lvl = (p.level || 'Intermediate').toLowerCase();
      const card = document.createElement('div');
      card.className = `project-card ${lvl === 'capstone' ? 'capstone' : ''}`;

      const stackHTML = (p.techStack || [])
        .map(t => `<span class="tech-tag">${t}</span>`)
        .join('');

      card.innerHTML = `
        <span class="project-level-badge ${lvl}">${p.level || 'Project'}</span>
        <h4>${p.title}</h4>
        <p class="project-desc">${p.description}</p>
        <div class="project-tech-stack">${stackHTML}</div>
        ${p.resumeImpact ? `
          <div class="project-resume-box">
            <i class="fa-solid fa-file-invoice"></i> <strong>Resume Bullet:</strong> ${p.resumeImpact}
          </div>
        ` : ''}
      `;
      container.appendChild(card);
    });
  },

  // 8. Render Career Prep Tips (Tabs)
  activeTabTips: {},
  renderCareerTips(tips) {
    if (!tips) return;
    this.activeTabTips = tips;
    this.showTipTab('resume');
  },

  showTipTab(tabKey) {
    const content = document.getElementById('tipsTabContent');
    content.innerHTML = '';

    const listMap = {
      resume: {
        items: this.activeTabTips.resumeTips || [],
        icon: 'fa-file-lines'
      },
      github: {
        items: this.activeTabTips.gitHubPortfolioTips || [],
        icon: 'fa-github'
      },
      linkedin: {
        items: this.activeTabTips.linkedInNetworkingTips || [],
        icon: 'fa-linkedin'
      },
      interview: {
        items: this.activeTabTips.interviewPreparation || [],
        icon: 'fa-user-tie'
      }
    };

    const target = listMap[tabKey] || listMap.resume;
    target.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'tip-item-card';
      card.innerHTML = `
        <i class="fa-solid ${target.icon}"></i>
        <div>${item}</div>
      `;
      content.appendChild(card);
    });

    // Update active tab buttons
    document.querySelectorAll('.tip-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  // Render Suggested Follow-up Questions
  renderFollowUpQuestions(questions, onSelect) {
    const container = document.getElementById('suggestedQuestionsContainer');
    container.innerHTML = '';

    if (!questions || !Array.isArray(questions)) return;

    questions.forEach(q => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'suggested-chip';
      chip.textContent = q;
      chip.addEventListener('click', () => {
        if (onSelect) onSelect(q);
      });
      container.appendChild(chip);
    });
  },

  // Append a chat message
  appendChatMessage(sender, text) {
    const log = document.getElementById('refinementChatLog');
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender === 'user' ? 'user-message' : 'agent-message'}`;

    const icon = sender === 'user' ? 'fa-user' : 'fa-robot';
    msg.innerHTML = `
      <div class="avatar"><i class="fa-solid ${icon}"></i></div>
      <div class="bubble"><p>${text}</p></div>
    `;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
  }
};

window.Components = Components;
