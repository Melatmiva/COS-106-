/**
 * COS 106 - Student Portfolio & Academic Planner
 * Main Javascript Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- GLOBAL FUNCTIONALITY ---
  initNavigation();
  initTheme();
  initScrollReveal();

  // --- PAGE-SPECIFIC INITIALIZATION ---
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1);

  // Initialize features based on current page
  if (pageName === 'index.html' || pageName === '') {
    initHomepage();
  } else if (pageName === 'about.html') {
    initAboutPage();
  } else if (pageName === 'projects.html') {
    initProjectsPage();
  } else if (pageName === 'planner.html') {
    initPlannerPage();
  } else if (pageName === 'contact.html') {
    initContactPage();
  }
});

/**
 * Mobile Navigation & Header Scroll State
 */
function initNavigation() {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navWrapper = document.querySelector('.nav-links-wrapper') || document.querySelector('.nav-links');

  // Header scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (navToggle && navWrapper) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navWrapper.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navWrapper.contains(e.target)) {
        navToggle.classList.remove('active');
        navWrapper.classList.remove('active');
      }
    });

    // Close menu on link click
    navWrapper.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navWrapper.classList.remove('active');
      });
    });
  }

  // Set active class on current link
  const currentPath = window.location.pathname;
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkFile = link.getAttribute('href');
    if (linkFile === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Dark/Light Theme Switching Logic
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle-btn');
  if (!themeToggle) return;

  // Retrieve saved preference or check system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || !savedTheme || prefersLight) {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  // Handle theme button click
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

/**
 * Scroll Reveal Animations
 */
function initScrollReveal() {
  // Find all elements with scroll-reveal class
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Homepage Features
 */
function initHomepage() {
  const greetingEl = document.getElementById('dynamic-greeting');
  if (greetingEl) {
    const hour = new Date().getHours();
    let greeting = 'Hello';
    
    if (hour < 12) {
      greeting = 'Good Morning';
    } else if (hour < 17) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }
    
    greetingEl.textContent = `${greeting}, welcome to my portfolio`;
  }
}

/**
 * About Me Page Features
 */
function initAboutPage() {
  // Skills Filtering
  const filterChips = document.querySelectorAll('.skills-filter .filter-chip');
  const skillTags = document.querySelectorAll('.skills-grid .skill-tag');

  if (filterChips.length && skillTags.length) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Update active class
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.getAttribute('data-filter');

        skillTags.forEach(tag => {
          const categories = tag.getAttribute('data-categories').split(' ');
          if (filter === 'all' || categories.includes(filter)) {
            tag.style.display = 'inline-flex';
            tag.style.opacity = '1';
          } else {
            tag.style.display = 'none';
            tag.style.opacity = '0';
          }
        });
      });
    });
  }

  // Custom Audio Player (Simulated Presentation podcast)
  const audioPlayBtn = document.getElementById('audio-play-btn');
  const audioProgress = document.getElementById('audio-progress');
  const audioProgressBar = document.getElementById('audio-progress-bar');
  const audioTime = document.getElementById('audio-time');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');

  if (audioPlayBtn && audioProgress && audioProgressBar && audioTime) {
    // Generate simulated audio nodes or just use a browser Audio element with an oscillator
    // Since we don't want external file dependencies to fail, we'll simulate a 45-second audio intro
    // using JS timers, and synthesize a gentle ambient hum using the Web Audio API if allowed.
    let isPlaying = false;
    let duration = 45; // 45 seconds intro
    let currentTime = 0;
    let progressTimer = null;
    let audioContext = null;
    let oscillator = null;
    let gainNode = null;

    function formatTime(secs) {
      const minutes = Math.floor(secs / 60);
      const seconds = Math.floor(secs % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function togglePlayback() {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    }

    function playAudio() {
      isPlaying = true;
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';

      // Start Synthesizer (adds a tactile web element feedback!)
      try {
        if (!audioContext) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        // Setup oscillator for a low synth hum representing "narration" voice frequency
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime); // Voice pitch
        
        // Modulate frequency to make it sound slightly dynamic (like speech rhythm)
        const speechModulator = setInterval(() => {
          if (!isPlaying || !oscillator) {
            clearInterval(speechModulator);
            return;
          }
          // Modulate frequency slightly
          const pitch = 130 + Math.random() * 40;
          if (oscillator && audioContext) {
            oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
          }
        }, 300);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Low volume
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
      } catch (err) {
        console.log("Audio synthesis not supported or blocked by permissions: ", err);
      }

      progressTimer = setInterval(() => {
        currentTime += 0.5;
        if (currentTime >= duration) {
          currentTime = duration;
          pauseAudio();
          currentTime = 0;
        }
        updateProgressUI();
      }, 500);
    }

    function pauseAudio() {
      isPlaying = false;
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }

      // Stop Synthesizer
      if (oscillator) {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch(e){}
        oscillator = null;
      }
    }

    function updateProgressUI() {
      const pct = (currentTime / duration) * 100;
      audioProgress.style.width = `${pct}%`;
      audioTime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }

    audioPlayBtn.addEventListener('click', togglePlayback);

    // Interactive scrubbing
    audioProgressBar.addEventListener('click', (e) => {
      const rect = audioProgressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickedPct = clickX / width;
      
      currentTime = clickedPct * duration;
      updateProgressUI();

      if (isPlaying) {
        // Re-align synth
        pauseAudio();
        playAudio();
      }
    });

    // Initialize UI
    audioTime.textContent = `0:00 / ${formatTime(duration)}`;
    pauseIcon.style.display = 'none';
  }
}

