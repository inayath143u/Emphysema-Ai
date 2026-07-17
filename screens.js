/* EmphysemaAI Component Screen Module */
import { store, MOCK_DOCTORS, MOCK_TIPS } from './state.js';

// Helper: Get visual icon for notifications
function getNotifIcon(type) {
  switch (type) {
    case 'alert': return '<i class="fa-solid fa-triangle-exclamation" style="color: var(--critical);"></i>';
    case 'appointment': return '<i class="fa-solid fa-calendar-check" style="color: var(--accent-secondary);"></i>';
    case 'info':
    default: return '<i class="fa-solid fa-circle-info" style="color: var(--accent-primary);"></i>';
  }
}

// Inline SVGs for elegant iconography
const LUNG_SVG = `
<svg viewBox="0 0 100 100" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M48 20V32M52 20V32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <path d="M40 32C30 35 15 42 12 58C9 74 22 84 32 82C40 80 44 72 45 68C46 64 47 62 48 62H52C53 62 54 64 55 68C56 72 60 80 68 82C78 84 91 74 88 58C85 42 70 35 60 32" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="58" r="4" fill="currentColor" opacity="0.3"/>
  <circle cx="68" cy="58" r="4" fill="currentColor" opacity="0.3"/>
  <path d="M22 68C28 72 32 68 32 68" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M78 68C72 72 68 68 68 68" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

export const Screens = {
  
  // 1. SPLASH SCREEN
  splash: {
    render(container) {
      container.innerHTML = `
        <div class="splash-container">
          <div class="splash-logo fade-in">
            ${LUNG_SVG}
          </div>
          <h1 class="splash-title">EmphysemaAI</h1>
          <p class="splash-subtitle">AI-Powered Pulmonary Diagnostic Suite</p>
        </div>
      `;
    },
    bind(container) {
      setTimeout(() => {
        if (store.state.onboardingCompleted) {
          store.setScreen('login');
        } else {
          store.setScreen('onboarding');
        }
      }, 2500);
    }
  },

  // 2. ONBOARDING SCREEN
  onboarding: {
    render(container) {
      container.innerHTML = `
        <div class="onboarding-container fade-in">
          <div class="onboarding-pages">
            <div class="onboarding-page active" data-page="0">
              <div class="onboarding-img"><i class="fa-solid fa-microscope"></i></div>
              <h2>AI Scan Diagnostics</h2>
              <p>Upload a chest CT or scan report and receive instantaneous, AI-driven diagnostics with localized severity assessments.</p>
            </div>
            <div class="onboarding-page" data-page="1">
              <div class="onboarding-img"><i class="fa-solid fa-user-doctor"></i></div>
              <h2>Expert Consultations</h2>
              <p>Direct telehealth consultations with top pulmonary surgeons and critical care specialists, all on a secure layout.</p>
            </div>
            <div class="onboarding-page" data-page="2">
              <div class="onboarding-img"><i class="fa-solid fa-heart-pulse"></i></div>
              <h2>Breathing & Tracker Tools</h2>
              <p>Improve dynamic capacity with breathing pacing exercises and stay on top of medicine checklists.</p>
            </div>
          </div>

          <div class="onboarding-indicators">
            <div class="indicator active" data-dot="0"></div>
            <div class="indicator" data-dot="1"></div>
            <div class="indicator" data-dot="2"></div>
          </div>

          <div class="onboarding-controls">
            <button class="btn btn-secondary" id="onboarding-skip">Skip</button>
            <button class="btn btn-primary" id="onboarding-next">Next <i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      `;
    },
    bind(container) {
      let currentPage = 0;
      const pages = container.querySelectorAll('.onboarding-page');
      const dots = container.querySelectorAll('.indicator');
      const nextBtn = container.querySelector('#onboarding-next');
      const skipBtn = container.querySelector('#onboarding-skip');

      function showPage(index) {
        pages.forEach((p, i) => p.classList.toggle('active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        
        if (index === 2) {
          nextBtn.innerHTML = 'Get Started <i class="fa-solid fa-circle-check"></i>';
        } else {
          nextBtn.innerHTML = 'Next <i class="fa-solid fa-arrow-right"></i>';
        }
      }

      nextBtn.addEventListener('click', () => {
        if (currentPage < 2) {
          currentPage++;
          showPage(currentPage);
        } else {
          store.completeOnboarding();
        }
      });

      skipBtn.addEventListener('click', () => {
        store.completeOnboarding();
      });
    }
  },

  // 3. LOGIN & SIGNUP SCREENS
  login: {
    render(container) {
      container.innerHTML = `
        <div class="auth-container fade-in">
          <div class="auth-header">
            <i class="fa-solid fa-shield-lung"></i>
            <h2>Welcome Back</h2>
            <p>Access your EmphysemaAI clinical dashboard</p>
          </div>
          <form class="auth-form" id="login-form">
            <div class="input-group">
              <label class="input-label">Email Address</label>
              <input type="email" class="form-input" id="auth-email" placeholder="name@domain.com" required>
              <div class="input-error-msg" id="email-error"></div>
            </div>
            <div class="input-group">
              <label class="input-label">Password</label>
              <input type="password" class="form-input" id="auth-password" placeholder="••••••••" required>
              <div class="input-error-msg" id="password-error"></div>
            </div>
            <button type="submit" class="btn btn-primary mb-3">Proceed Securely</button>
          </form>
          <div class="auth-footer">
            Don't have an account? <a href="#" id="go-signup" style="color: var(--accent-primary);">Register here</a>
          </div>
        </div>
      `;
    },
    bind(container) {
      const form = container.querySelector('#login-form');
      const goSignup = container.querySelector('#go-signup');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = container.querySelector('#auth-email').value.trim();
        const password = container.querySelector('#auth-password').value;
        const emailError = container.querySelector('#email-error');
        const passwordError = container.querySelector('#password-error');

        emailError.textContent = '';
        passwordError.textContent = '';

        if (!validateEmail(email)) {
          emailError.textContent = 'Please enter a valid email address';
          return;
        }

        if (password.length < 6) {
          passwordError.textContent = 'Password must be at least 6 characters';
          return;
        }

        const res = await store.authenticateUser(email, password);
        if (!res.success) {
          passwordError.textContent = res.error;
        }
      });

      goSignup.addEventListener('click', (e) => {
        e.preventDefault();
        store.setScreen('signup');
      });
    }
  },

  signup: {
    render(container) {
      container.innerHTML = `
        <div class="auth-container fade-in">
          <div class="auth-header">
            <i class="fa-solid fa-user-plus"></i>
            <h2>Create Account</h2>
            <p>Start tracking your lung capacity and consulting doctors</p>
          </div>
          <form class="auth-form" id="signup-form">
            <div class="input-group">
              <label class="input-label">Full Name</label>
              <input type="text" class="form-input" id="signup-name" placeholder="John Doe" required>
            </div>
            <div class="input-group">
              <label class="input-label">Email Address</label>
              <input type="email" class="form-input" id="signup-email" placeholder="name@domain.com" required>
              <div class="input-error-msg" id="email-error"></div>
            </div>
            <div class="input-group">
              <label class="input-label">Password</label>
              <input type="password" class="form-input" id="signup-password" placeholder="Min. 6 characters" required>
              <div class="input-error-msg" id="password-error"></div>
            </div>
            <button type="submit" class="btn btn-primary mb-3">Sign Up</button>
          </form>
          <div class="auth-footer">
            Already have an account? <a href="#" id="go-login" style="color: var(--accent-primary);">Log In</a>
          </div>
        </div>
      `;
    },
    bind(container) {
      const form = container.querySelector('#signup-form');
      const goLogin = container.querySelector('#go-login');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = container.querySelector('#signup-name').value.trim();
        const email = container.querySelector('#signup-email').value.trim();
        const password = container.querySelector('#signup-password').value;
        const emailError = container.querySelector('#email-error');
        const passwordError = container.querySelector('#password-error');

        emailError.textContent = '';
        passwordError.textContent = '';

        if (!validateEmail(email)) {
          emailError.textContent = 'Please enter a valid email address';
          return;
        }

        if (password.length < 6) {
          passwordError.textContent = 'Password must be at least 6 characters';
          return;
        }

        const res = await store.registerUser(email, password, name, 'patient');
        if (!res.success) {
          emailError.textContent = res.error;
        }
      });

      goLogin.addEventListener('click', (e) => {
        e.preventDefault();
        store.setScreen('login');
      });
    }
  },



  // 6. PATIENT PORTAL WRAPPER
  patient_wrapper: {
    render(container, subTab = 'home') {
      container.innerHTML = `
        <div id="patient-app" style="height:100%; display:flex; flex-direction:column; position:relative;">
          <div class="scroll-container" id="patient-body"></div>
          
          <nav class="bottom-nav">
            <div class="nav-item ${subTab === 'home' ? 'active' : ''}" data-tab="home">
              <i class="fa-solid fa-house-chimney"></i>
              <span>Home</span>
            </div>
            <div class="nav-item ${subTab === 'analytics' ? 'active' : ''}" data-tab="analytics">
              <i class="fa-solid fa-chart-line"></i>
              <span>Analytics</span>
            </div>
            <div class="nav-item ${subTab === 'consult' ? 'active' : ''}" data-tab="consult">
              <i class="fa-solid fa-user-doctor"></i>
              <span>Consult</span>
            </div>
            <div class="nav-item ${subTab === 'tools' ? 'active' : ''}" data-tab="tools">
              <i class="fa-solid fa-gears"></i>
              <span>Tools</span>
            </div>
            <div class="nav-item ${subTab === 'profile' ? 'active' : ''}" data-tab="profile">
              <i class="fa-solid fa-user-gear"></i>
              <span>Profile</span>
            </div>
          </nav>
        </div>
      `;
    },
    bind(container, subTab = 'home') {
      const body = container.querySelector('#patient-body');
      
      // Render active sub-view
      this.renderSubTab(body, subTab);

      const navItems = container.querySelectorAll('.nav-item');
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          const tab = item.getAttribute('data-tab');
          navItems.forEach(nav => nav.classList.remove('active'));
          item.classList.add('active');
          this.renderSubTab(body, tab);
        });
      });
    },

    renderSubTab(subContainer, tab) {
      subContainer.scrollTop = 0;
      if (tab === 'home') {
        const lastScan = store.state.scans[0] || { severity: 0, status: 'Healthy', label: 'No scan data' };
        const statusClass = lastScan.status === 'Critical' ? 'status-critical' : 'status-healthy';
        const recentScansHtml = store.state.scans.slice(0, 2).map(scan => `
          <div class="activity-item type-${scan.status.toLowerCase()}">
            <div class="activity-details">
              <h5>${scan.type}</h5>
              <p>${scan.date}</p>
            </div>
            <span class="activity-badge" style="color: ${scan.status === 'Critical' ? 'var(--critical)' : 'var(--success)'};">
              ${scan.severity}% Severity (${scan.status})
            </span>
          </div>
        `).join('');

        subContainer.innerHTML = `
          <div class="fade-in">
            <!-- Header -->
            <div class="dashboard-header">
              <div>
                <p style="color: var(--text-secondary); font-size:14px;">Good Morning,</p>
                <h2 style="font-size:24px;">${store.state.user?.name || 'Pulmonary Patient'}</h2>
              </div>
              <div class="user-profile-shortcut" id="header-profile-btn">
                ${(store.state.user?.name || 'P').charAt(0).toUpperCase()}
              </div>
            </div>

            <!-- Health Status Card -->
            <div class="glass-card health-status-card ${statusClass} mb-5" id="go-scan-results-direct">
              <div class="health-info">
                <span style="color: var(--text-muted); font-size:12px; font-weight:600; text-transform:uppercase;">Last Diagnostic Result</span>
                <h3 style="font-size:20px; margin: 4px 0 8px 0;">
                  ${lastScan.status === 'Critical' ? 'COPD / Emphysema Detected' : 'Healthy Lungs'}
                </h3>
                <span class="health-status-badge">
                  <i class="fa-solid ${lastScan.status === 'Critical' ? 'fa-circle-exclamation' : 'fa-circle-check'} mb-1" style="margin-right:4px;"></i>
                  Severity Index: ${lastScan.severity}%
                </span>
              </div>
              <div class="health-icon-container">
                <i class="fa-solid fa-lungs"></i>
              </div>
            </div>

            <!-- Service Grid -->
            <div class="services-section">
              <h3 class="section-title">Quick Services</h3>
              <div class="service-grid">
                <div class="service-item" id="srv-upload">
                  <div class="service-icon-box"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                  <h4>Upload Scan</h4>
                </div>
                <div class="service-item" id="srv-exercise">
                  <div class="service-icon-box"><i class="fa-solid fa-wind"></i></div>
                  <h4>Breathing</h4>
                </div>
                <div class="service-item" id="srv-medication">
                  <div class="service-icon-box"><i class="fa-solid fa-pills"></i></div>
                  <h4>Medications</h4>
                </div>
                <div class="service-item" id="srv-hospitals">
                  <div class="service-icon-box"><i class="fa-solid fa-map-location-dot"></i></div>
                  <h4>Find Clinics</h4>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="activity-section">
              <div class="section-title">
                <h3>Recent Scans</h3>
                <a href="#" id="view-history-btn" style="font-size: 13px; color: var(--accent-primary); text-decoration:none;">View History</a>
              </div>
              <div class="activity-list">
                ${recentScansHtml || '<p style="color:var(--text-secondary); font-size:13px; text-align:center; padding:16px;">No scan history found.</p>'}
              </div>
            </div>
          </div>
        `;

        // Home Bindings
        subContainer.querySelector('#header-profile-btn').addEventListener('click', () => {
          const profileItem = document.querySelector('.nav-item[data-tab="profile"]');
          if (profileItem) profileItem.click();
        });

        subContainer.querySelector('#go-scan-results-direct').addEventListener('click', () => {
          if (store.state.scans[0]) {
            Screens.result.render(document.getElementById('app'), store.state.scans[0]);
            Screens.result.bind(document.getElementById('app'), store.state.scans[0]);
          }
        });

        subContainer.querySelector('#srv-upload').addEventListener('click', () => {
          Screens.scan.render(document.getElementById('app'));
          Screens.scan.bind(document.getElementById('app'));
        });

        subContainer.querySelector('#srv-exercise').addEventListener('click', () => {
          Screens.breathing_exercise.render(document.getElementById('app'));
          Screens.breathing_exercise.bind(document.getElementById('app'));
        });

        subContainer.querySelector('#srv-medication').addEventListener('click', () => {
          Screens.medication.render(document.getElementById('app'));
          Screens.medication.bind(document.getElementById('app'));
        });

        subContainer.querySelector('#srv-hospitals').addEventListener('click', () => {
          Screens.hospitals_map.render(document.getElementById('app'));
          Screens.hospitals_map.bind(document.getElementById('app'));
        });

        subContainer.querySelector('#view-history-btn').addEventListener('click', (e) => {
          e.preventDefault();
          Screens.history.render(document.getElementById('app'));
          Screens.history.bind(document.getElementById('app'));
        });

      } else if (tab === 'analytics') {
        const stats = store.state.analyticsData;
        const avgSpO2 = Math.round(stats.oxygenLevels.reduce((a, b) => a + b, 0) / stats.oxygenLevels.length);
        const avgFEV1 = (stats.lungCapacity.reduce((a, b) => a + b, 0) / stats.lungCapacity.length).toFixed(1);

        subContainer.innerHTML = `
          <div class="fade-in">
            <h2 class="mb-4">Pulmonary Analytics</h2>
            
            <div class="analytics-summary">
              <div class="glass-card summary-stat">
                <h6>Avg SpO2 (Oxygen)</h6>
                <p>${avgSpO2}%</p>
              </div>
              <div class="glass-card summary-stat">
                <h6>Avg FEV1 (Lung Vol)</h6>
                <p>${avgFEV1} L</p>
              </div>
            </div>

            <div class="glass-card chart-card mb-5">
              <h4 class="mb-3">Lung Volume FEV1 (Liters)</h4>
              <div class="chart-wrapper">
                <canvas id="fev1-chart"></canvas>
              </div>
            </div>

            <div class="glass-card chart-card mb-5">
              <h4 class="mb-3">Oxygen Saturation SpO2 (%)</h4>
              <div class="chart-wrapper">
                <canvas id="spo2-chart"></canvas>
              </div>
            </div>
          </div>
        `;

        // Setup ChartJS charts
        setTimeout(() => {
          const fevCtx = document.getElementById('fev1-chart');
          const spo2Ctx = document.getElementById('spo2-chart');
          
          if (fevCtx && spo2Ctx && window.Chart) {
            new window.Chart(fevCtx, {
              type: 'line',
              data: {
                labels: stats.labels,
                datasets: [{
                  label: 'FEV1 (Liters)',
                  data: stats.lungCapacity,
                  borderColor: '#00f2fe',
                  backgroundColor: 'rgba(0, 242, 254, 0.1)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.3
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                  x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
              }
            });

            new window.Chart(spo2Ctx, {
              type: 'line',
              data: {
                labels: stats.labels,
                datasets: [{
                  label: 'SpO2 %',
                  data: stats.oxygenLevels,
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.3
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, min: 90, max: 100 },
                  x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
              }
            });
          }
        }, 50);

      } else if (tab === 'consult') {
        const doctorsHtml = MOCK_DOCTORS.map(doc => `
          <div class="glass-card doctor-card" data-doc-id="${doc.id}">
            <div class="doctor-avatar-box">
              <img class="doctor-avatar" src="${doc.avatar}" alt="${doc.name}">
              ${doc.online ? '<div class="online-badge"></div>' : ''}
            </div>
            <div class="doctor-info-col">
              <h4>${doc.name}</h4>
              <p class="doctor-specialty">${doc.specialty}</p>
              <div class="doctor-meta">
                <span><i class="fa-solid fa-star"></i> ${doc.rating}</span>
                <span>•</span>
                <span>${doc.experience} Years Exp</span>
                <span>•</span>
                <span>${doc.fees}</span>
              </div>
            </div>
            <button class="btn btn-primary btn-book-doc" data-doc-id="${doc.id}" style="padding: 8px 16px; font-size:12px;">Book</button>
          </div>
        `).join('');

        subContainer.innerHTML = `
          <div class="fade-in">
            <h2 class="mb-1">Pulmonologists</h2>
            <p style="color:var(--text-secondary); font-size:14px; margin-bottom:16px;">Schedule telemedicine checks with specialists</p>

            <div class="input-group">
              <input type="text" class="form-input" id="search-doc" placeholder="Search doctor by name or specialty...">
            </div>

            <div class="filters-row">
              <div class="filter-badge active" data-filter="all">All Specialties</div>
              <div class="filter-badge" data-filter="online">Online Now</div>
              <div class="filter-badge" data-filter="experienced">10+ Years Exp</div>
            </div>

            <div class="doctors-list">
              ${doctorsHtml}
            </div>
          </div>
        `;

        // Binding Book Buttons & Filters
        const bookBtns = subContainer.querySelectorAll('.btn-book-doc');
        bookBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const docId = parseInt(btn.getAttribute('data-doc-id'));
            const doc = MOCK_DOCTORS.find(d => d.id === docId);
            Screens.appointment_booking.render(document.getElementById('app'), doc);
            Screens.appointment_booking.bind(document.getElementById('app'), doc);
          });
        });

        // Simple live search filters
        const searchInput = subContainer.querySelector('#search-doc');
        const filterBadges = subContainer.querySelectorAll('.filter-badge');
        const doctorCards = subContainer.querySelectorAll('.doctor-card');

        function applyFilters() {
          const query = searchInput.value.toLowerCase();
          const activeFilter = subContainer.querySelector('.filter-badge.active').getAttribute('data-filter');

          doctorCards.forEach(card => {
            const docId = parseInt(card.getAttribute('data-doc-id'));
            const doc = MOCK_DOCTORS.find(d => d.id === docId);
            
            const matchQuery = doc.name.toLowerCase().includes(query) || doc.specialty.toLowerCase().includes(query);
            let matchFilter = true;

            if (activeFilter === 'online') {
              matchFilter = doc.online;
            } else if (activeFilter === 'experienced') {
              matchFilter = doc.experience >= 10;
            }

            if (matchQuery && matchFilter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }

        searchInput.addEventListener('input', applyFilters);
        filterBadges.forEach(badge => {
          badge.addEventListener('click', () => {
            filterBadges.forEach(b => b.classList.remove('active'));
            badge.classList.add('active');
            applyFilters();
          });
        });

      } else if (tab === 'tools') {
        subContainer.innerHTML = `
          <div class="fade-in">
            <h2 class="mb-4">Pulmonary Health Tools</h2>

            <div class="service-grid">
              <div class="service-item" id="tool-upload">
                <div class="service-icon-box"><i class="fa-solid fa-lungs"></i></div>
                <h4>AI Diagnostics</h4>
              </div>
              <div class="service-item" id="tool-exercise">
                <div class="service-icon-box"><i class="fa-solid fa-wind"></i></div>
                <h4>Guided Breathing</h4>
              </div>
              <div class="service-item" id="tool-meds">
                <div class="service-icon-box"><i class="fa-solid fa-prescription-bottle-medical"></i></div>
                <h4>Medication Log</h4>
              </div>
              <div class="service-item" id="tool-chatbot">
                <div class="service-icon-box"><i class="fa-solid fa-comment-medical"></i></div>
                <h4>AI Symptom Bot</h4>
              </div>
              <div class="service-item" id="tool-tips">
                <div class="service-icon-box"><i class="fa-solid fa-book-medical"></i></div>
                <h4>Health Articles</h4>
              </div>
              <div class="service-item" id="tool-map">
                <div class="service-icon-box"><i class="fa-solid fa-compass"></i></div>
                <h4>Hospitals Locator</h4>
              </div>
              <div class="service-item" id="tool-notif">
                <div class="service-icon-box"><i class="fa-solid fa-bell"></i></div>
                <h4>Alert Feed</h4>
              </div>
              <div class="service-item" id="tool-report">
                <div class="service-icon-box"><i class="fa-solid fa-file-pdf"></i></div>
                <h4>Export PDF</h4>
              </div>
            </div>
          </div>
        `;

        // Direct tools linking
        subContainer.querySelector('#tool-upload').addEventListener('click', () => {
          Screens.scan.render(document.getElementById('app'));
          Screens.scan.bind(document.getElementById('app'));
        });
        subContainer.querySelector('#tool-exercise').addEventListener('click', () => {
          Screens.breathing_exercise.render(document.getElementById('app'));
          Screens.breathing_exercise.bind(document.getElementById('app'));
        });
        subContainer.querySelector('#tool-meds').addEventListener('click', () => {
          Screens.medication.render(document.getElementById('app'));
          Screens.medication.bind(document.getElementById('app'));
        });
        subContainer.querySelector('#tool-chatbot').addEventListener('click', () => {
          Screens.chatbot.render(document.getElementById('app'));
          Screens.chatbot.bind(document.getElementById('app'));
        });
        subContainer.querySelector('#tool-tips').addEventListener('click', () => {
          Screens.health_tips.render(document.getElementById('app'));
          Screens.health_tips.bind(document.getElementById('app'));
        });
        subContainer.querySelector('#tool-map').addEventListener('click', () => {
          Screens.hospitals_map.render(document.getElementById('app'));
          Screens.hospitals_map.bind(document.getElementById('app'));
        });
        subContainer.querySelector('#tool-notif').addEventListener('click', () => {
          Screens.notifications.render(document.getElementById('app'));
          Screens.notifications.bind(document.getElementById('app'));
        });
        subContainer.querySelector('#tool-report').addEventListener('click', () => {
          Screens.report_download.render(document.getElementById('app'));
          Screens.report_download.bind(document.getElementById('app'));
        });

      } else if (tab === 'profile') {
        const u = store.state.user || { name: 'John Doe', email: 'john@doe.com', bio: 'Pulmonary Patient', biometricEnabled: false };
        
        subContainer.innerHTML = `
          <div class="fade-in">
            <h2 class="mb-4">Profile & Settings</h2>

            <div class="glass-card mb-5 text-center">
              <div class="user-profile-shortcut" style="width: 72px; height: 72px; font-size:32px; margin: 0 auto 16px auto;">
                ${u.name.charAt(0).toUpperCase()}
              </div>
              <h3>${u.name}</h3>
              <p style="color:var(--text-secondary); font-size:14px; margin-top:4px;">${u.email}</p>
            </div>

            <form id="profile-edit-form" class="glass-card mb-5">
              <h4 class="mb-4">Personal Details</h4>
              <div class="input-group">
                <label class="input-label">Full Name</label>
                <input type="text" class="form-input" id="profile-name" value="${u.name}">
              </div>
              <div class="input-group">
                <label class="input-label">Medical Bio Notes</label>
                <textarea class="form-input" id="profile-bio" rows="3" style="resize:none;">${u.bio}</textarea>
              </div>
              <div class="input-group" style="flex-direction:row; justify-content:space-between; align-items:center;">
                <div>
                  <label class="input-label" style="font-size:14px;">Biometric Access</label>
                  <p style="color:var(--text-muted); font-size:11px;">Toggle fingerprint / FaceID login capability</p>
                </div>
                <input type="checkbox" id="profile-bio-toggle" ${u.biometricEnabled ? 'checked' : ''} style="width:20px; height:20px; cursor:pointer;">
              </div>
              <button type="submit" class="btn btn-primary w-100" style="margin-top:16px; width:100%;">Save Profiles Details</button>
            </form>

            <div class="glass-card mb-5">
              <h4 class="mb-3">Account Operations</h4>
              <div style="display:flex; gap:12px;">
                <button class="btn btn-danger" id="prof-logout" style="flex:1;"><i class="fa-solid fa-power-off"></i> Log Out</button>
              </div>
            </div>
          </div>
        `;

        // Bind profile form submit
        const profileForm = subContainer.querySelector('#profile-edit-form');
        profileForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const nm = subContainer.querySelector('#profile-name').value.trim();
          const bi = subContainer.querySelector('#profile-bio').value.trim();
          const bioChecked = subContainer.querySelector('#profile-bio-toggle').checked;
          
          store.updateProfile(nm, bi, bioChecked);
          alert('Profile credentials updated successfully.');
        });

        // Log out trigger
        subContainer.querySelector('#prof-logout').addEventListener('click', () => {
          store.logout();
        });
      }
    }
  },

  // 7. DIAGNOSTIC SCAN INTERFACE
  scan: {
    render(container) {
      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="scan-back-btn"><i class="fa-solid fa-arrow-left"></i> Back</button>
            <h2>AI Lung Diagnosis</h2>
          </div>

          <div class="glass-card text-center mb-5">
            <h4 class="mb-2">Instructions</h4>
            <p style="color: var(--text-secondary); font-size:13px; line-height:1.6;">
              Please upload a high-resolution Chest CT scan or raw X-Ray image. Ensure the lung boundaries are clearly visible with minimal glare for our deep learning model.
            </p>
          </div>

          <!-- Tabs to select mode: Upload or Camera -->
          <div class="filters-row" style="justify-content:center;">
            <div class="filter-badge active" id="mode-upload-tab">Upload Image File</div>
            <div class="filter-badge" id="mode-camera-tab">Live Capture Scan</div>
          </div>

          <!-- File Upload Box -->
          <div id="file-upload-mode-box">
            <div class="scan-area" id="drop-zone">
              <i class="fa-solid fa-file-medical"></i>
              <div>
                <h4 class="mb-1">Select / Drop CT Report</h4>
                <p style="color: var(--text-muted); font-size:12px;">Supports PNG, JPG, JPEG formats (Max 10MB)</p>
              </div>
              <input type="file" id="ct-file-input" class="file-input" accept="image/*">
              <button class="btn btn-secondary">Browse Local Files</button>
            </div>
          </div>

          <!-- Camera Stream Simulator -->
          <div id="camera-stream-mode-box" style="display:none;">
            <div class="camera-frame">
              <!-- Visual Mock Stream -->
              <div class="camera-overlay">
                <div class="camera-guide-box">
                  <div class="scanner-overlay-line" style="animation: scanLineAnimation 3s infinite linear;"></div>
                </div>
              </div>
              <div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; background:#0b111e; color:var(--text-secondary); font-size:14px;">
                <i class="fa-solid fa-camera" style="margin-right:8px;"></i> Simulating Optical Cam Input...
              </div>
              <div class="camera-controls">
                <button class="camera-shutter" id="shutter-btn" title="Snaps simulated CT scan"></button>
              </div>
            </div>
            <p class="text-center" style="color:var(--text-muted); font-size:12px; margin-top:-12px; margin-bottom:24px;">Align your diagnostic printout inside the frame guidelines</p>
          </div>
        </div>
      `;
    },
    bind(container) {
      const backBtn = container.querySelector('#scan-back-btn');
      const dropZone = container.querySelector('#drop-zone');
      const fileInput = container.querySelector('#ct-file-input');
      const uploadTab = container.querySelector('#mode-upload-tab');
      const cameraTab = container.querySelector('#mode-camera-tab');
      const uploadBox = container.querySelector('#file-upload-mode-box');
      const cameraBox = container.querySelector('#camera-stream-mode-box');
      const shutterBtn = container.querySelector('#shutter-btn');

      backBtn.addEventListener('click', () => {
        store.setScreen('dashboard');
      });

      // Tab switcher
      uploadTab.addEventListener('click', () => {
        uploadTab.classList.add('active');
        cameraTab.classList.remove('active');
        uploadBox.style.display = 'block';
        cameraBox.style.display = 'none';
      });

      cameraTab.addEventListener('click', () => {
        cameraTab.classList.add('active');
        uploadTab.classList.remove('active');
        cameraBox.style.display = 'block';
        uploadBox.style.display = 'none';
      });

      // Drop/Click event handlers
      dropZone.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          triggerProcessing(e.target.files[0].name);
        }
      });

      shutterBtn.addEventListener('click', () => {
        triggerProcessing('camera_capture_img.jpg');
      });

      function triggerProcessing(fileName) {
        Screens.scan_processing.render(document.getElementById('app'), fileName);
        Screens.scan_processing.bind(document.getElementById('app'), fileName);
      }
    }
  },

  // 8. SCAN PROCESSING ANIMATION
  scan_processing: {
    render(container, fileName) {
      container.innerHTML = `
        <div class="processing-container fade-in">
          <div class="pulsing-lung-container">
            <div class="scanner-overlay-line"></div>
            <div class="lung-svg-icon">
              ${LUNG_SVG}
            </div>
          </div>
          <h3 class="mb-1" style="font-family: var(--font-heading);">AI Pulmonary Analysis In Progress</h3>
          <p style="color: var(--text-secondary); font-size:14px;">Computing tissue opacity map from "${fileName}"</p>
          
          <div class="progress-track">
            <div class="progress-bar" id="processing-bar"></div>
          </div>
          
          <p id="processing-status" style="color: var(--text-muted); font-size:12px;">Initializing tensors...</p>
        </div>
      `;
    },
    bind(container, fileName) {
      const progressBar = container.querySelector('#processing-bar');
      const statusText = container.querySelector('#processing-status');

      const statuses = [
        { progress: 15, text: 'Filtering artifacts & loading weights...' },
        { progress: 40, text: 'Running segmentation on lung margins...' },
        { progress: 70, text: 'Mapping voxel densities in alveolar air sacs...' },
        { progress: 90, text: 'Calculating severity metrics & diagnostic indexes...' },
        { progress: 100, text: 'Finalizing diagnostics...' }
      ];

      let currentIndex = 0;

      const timer = setInterval(() => {
        if (currentIndex < statuses.length) {
          const step = statuses[currentIndex];
          progressBar.style.width = `${step.progress}%`;
          statusText.textContent = step.text;
          currentIndex++;
        } else {
          clearInterval(timer);
          
          // Random scan results generation
          const isCritical = Math.random() > 0.4;
          const severity = isCritical ? Math.floor(Math.random() * 40) + 55 : Math.floor(Math.random() * 20) + 5;
          const label = isCritical 
            ? 'Severe tissue damage: Signs of Centrilobular Emphysema detected.'
            : 'Unremarkable lung density: Alveoli show normal elasticity & capacity.';
          const status = isCritical ? 'Critical' : 'Healthy';

          store.addScan('Lung CT Scan Analyser', severity, label, status).then(newScan => {
            // Redirect to result screen
            Screens.result.render(document.getElementById('app'), newScan);
            Screens.result.bind(document.getElementById('app'), newScan);
          }).catch(err => {
            console.error("Failed to add scan: ", err);
          });
        }
      }, 800);
    }
  },

  // 9. DIAGNOSTIC RESULTS SCREEN
  result: {
    render(container, scanResult) {
      const isCritical = scanResult.status === 'Critical';
      
      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="res-back-btn"><i class="fa-solid fa-arrow-left"></i> Home</button>
            <h2>Diagnostic Report</h2>
          </div>

          <div class="glass-card text-center mb-5" style="border-top: 4px solid ${isCritical ? 'var(--critical)' : 'var(--success)'}">
            <p style="color:var(--text-muted); font-size:12px; text-transform:uppercase; font-weight:600;">Diagnostic Classification</p>
            <h2 style="font-size:24px; color: ${isCritical ? 'var(--critical)' : 'var(--success)'}; margin: 8px 0;">
              ${isCritical ? 'Emphysema Detected' : 'No Signs of Emphysema'}
            </h2>
            <p style="color:var(--text-secondary); font-size:13px; line-height:1.6;">${scanResult.label}</p>
          </div>

          <div class="glass-card result-gauge-box mb-5">
            <div class="severity-gauge" id="severity-conic-gauge">
              <div class="gauge-content">
                <div class="gauge-percentage">${scanResult.severity}%</div>
                <div class="severity-label">Severity Level</div>
              </div>
            </div>
            <p style="color:var(--text-secondary); font-size:14px; text-align:center;">
              Severity index falls within the <strong style="color: ${isCritical ? 'var(--critical)' : 'var(--success)'}">${isCritical ? 'CRITICAL' : 'HEALTHY'}</strong> range.
            </p>
          </div>

          <div class="glass-card mb-5">
            <h4 class="mb-3">Clinical Recommendations</h4>
            <ul style="color:var(--text-secondary); font-size:13px; padding-left:20px; line-height:1.7;">
              ${isCritical 
                ? '<li>Schedule a pulmonary consultation immediately.</li><li>Practice guided pursed-lip breathing daily.</li><li>Avoid exposure to secondhand smoke or dusty environment.</li>'
                : '<li>Maintain cardiorespiratory exercises regularly.</li><li>Upload a check-up scan in 6 months to monitor lung condition.</li><li>Avoid pulmonary irritants.</li>'}
            </ul>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            ${isCritical 
              ? '<button class="btn btn-danger" id="res-consult-btn"><i class="fa-solid fa-user-doctor"></i> Schedule Telehealth Booking</button>' 
              : ''}
            <button class="btn btn-secondary" id="res-done-btn">Back to Dashboard</button>
          </div>
        </div>
      `;
    },
    bind(container, scanResult) {
      const backBtn = container.querySelector('#res-back-btn');
      const doneBtn = container.querySelector('#res-done-btn');
      const consultBtn = container.querySelector('#res-consult-btn');
      const conicGauge = container.querySelector('#severity-conic-gauge');

      // Animate conical gradient
      setTimeout(() => {
        const color = scanResult.status === 'Critical' ? 'var(--critical)' : 'var(--success)';
        if (conicGauge) {
          conicGauge.style.background = `conic-gradient(${color} 0% ${scanResult.severity}%, var(--bg-tertiary) ${scanResult.severity}% 100%)`;
        }
      }, 100);

      // Trigger Confetti if Healthy!
      if (scanResult.status === 'Healthy' && window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      function goHome() {
        store.setScreen('dashboard');
      }

      backBtn.addEventListener('click', goHome);
      doneBtn.addEventListener('click', goHome);

      if (consultBtn) {
        consultBtn.addEventListener('click', () => {
          // Go direct to doctor consult list
          store.setScreen('dashboard');
          setTimeout(() => {
            const consultItem = document.querySelector('.nav-item[data-tab="consult"]');
            if (consultItem) consultItem.click();
          }, 100);
        });
      }
    }
  },

  // 10. APPOINTMENT BOOKING SCREEN (Calendar + Slots)
  appointment_booking: {
    render(container, doctor) {
      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="apt-back-btn"><i class="fa-solid fa-arrow-left"></i> Doctor List</button>
            <h2>Booking Calendar</h2>
          </div>

          <div class="glass-card doctor-card mb-5">
            <img class="doctor-avatar" src="${doctor.avatar}" alt="${doctor.name}">
            <div class="doctor-info-col">
              <h4>${doctor.name}</h4>
              <p class="doctor-specialty">${doctor.specialty}</p>
              <div class="doctor-meta">
                <span><i class="fa-solid fa-star" style="color:var(--warning)"></i> ${doctor.rating}</span>
                <span>•</span>
                <span>Experience: ${doctor.experience} yrs</span>
              </div>
            </div>
          </div>

          <div class="glass-card mb-5">
            <h4 class="mb-3 text-center">Select Appointment Date</h4>
            
            <div class="calendar-grid">
              <div class="calendar-day-header">Mo</div>
              <div class="calendar-day-header">Tu</div>
              <div class="calendar-day-header">We</div>
              <div class="calendar-day-header">Th</div>
              <div class="calendar-day-header">Fr</div>
              <div class="calendar-day-header">Sa</div>
              <div class="calendar-day-header">Su</div>
              
              <!-- Dummy calendar starting mid-week -->
              <div class="calendar-day disabled">12</div>
              <div class="calendar-day disabled">13</div>
              <div class="calendar-day" data-date="2026-07-14">14</div>
              <div class="calendar-day selected" data-date="2026-07-15">15</div>
              <div class="calendar-day" data-date="2026-07-16">16</div>
              <div class="calendar-day" data-date="2026-07-17">17</div>
              <div class="calendar-day" data-date="2026-07-18">18</div>
              <div class="calendar-day" data-date="2026-07-19">19</div>
              <div class="calendar-day" data-date="2026-07-20">20</div>
              <div class="calendar-day" data-date="2026-07-21">21</div>
              <div class="calendar-day" data-date="2026-07-22">22</div>
              <div class="calendar-day" data-date="2026-07-23">23</div>
              <div class="calendar-day" data-date="2026-07-24">24</div>
              <div class="calendar-day" data-date="2026-07-25">25</div>
            </div>
          </div>

          <div class="glass-card mb-5">
            <h4 class="mb-3">Available Consult Slots</h4>
            <div class="time-slots-container">
              <div class="time-slot" data-time="09:00 AM">09:00 AM</div>
              <div class="time-slot selected" data-time="10:00 AM">10:00 AM</div>
              <div class="time-slot" data-time="11:30 AM">11:30 AM</div>
              <div class="time-slot" data-time="02:00 PM">02:00 PM</div>
              <div class="time-slot" data-time="03:30 PM">03:30 PM</div>
              <div class="time-slot" data-time="04:30 PM">04:30 PM</div>
            </div>
          </div>

          <button class="btn btn-primary" id="confirm-booking-btn" style="width:100%;">Confirm Telehealth Schedule</button>
        </div>
      `;
    },
    bind(container, doctor) {
      const backBtn = container.querySelector('#apt-back-btn');
      const confirmBtn = container.querySelector('#confirm-booking-btn');
      const days = container.querySelectorAll('.calendar-day:not(.disabled)');
      const slots = container.querySelectorAll('.time-slot');

      let selectedDate = '2026-07-15';
      let selectedTime = '10:00 AM';

      backBtn.addEventListener('click', () => {
        store.setScreen('dashboard');
        setTimeout(() => {
          const consultItem = document.querySelector('.nav-item[data-tab="consult"]');
          if (consultItem) consultItem.click();
        }, 100);
      });

      days.forEach(day => {
        day.addEventListener('click', () => {
          days.forEach(d => d.classList.remove('selected'));
          day.classList.add('selected');
          selectedDate = day.getAttribute('data-date');
        });
      });

      slots.forEach(slot => {
        slot.addEventListener('click', () => {
          slots.forEach(s => s.classList.remove('selected'));
          slot.classList.add('selected');
          selectedTime = slot.getAttribute('data-time');
        });
      });

      confirmBtn.addEventListener('click', () => {
        store.bookAppointment(doctor, selectedDate, selectedTime);
        alert(`Appointment successfully scheduled with ${doctor.name} on ${selectedDate} at ${selectedTime}.`);
        
        // Go to home tab
        store.setScreen('dashboard');
      });
    }
  },

  // 11. VIDEO CONSULT INTERFACE (Live calling simulation)
  video_consult: {
    render(container, appointment) {
      const doc = appointment.doctor;
      container.innerHTML = `
        <div class="video-consult-container fade-in">
          
          <!-- Mock Doc Video Feed -->
          <div class="video-view-doctor" id="video-feed-doctor" style="background-image: url('${doc.avatar}');">
            <div class="video-doctor-overlay">
              <h3 style="color:#fff; font-size:22px; font-family:var(--font-heading);">${doc.name}</h3>
              <p style="color:var(--accent-primary); font-size:12px;"><i class="fa-solid fa-circle-dot"></i> Telehealth Session Live</p>
            </div>
            
            <!-- Patient Camera Overlay -->
            <div class="video-view-patient" id="video-feed-patient" style="background-image: url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');">
            </div>
          </div>

          <!-- Bottom Control Bar -->
          <div class="video-controls-row">
            <button class="btn-circle btn-circle-mute" id="vid-mute" title="Mute Mic"><i class="fa-solid fa-microphone"></i></button>
            <button class="btn-circle btn-circle-camera" id="vid-cam" title="Toggle Cam"><i class="fa-solid fa-video"></i></button>
            <button class="btn-circle btn-circle-end" id="vid-end" title="End Session"><i class="fa-solid fa-phone-slash"></i></button>
          </div>
        </div>
      `;
    },
    bind(container, appointment) {
      const muteBtn = container.querySelector('#vid-mute');
      const camBtn = container.querySelector('#vid-cam');
      const endBtn = container.querySelector('#vid-end');
      const patientFeed = container.querySelector('#video-feed-patient');

      let muted = false;
      let camOff = false;

      muteBtn.addEventListener('click', () => {
        muted = !muted;
        muteBtn.classList.toggle('active', muted);
        muteBtn.innerHTML = muted ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
      });

      camBtn.addEventListener('click', () => {
        camOff = !camOff;
        camBtn.classList.toggle('active', camOff);
        patientFeed.style.opacity = camOff ? '0' : '1';
        camBtn.innerHTML = camOff ? '<i class="fa-solid fa-video-slash"></i>' : '<i class="fa-solid fa-video"></i>';
      });

      endBtn.addEventListener('click', () => {
        if (confirm('End telehealth consultation?')) {
          alert('Teleconsultation ended. Session metrics logged.');
          store.setScreen('dashboard');
        }
      });
    }
  },

  // 12. HOSPITALS MAP ACTIVITY
  hospitals_map: {
    render(container) {
      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="map-back-btn"><i class="fa-solid fa-arrow-left"></i> Back</button>
            <h2>Respiratory Clinics</h2>
          </div>
          
          <div class="glass-card mb-4">
            <p style="color:var(--text-secondary); font-size:13px;">Find specialized clinics & emergency pulmonary centers nearby</p>
          </div>

          <!-- Leaflet container -->
          <div id="clinics-leaflet-map" class="map-container"></div>
        </div>
      `;
    },
    bind(container) {
      const backBtn = container.querySelector('#map-back-btn');
      backBtn.addEventListener('click', () => {
        store.setScreen('dashboard');
      });

      // Leaflet Map Init
      setTimeout(() => {
        const mapDiv = document.getElementById('clinics-leaflet-map');
        if (!mapDiv || !window.L) return;

        // Mock center coordinates: San Francisco pulmonology centers
        const sfCoords = [37.7749, -122.4194];
        const map = window.L.map('clinics-leaflet-map').setView(sfCoords, 13);

        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        const markers = [
          { name: 'UCSF Respiratory Care Clinic', coords: [37.7634, -122.4578], desc: 'Specialized clinic focusing on COPD & Emphysema therapy.' },
          { name: 'St. Mary Pulmonary Institute', coords: [37.7725, -122.4521], desc: 'CT diagnostic scanners, dynamic capacity lab assessments.' },
          { name: 'Bay Area Respiratory Emergency Lab', coords: [37.7892, -122.4014], desc: '24/7 acute breathing support & nebulization therapies.' }
        ];

        markers.forEach(pin => {
          const marker = window.L.marker(pin.coords).addTo(map);
          marker.bindPopup(`
            <div style="font-family: 'Inter', sans-serif;">
              <h4 style="margin:0 0 6px 0; color:#00f2fe; font-size:14px;">${pin.name}</h4>
              <p style="margin:0; font-size:12px; color:#e2e8f0;">${pin.desc}</p>
            </div>
          `);
        });

      }, 100);
    }
  },

  // 13. GUIDED BREATHING EXERCISE TIMER
  breathing_exercise: {
    render(container) {
      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="breath-back-btn"><i class="fa-solid fa-arrow-left"></i> Back</button>
            <h2>Guided Breathing</h2>
          </div>

          <div class="glass-card mb-5 text-center">
            <h4 class="mb-2">Lung Expansion Pacing</h4>
            <p style="color:var(--text-secondary); font-size:13px; line-height:1.5;">
              Practicing breathing helps expand alveoli capacity and clear trapped carbon dioxide. Follow the expanding circle.
            </p>
          </div>

          <!-- Expanding Circle Timer Frame -->
          <div class="glass-card breathing-box" id="breath-tracker-frame">
            <div class="breathing-circle-outer">
              <div class="breathing-circle-inner" id="breath-circle-node">
                <span class="breath-circle-label" id="breath-inner-text">Start</span>
              </div>
            </div>
          </div>

          <div class="text-center" style="margin-top:24px;">
            <p id="breath-phase-desc" style="font-size:15px; font-weight:600; color:var(--accent-primary); margin-bottom:16px;">Click the circle to start training</p>
            <button class="btn btn-primary" id="breath-start-btn" style="padding: 14px 40px;">Begin Workout</button>
          </div>
        </div>
      `;
    },
    bind(container) {
      const backBtn = container.querySelector('#breath-back-btn');
      const startBtn = container.querySelector('#breath-start-btn');
      const frame = container.querySelector('#breath-tracker-frame');
      const innerText = container.querySelector('#breath-inner-text');
      const phaseDesc = container.querySelector('#breath-phase-desc');

      let timer = null;
      let active = false;

      backBtn.addEventListener('click', () => {
        clearInterval(timer);
        store.setScreen('dashboard');
      });

      function startRoutine() {
        active = true;
        startBtn.textContent = 'Stop Workout';
        startBtn.classList.replace('btn-primary', 'btn-secondary');
        
        let step = 0; // 0 = Inhale, 1 = Hold, 2 = Exhale, 3 = Hold
        const cycle = [
          { text: 'Inhale', desc: 'Breath in slowly through your nose...', class: 'inhale', duration: 4 },
          { text: 'Hold', desc: 'Hold your breath, relax shoulders...', class: 'hold', duration: 4 },
          { text: 'Exhale', desc: 'Exhale slowly through pursed lips...', class: 'exhale', duration: 4 },
          { text: 'Hold', desc: 'Rest before the next breath...', class: 'hold', duration: 4 }
        ];

        function runCycle() {
          const phase = cycle[step % 4];
          
          // Clear old classes
          frame.className = 'glass-card breathing-box';
          frame.classList.add(phase.class);
          
          innerText.textContent = phase.text;
          phaseDesc.textContent = phase.desc;

          // Countdown
          let count = phase.duration;
          
          timer = setTimeout(() => {
            step++;
            if (active) runCycle();
          }, phase.duration * 1000);
        }

        runCycle();
      }

      function stopRoutine() {
        active = false;
        clearTimeout(timer);
        frame.className = 'glass-card breathing-box';
        innerText.textContent = 'Start';
        phaseDesc.textContent = 'Session completed! Your lungs feel refreshed.';
        startBtn.textContent = 'Begin Workout';
        startBtn.classList.replace('btn-secondary', 'btn-primary');

        if (window.confetti) {
          window.confetti({ particleCount: 75, spread: 60 });
        }
      }

      startBtn.addEventListener('click', () => {
        if (!active) {
          startRoutine();
        } else {
          stopRoutine();
        }
      });
    }
  },

  // 14. MEDICATION CHECKLIST TRACKER
  medication: {
    render(container) {
      const medsHtml = store.state.medications.map(med => `
        <div class="med-item ${med.taken ? 'taken' : ''}" data-med-id="${med.id}">
          <div class="med-info">
            <h4>${med.name}</h4>
            <p>${med.dosage} • Scheduled: ${med.time}</p>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="btn-checkbox" data-checkbox-id="${med.id}">
              <i class="fa-solid fa-check"></i>
            </div>
            <button class="btn btn-text btn-delete-med" data-delete-id="${med.id}" style="color:var(--text-muted);"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="med-back-btn"><i class="fa-solid fa-arrow-left"></i> Back</button>
            <h2>Medication Log</h2>
          </div>

          <div class="glass-card mb-5">
            <h4 class="mb-3">Daily Checklist</h4>
            <div class="med-tracker-list">
              ${medsHtml || '<p style="color:var(--text-secondary); text-align:center;">No medications configured.</p>'}
            </div>
          </div>

          <form class="glass-card" id="add-med-form">
            <h4 class="mb-3">Configure Medication</h4>
            <div class="input-group">
              <label class="input-label">Medication Name</label>
              <input type="text" class="form-input" id="new-med-name" placeholder="e.g. Spiriva Respimat" required>
            </div>
            <div class="input-group">
              <label class="input-label">Dosage Instructions</label>
              <input type="text" class="form-input" id="new-med-dose" placeholder="e.g. 2 inhalations" required>
            </div>
            <div class="input-group">
              <label class="input-label">Reminder Time</label>
              <input type="text" class="form-input" id="new-med-time" placeholder="e.g. 08:30 AM" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Add Checklist Item</button>
          </form>
        </div>
      `;
    },
    bind(container) {
      const backBtn = container.querySelector('#med-back-btn');
      const form = container.querySelector('#add-med-form');
      const checkboxes = container.querySelectorAll('.btn-checkbox');
      const deleteBtns = container.querySelectorAll('.btn-delete-med');

      backBtn.addEventListener('click', () => {
        store.setScreen('dashboard');
      });

      checkboxes.forEach(box => {
        box.addEventListener('click', () => {
          const medId = parseInt(box.getAttribute('data-checkbox-id'));
          store.toggleMedication(medId);
          // Re-render medication list inside log
          Screens.medication.render(container);
          Screens.medication.bind(container);
        });
      });

      deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const medId = parseInt(btn.getAttribute('data-delete-id'));
          store.removeMedication(medId);
          Screens.medication.render(container);
          Screens.medication.bind(container);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#new-med-name').value.trim();
        const dose = container.querySelector('#new-med-dose').value.trim();
        const time = container.querySelector('#new-med-time').value.trim();

        store.addMedication(name, dose, time);
        alert(`${name} added to daily checklist.`);
        
        Screens.medication.render(container);
        Screens.medication.bind(container);
      });
    }
  },

  // 15. HEALTH TIPS FEED
  health_tips: {
    render(container) {
      const tipsHtml = MOCK_TIPS.map(tip => `
        <div class="glass-card mb-4">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="health-status-badge" style="background:rgba(0, 242, 254, 0.1); color:var(--accent-primary);">${tip.category}</span>
            <span style="font-size:11px; color:var(--text-muted);">${tip.readTime}</span>
          </div>
          <h3 class="mb-2" style="font-size:17px;">${tip.title}</h3>
          <p style="color:var(--text-secondary); font-size:13px; line-height:1.6; margin-bottom:12px;">${tip.content}</p>
          <a href="#" class="btn btn-secondary" style="padding: 6px 12px; font-size:11px;"><i class="fa-solid fa-play"></i> Watch Exercise Guide</a>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="tips-back-btn"><i class="fa-solid fa-arrow-left"></i> Back</button>
            <h2>Pulmonary Library</h2>
          </div>

          <div class="input-group">
            <input type="text" class="form-input" id="search-tips" placeholder="Search pulmonary articles, guidelines...">
          </div>

          <div style="margin-top:16px;">
            ${tipsHtml}
          </div>
        </div>
      `;
    },
    bind(container) {
      const backBtn = container.querySelector('#tips-back-btn');
      backBtn.addEventListener('click', () => {
        store.setScreen('dashboard');
      });

      // Simple local search
      const search = container.querySelector('#search-tips');
      const cards = container.querySelectorAll('.glass-card:not(.dashboard-header)');

      search.addEventListener('input', () => {
        const query = search.value.toLowerCase();
        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          if (text.includes(query)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
  },

  // 16. CHATBOT SCREEN
  chatbot: {
    render(container) {
      const chatHtml = store.state.chatMessages.map(msg => `
        <div class="chat-bubble ${msg.sender}">
          ${msg.text}
        </div>
      `).join('');

      container.innerHTML = `
        <div class="scroll-container fade-in" style="display:flex; flex-direction:column; justify-content:space-between; height:100%; padding-bottom:24px;">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="chat-back-btn"><i class="fa-solid fa-arrow-left"></i> Back</button>
            <h2>AI Medical Bot</h2>
          </div>

          <div class="chatbot-container">
            <div class="chat-history" id="chat-scroller">
              ${chatHtml}
            </div>

            <form class="chat-input-row" id="chat-input-form">
              <input type="text" class="form-input" id="chat-message-text" placeholder="Ask about symptoms or CT diagnostic metrics..." required>
              <button type="submit" class="btn btn-primary" style="padding:14px 20px;"><i class="fa-solid fa-paper-plane"></i></button>
            </form>
          </div>
        </div>
      `;
    },
    bind(container) {
      const backBtn = container.querySelector('#chat-back-btn');
      const form = container.querySelector('#chat-input-form');
      const chatScroller = container.querySelector('#chat-scroller');
      const textInput = container.querySelector('#chat-message-text');

      backBtn.addEventListener('click', () => {
        store.setScreen('dashboard');
      });

      // Scroll to bottom
      chatScroller.scrollTop = chatScroller.scrollHeight;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = textInput.value.trim();
        if (!query) return;

        store.sendChatMessage(query);
        textInput.value = '';

        // Immediate re-render of messages list
        Screens.chatbot.render(container);
        Screens.chatbot.bind(container);
      });
    }
  },

  // 17. HISTORY SEARCH
  history: {
    render(container) {
      const historyItemsHtml = store.state.scans.map(scan => `
        <div class="activity-item type-${scan.status.toLowerCase()} history-card" data-date="${scan.date}">
          <div class="activity-details">
            <h4>${scan.type}</h4>
            <p>${scan.date}</p>
            <span style="font-size:12px; color:var(--text-secondary); display:block; margin-top:4px;">${scan.label}</span>
          </div>
          <div style="text-align:right;">
            <div class="activity-badge" style="color: ${scan.status === 'Critical' ? 'var(--critical)' : 'var(--success)'}; font-size:14px; font-weight:700;">
              ${scan.severity}% Severity
            </div>
            <button class="btn btn-text view-historical-result" data-scan-id="${scan.id}" style="font-size:11px; margin-top:8px; padding:4px;">View Report</button>
          </div>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="history-back-btn"><i class="fa-solid fa-arrow-left"></i> Home</button>
            <h2>Diagnostics History</h2>
          </div>

          <div class="input-group">
            <input type="text" class="form-input" id="search-history" placeholder="Search diagnostic logs by date, classification...">
          </div>

          <div style="display:flex; flex-direction:column; gap:16px; margin-top:16px;">
            ${historyItemsHtml || '<p style="color:var(--text-secondary); text-align:center;">No history records found.</p>'}
          </div>
        </div>
      `;
    },
    bind(container) {
      const backBtn = container.querySelector('#history-back-btn');
      const search = container.querySelector('#search-history');
      const cards = container.querySelectorAll('.history-card');
      const viewReportBtns = container.querySelectorAll('.view-historical-result');

      backBtn.addEventListener('click', () => {
        store.setScreen('dashboard');
      });

      search.addEventListener('input', () => {
        const query = search.value.toLowerCase();
        cards.forEach(card => {
          if (card.textContent.toLowerCase().includes(query)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });

      viewReportBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const scanId = btn.getAttribute('data-scan-id');
          const scan = store.state.scans.find(s => s.id === scanId);
          Screens.result.render(container, scan);
          Screens.result.bind(container, scan);
        });
      });
    }
  },

  // 18. PDF REPORT COMPILER FRAGMENT (jsPDF compilation)
  report_download: {
    render(container) {
      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="rep-back-btn"><i class="fa-solid fa-arrow-left"></i> Back</button>
            <h2>Generate PDF Report</h2>
          </div>

          <div class="glass-card mb-5">
            <h4 class="mb-3">Compile Diagnostic Summary</h4>
            <p style="color:var(--text-secondary); font-size:13px; line-height:1.6; margin-bottom:20px;">
              Select a date range to compile your diagnostics history, FEV1 lung analytics, and medications list into a secure PDF.
            </p>

            <div class="input-group">
              <label class="input-label">Start Date</label>
              <input type="date" class="form-input" id="rep-start-date" value="2026-07-01">
            </div>

            <div class="input-group">
              <label class="input-label">End Date</label>
              <input type="date" class="form-input" id="rep-end-date" value="2026-07-20">
            </div>
          </div>

          <button class="btn btn-primary" id="compile-pdf-btn" style="width:100%;"><i class="fa-solid fa-file-export"></i> Compile & Print Report</button>
        </div>
      `;
    },
    bind(container) {
      const backBtn = container.querySelector('#rep-back-btn');
      const compileBtn = container.querySelector('#compile-pdf-btn');

      backBtn.addEventListener('click', () => {
        store.setScreen('dashboard');
      });

      compileBtn.addEventListener('click', () => {
        const start = container.querySelector('#rep-start-date').value;
        const end = container.querySelector('#rep-end-date').value;

        if (!start || !end) {
          alert('Please enter range boundaries.');
          return;
        }

        // Generate client-side PDF
        try {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF();

          doc.setFontSize(22);
          doc.text('EmphysemaAI Health Summary', 20, 20);
          
          doc.setFontSize(12);
          doc.text(`Patient Name: ${store.state.user?.name || 'John Doe'}`, 20, 32);
          doc.text(`Email Address: ${store.state.user?.email || ''}`, 20, 38);
          doc.text(`Report Window: ${start} to ${end}`, 20, 44);
          doc.text('------------------------------------------------------------', 20, 50);

          // Add scan logs
          doc.setFontSize(14);
          doc.text('Recent Diagnostics CT Scans:', 20, 60);
          
          let cursorY = 70;
          store.state.scans.forEach((scan, i) => {
            doc.setFontSize(11);
            doc.text(`${i + 1}. Date: ${scan.date} | Severity Index: ${scan.severity}%`, 20, cursorY);
            doc.text(`   Classification: ${scan.label}`, 20, cursorY + 6);
            cursorY += 15;
          });

          // Add meds
          doc.setFontSize(14);
          doc.text('Active Medications Regimen:', 20, cursorY + 10);
          cursorY += 20;
          store.state.medications.forEach((med, i) => {
            doc.setFontSize(11);
            doc.text(`- ${med.name} (${med.dosage}) at ${med.time}`, 20, cursorY);
            cursorY += 8;
          });

          doc.save(`EmphysemaAI_Summary_${Date.now()}.pdf`);
          alert('PDF generation completed successfully.');
        } catch (err) {
          console.error(err);
          alert('Failed to generate PDF. Make sure jsPDF CDN is loaded.');
        }
      });
    }
  },

  // 19. ALERT NOTIFICATIONS CENTER
  notifications: {
    render(container) {
      const itemsHtml = store.state.notifications.map(n => `
        <div class="notification-item">
          ${getNotifIcon(n.type)}
          <div class="notification-details">
            <h5>${n.title}</h5>
            <p>${n.message}</p>
            <span style="font-size:10px; color:var(--text-muted); display:block; margin-top:4px;">${n.time}</span>
          </div>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="scroll-container fade-in">
          <div class="dashboard-header">
            <button class="btn btn-secondary" id="notif-back-btn"><i class="fa-solid fa-arrow-left"></i> Home</button>
            <h2>Alert Center</h2>
          </div>

          <div class="glass-card mb-4" style="display:flex; justify-content:space-between; align-items:center;">
            <p style="color:var(--text-secondary); font-size:13px; margin:0;">Track reminders & health briefings</p>
            <button class="btn btn-text" id="clear-notif-btn" style="font-size:12px; color:var(--critical); padding:0;">Clear All</button>
          </div>

          <div class="glass-card" style="padding:0;">
            ${itemsHtml || '<p style="color:var(--text-secondary); text-align:center; padding:32px;">Inbox is empty.</p>'}
          </div>
        </div>
      `;
    },
    bind(container) {
      const backBtn = container.querySelector('#notif-back-btn');
      const clearBtn = container.querySelector('#clear-notif-btn');

      backBtn.addEventListener('click', () => {
        store.setScreen('dashboard');
      });

      clearBtn.addEventListener('click', () => {
        store.clearNotifications();
        Screens.notifications.render(container);
        Screens.notifications.bind(container);
      });
    }
  },

  // 20. DOCTOR HOME FRAGMENT
  doctor_wrapper: {
    render(container, activeTab = 'home') {
      container.innerHTML = `
        <div class="doctor-layout">
          <aside class="doctor-sidebar">
            <div class="sidebar-brand">
              ${LUNG_SVG}
              <span>EmphysemaAI</span>
            </div>
            
            <nav class="sidebar-menu">
              <div class="sidebar-item ${activeTab === 'home' ? 'active' : ''}" data-tab="home">
                <i class="fa-solid fa-gauge"></i>
                <span>Dashboard</span>
              </div>
              <div class="sidebar-item ${activeTab === 'patients' ? 'active' : ''}" data-tab="patients">
                <i class="fa-solid fa-hospital-user"></i>
                <span>Review Center</span>
              </div>
              <div class="sidebar-item" id="doc-btn-logout">
                <i class="fa-solid fa-power-off"></i>
                <span>Sign Out</span>
              </div>
            </nav>
          </aside>

          <main class="doctor-content" id="doctor-body"></main>
        </div>
      `;
    },
    bind(container, activeTab = 'home') {
      const body = container.querySelector('#doctor-body');
      
      this.renderSubTab(body, activeTab);

      const menuItems = container.querySelectorAll('.sidebar-item[data-tab]');
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          const tab = item.getAttribute('data-tab');
          menuItems.forEach(nav => nav.classList.remove('active'));
          item.classList.add('active');
          this.renderSubTab(body, tab);
        });
      });

      container.querySelector('#doc-btn-logout').addEventListener('click', () => {
        store.logout();
      });
    },

    renderSubTab(bodyContainer, tab) {
      bodyContainer.scrollTop = 0;
      
      if (tab === 'home') {
        const appointmentListHtml = store.state.appointments.map(apt => `
          <tr>
            <td>
              <div style="font-weight:600;">Patient: John Doe</div>
              <div style="font-size:11px; color:var(--text-muted);">${store.state.user?.email || 'john@doe.com'}</div>
            </td>
            <td>${apt.date} at ${apt.time}</td>
            <td><span class="health-status-badge" style="background:rgba(16,185,129,0.15); color:var(--success);">${apt.status}</span></td>
            <td>
              <button class="btn btn-primary btn-join-video" data-apt-id="${apt.id}" style="padding:6px 12px; font-size:11px;">Join Call</button>
            </td>
          </tr>
        `).join('');

        bodyContainer.innerHTML = `
          <div class="fade-in">
            <h2 class="mb-4">Doctor Dashboard</h2>

            <div class="doctor-stats-grid">
              <div class="glass-card doctor-stat-card">
                <i class="fa-solid fa-calendar-check"></i>
                <h6>Today's Consultations</h6>
                <h3>${store.state.appointments.length}</h3>
              </div>
              <div class="glass-card doctor-stat-card">
                <i class="fa-solid fa-file-shield"></i>
                <h6>Pending Scan Reviews</h6>
                <h3>3</h3>
              </div>
              <div class="glass-card doctor-stat-card">
                <i class="fa-solid fa-users"></i>
                <h6>Total Patient Index</h6>
                <h3>148</h3>
              </div>
            </div>

            <div class="glass-card mb-5">
              <h4 class="mb-3">Today's Appointment Log</h4>
              <table class="doctor-table">
                <thead>
                  <tr>
                    <th>Patient Detail</th>
                    <th>Schedule</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${appointmentListHtml || '<tr><td colspan="4" style="text-align:center;">No consultations booked.</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        `;

        // Join video call event
        const joinBtns = bodyContainer.querySelectorAll('.btn-join-video');
        joinBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const aptId = btn.getAttribute('data-apt-id');
            const apt = store.state.appointments.find(a => a.id === aptId);
            Screens.video_consult.render(document.getElementById('app'), apt);
            Screens.video_consult.bind(document.getElementById('app'), apt);
          });
        });

      } else if (tab === 'patients') {
        bodyContainer.innerHTML = `
          <div class="fade-in">
            <h2 class="mb-4">Review Center</h2>
            
            <div class="glass-card mb-5">
              <h4 class="mb-3">Pending Pulmonary Scans for Review</h4>
              <p style="color:var(--text-secondary); font-size:13px; margin-bottom:16px;">AI flagged scans with severity > 50% for physician sign-off</p>
              
              <div class="activity-list">
                <div class="activity-item type-critical" style="background:var(--bg-glass);">
                  <div class="activity-details">
                    <h5>Chest CT scan - Uploaded by John Doe</h5>
                    <p>Calculated AI Severity Index: 68%</p>
                  </div>
                  <button class="btn btn-primary btn-sign-off" style="padding:8px 16px; font-size:12px;">Approve & Sign Off</button>
                </div>
                
                <div class="activity-item type-critical" style="background:var(--bg-glass);">
                  <div class="activity-details">
                    <h5>Thorax Scan Report - Uploaded by Clara B.</h5>
                    <p>Calculated AI Severity Index: 74%</p>
                  </div>
                  <button class="btn btn-primary btn-sign-off" style="padding:8px 16px; font-size:12px;">Approve & Sign Off</button>
                </div>
              </div>
            </div>
          </div>
        `;

        // Sign off event
        const signOffBtns = bodyContainer.querySelectorAll('.btn-sign-off');
        signOffBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            btn.textContent = 'Signed Off ✓';
            btn.setAttribute('disabled', 'true');
            btn.style.background = 'var(--success)';
            btn.style.color = '#fff';
            alert('Scan verified. Digital signature appended to diagnostic file.');
          });
        });
      }
    }
  }
};

// Internal validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