/**
 * Projects Page Features
 */
function initProjectsPage() {
  const filterChips = document.querySelectorAll('.projects-gallery-header .filter-chip');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterChips.length && projectCards.length) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
}

/**
 * Academic Planner Page
 */
function initPlannerPage() {
  const plannerForm = document.getElementById('planner-form');
  const taskListEl = document.getElementById('task-list');
  const totalTasksEl = document.getElementById('total-tasks');
  const completedTasksEl = document.getElementById('completed-tasks');
  const plannerProgressInner = document.getElementById('planner-progress-inner');
  const progressPercentEl = document.getElementById('progress-percent');
  const filterButtons = document.querySelectorAll('.planner-header-row .filter-chip');

  // Default tasks if local storage is empty
  const defaultTasks = [
    { id: 1, title: 'Read Chapter 4: Semantic Elements', category: 'reading', dueDate: '2026-07-15', priority: 'medium', completed: true },
    { id: 2, title: 'Complete Lab 3 CSS Layout Exercises', category: 'assignment', dueDate: '2026-07-18', priority: 'high', completed: false },
    { id: 3, title: 'COS 106 Quiz 2 Prep', category: 'exam', dueDate: '2026-07-20', priority: 'high', completed: false },
    { id: 4, title: 'Review JavaScript Arrays Video Lecture', category: 'reading', dueDate: '2026-07-22', priority: 'low', completed: false }
  ];

  // Retrieve tasks
  let tasks = JSON.parse(localStorage.getItem('cos106_tasks'));
  if (!tasks || tasks.length === 0) {
    tasks = defaultTasks;
    saveTasks();
  }

  let activeFilter = 'all';

  function saveTasks() {
    localStorage.setItem('cos106_tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    taskListEl.innerHTML = '';
    
    // Filter tasks
    const filteredTasks = tasks.filter(task => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'active') return !task.completed;
      if (activeFilter === 'completed') return task.completed;
      return true;
    });

    // Update statistics
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    totalTasksEl.textContent = totalCount;
    completedTasksEl.textContent = completedCount;
    plannerProgressInner.style.width = `${completionPct}%`;
    progressPercentEl.textContent = `${completionPct}%`;

    // Render Empty State if no tasks match filter
    if (filteredTasks.length === 0) {
      taskListEl.innerHTML = `
        <li class="empty-state">
          <p>No tasks found matching this criteria.</p>
        </li>
      `;
      return;
    }

    filteredTasks.forEach(task => {
      const taskCard = document.createElement('li');
      taskCard.className = `task-card ${task.completed ? 'completed' : ''}`;
      taskCard.setAttribute('data-id', task.id);

      // Render priority badge
      let badgeClass = 'badge-medium';
      if (task.priority === 'high') badgeClass = 'badge-high';
      if (task.priority === 'low') badgeClass = 'badge-low';

      // Formatting date format: YYYY-MM-DD
      const formattedDate = task.dueDate ? task.dueDate : 'No due date';

      taskCard.innerHTML = `
        <div class="task-checkbox-container">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task as completed">
          <div class="task-details">
            <span class="task-title">${escapeHTML(task.title)}</span>
            <div class="task-meta-row">
              <span class="task-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                ${escapeHTML(task.category)}
              </span>
              <span class="task-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${formattedDate}
              </span>
              <span class="task-badge ${badgeClass}">${task.priority}</span>
            </div>
          </div>
        </div>
        <button class="task-delete-btn" aria-label="Delete Task">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      `;

      // Event listeners for individual card interactions
      const checkbox = taskCard.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        if (task.completed) {
          taskCard.classList.add('completed');
        } else {
          taskCard.classList.remove('completed');
        }
        saveTasks();
        renderTasks();
      });

      const deleteBtn = taskCard.querySelector('.task-delete-btn');
      deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      });

      taskListEl.appendChild(taskCard);
    });
  }

  // Add Task Form submission listener
  if (plannerForm) {
    plannerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const titleInput = document.getElementById('task-title-input');
      const categoryInput = document.getElementById('task-category-select');
      const dueDateInput = document.getElementById('task-date-input');
      const priorityInput = document.getElementById('task-priority-select');

      const titleVal = titleInput.value.trim();
      if (!titleVal) {
        alert('Please enter a task description.');
        titleInput.focus();
        return;
      }

      const newTask = {
        id: Date.now(),
        title: titleVal,
        category: categoryInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        completed: false
      };

      tasks.push(newTask);
      saveTasks();
      renderTasks();

      // Reset form fields
      titleInput.value = '';
      dueDateInput.value = '';
    });
  }

  // Bind filter chips
  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        renderTasks();
      });
    });
  }

  // Render initial set of tasks
  renderTasks();
}

/**
 * Contact Page Form Validation
 */
function initContactPage() {
  const contactForm = document.getElementById('contact-form');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (!contactForm) return;

  const fields = [
    { id: 'name', type: 'text', required: true, validation: (val) => val.length > 0, errorMsg: 'Name is required' },
    { 
      id: 'email', 
      type: 'email', 
      required: true, 
      validation: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 
      errorMsg: 'Please enter a valid email address' 
    },
    { 
      id: 'phone', 
      type: 'tel', 
      required: true, 
      validation: (val) => /^\d+$/.test(val), 
      errorMsg: 'Phone number must contain digits only' 
    },
    { id: 'message', type: 'text', required: true, validation: (val) => val.length > 0, errorMsg: 'Message is required' }
  ];

  // Enable interactive validation error clearing on input
  fields.forEach(field => {
    const inputEl = document.getElementById(field.id);
    if (inputEl) {
      inputEl.addEventListener('input', () => {
        const val = inputEl.value.trim();
        const parent = inputEl.closest('.form-group');
        
        // Remove error class if user is currently correcting input
        if (field.validation(val)) {
          parent.classList.remove('has-error');
        }
      });
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    fields.forEach(field => {
      const inputEl = document.getElementById(field.id);
      if (inputEl) {
        const val = inputEl.value.trim();
        const parent = inputEl.closest('.form-group');
        const errorEl = parent.querySelector('.form-error-msg');

        if (!val && field.required) {
          parent.classList.add('has-error');
          errorEl.textContent = 'This field is required';
          isFormValid = false;
        } else if (!field.validation(val)) {
          parent.classList.add('has-error');
          errorEl.textContent = field.errorMsg;
          isFormValid = false;
        } else {
          parent.classList.remove('has-error');
        }
      }
    });

    if (isFormValid) {
      // Trigger dynamic contact success feedback
      if (modalOverlay) {
        modalOverlay.classList.add('active');
      } else {
        alert('Thank you for your message! Your submission was successful.');
      }
      contactForm.reset();
    }
  });

  // Modal Close Action
  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }
}

/**
 * Escapes characters to prevent XSS in rendering
 */
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
