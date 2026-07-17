/* EmphysemaAI State Management Module */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const STORAGE_KEY = 'emphysema_ai_state';

// Preloaded mock database for clinical content
const MOCK_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Sarah Jenkins, MD',
    specialty: 'Senior Pulmonologist',
    rating: 4.9,
    experience: 12,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    fees: '$120'
  },
  {
    id: 2,
    name: 'Dr. Robert Chen, PhD',
    specialty: 'Thoracic Specialist',
    rating: 4.8,
    experience: 15,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    fees: '$150'
  },
  {
    id: 3,
    name: 'Dr. Elena Rostova, MD',
    specialty: 'COPD & Asthma Expert',
    rating: 4.7,
    experience: 9,
    online: false,
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300',
    fees: '$110'
  },
  {
    id: 4,
    name: 'Dr. Michael Patel, MD',
    specialty: 'Critical Care Pulmonologist',
    rating: 4.9,
    experience: 18,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    fees: '$175'
  }
];

const MOCK_TIPS = [
  {
    id: 1,
    title: 'Understanding Emphysema Progression',
    category: 'Educational',
    readTime: '5 min read',
    content: 'Emphysema is a lung condition that causes shortness of breath. In people with emphysema, the air sacs in the lungs (alveoli) are damaged. Over time, the inner walls of the air sacs weaken and rupture — creating larger air spaces instead of many small ones. This reduces the surface area of the lungs and, in turn, the amount of oxygen that reaches your bloodstream.',
    videoUrl: '#'
  },
  {
    id: 2,
    title: 'Top 3 Breathing Exercises for COPD',
    category: 'Guides',
    readTime: '3 min read',
    content: 'Pursed-lip breathing and diaphragmatic breathing are two excellent ways to help strengthen your lungs and make breathing more efficient. Practicing these daily helps clear stale air trapped in lungs and improves oxygen exchange.',
    videoUrl: '#'
  },
  {
    id: 3,
    title: 'Dietary Tips for Pulmonary Health',
    category: 'Nutrition',
    readTime: '4 min read',
    content: 'Eating a diet with fewer carbohydrates and more healthy fats can help you breathe easier. The metabolism of carbohydrates produces the most carbon dioxide for the amount of oxygen used, whereas metabolism of fat produces the least. Reducing carb intake can help decrease the burden on weak lungs.',
    videoUrl: '#'
  }
];

const MOCK_MEDICATIONS = [
  { id: 1, name: 'Spiriva Respimat (Tiotropium)', dosage: '2 inhalations', time: '08:00 AM', taken: false },
  { id: 2, name: 'Symbicort (Budesonide/Formoterol)', dosage: '2 puffs', time: '09:30 AM', taken: true },
  { id: 3, name: 'Prednisone', dosage: '5 mg (1 Tablet)', time: '01:00 PM', taken: false },
  { id: 4, name: 'Albuterol Rescue Inhaler', dosage: 'As needed (max 4x/day)', time: 'Prn', taken: false }
];

const MOCK_SCANS = [
  { id: 'scan_001', date: '2026-06-25 09:15', type: 'X-Ray Scan', severity: 12, label: 'Healthy / Normal Lung tissue', status: 'Healthy' },
  { id: 'scan_002', date: '2026-07-10 14:30', type: 'CT Scan Upload', severity: 68, label: 'Moderate Emphysema Detected - Consult Specialist', status: 'Critical' }
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'alert', title: 'Medication Reminder', message: 'Time to take your Spiriva Respimat inhaler.', time: '10 mins ago' },
  { id: 2, type: 'appointment', title: 'Appointment Confirmed', message: 'Video consult scheduled with Dr. Sarah Jenkins.', time: '2 hours ago' },
  { id: 3, type: 'info', title: 'Weekly Insight', message: 'Your oxygen saturation levels improved by 1.2% this week.', time: '1 day ago' }
];

const INITIAL_STATE = {
  isInitialized: false,
  user: null, // { email: '', name: '', bio: '', role: 'patient' or 'doctor', biometricEnabled: false }
  onboardingCompleted: false,
  otpSent: false,
  otpVerified: false,
  currentScreen: 'splash', // 'splash', 'onboarding', 'login', 'signup', 'otp', 'role_select', 'dashboard'
  scans: [...MOCK_SCANS],
  appointments: [
    {
      id: 'apt_001',
      doctor: MOCK_DOCTORS[0],
      date: '2026-07-15',
      time: '10:00 AM',
      status: 'Confirmed'
    }
  ],
  medications: [...MOCK_MEDICATIONS],
  notifications: [...MOCK_NOTIFICATIONS],
  chatMessages: [
    { id: 1, sender: 'bot', text: 'Hello! I am your AI Pulmonary Assistant. You can ask me about Emphysema symptoms, breathing exercises, or how to upload your X-ray scan. How can I help you today?' }
  ],
  analyticsData: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    lungCapacity: [3.8, 3.7, 3.9, 3.6, 4.0, 4.2], // FEV1 in Liters
    oxygenLevels: [97, 96, 98, 95, 97, 99] // SpO2 %
  },
  users: [
    { email: 'patient@test.com', password: 'password123', name: 'Test Patient', role: 'patient' }
  ]
};

class StateStore {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const loaded = JSON.parse(raw);
        if (!loaded.users) {
          loaded.users = [
            { email: 'patient@test.com', password: 'password123', name: 'Test Patient', role: 'patient' }
          ];
        }
        return loaded;
      } catch (e) {
        console.error('Failed to parse cached state, resetting...', e);
      }
    }
    return { ...INITIAL_STATE };
  }

  saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // State mutation actions
  initializeSession() {
    this.state.isInitialized = true;
    
    // Subscribe to Firebase Auth changes
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.syncUserData(user.email, user.displayName);
      } else {
        this.state.user = null;
        this.state.otpVerified = false;
        // reset to defaults on logout
        this.state.scans = [...MOCK_SCANS];
        this.state.appointments = [
          {
            id: 'apt_001',
            doctor: MOCK_DOCTORS[0],
            date: '2026-07-15',
            time: '10:00 AM',
            status: 'Confirmed'
          }
        ];
        this.state.medications = [...MOCK_MEDICATIONS];
        this.state.chatMessages = [
          { id: 1, sender: 'bot', text: 'Hello! I am your AI Pulmonary Assistant. You can ask me about Emphysema symptoms, breathing exercises, or how to upload your X-ray scan. How can I help you today?' }
        ];
        if (this.state.currentScreen !== 'splash' && this.state.currentScreen !== 'onboarding' && this.state.currentScreen !== 'signup') {
          this.state.currentScreen = 'login';
        }
        this.saveState();
      }
    });
  }

  async syncUserData(email, displayName) {
    try {
      // 1. User Profile Sync
      const userRef = doc(db, "users", email);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        this.state.user = {
          email,
          name: userData.name || displayName || email.split('@')[0],
          bio: userData.bio || 'Pulmonary Patient',
          role: userData.role || 'patient',
          biometricEnabled: userData.biometricEnabled || false
        };
      } else {
        const newProfile = {
          email,
          name: displayName || email.split('@')[0],
          bio: 'Pulmonary Patient',
          role: 'patient',
          biometricEnabled: false
        };
        await setDoc(userRef, newProfile);
        this.state.user = newProfile;
      }

      // 2. Fetch User Scans
      await this.fetchUserScans(email);

      // 3. Fetch User Appointments
      await this.fetchUserAppointments(email);

      // 4. Fetch User Medications
      await this.fetchUserMedications(email);

      // 5. Fetch User Chats
      await this.fetchUserChatMessages(email);

      this.state.otpSent = false;
      this.state.otpVerified = true;
      this.state.currentScreen = 'dashboard';
      this.saveState();
    } catch (e) {
      console.error("Error syncing user data from Firestore: ", e);
      // Fallback
      this.loginUser(email, displayName, 'patient');
      this.fetchUserScans(email);
    }
  }
  completeOnboarding() {
    this.state.onboardingCompleted = true;
    this.state.currentScreen = 'login';
    this.saveState();
  }

  setScreen(screen) {
    this.state.currentScreen = screen;
    this.saveState();
  }

  loginUser(email, name, role = 'patient') {
    this.state.user = {
      email,
      name: name || email.split('@')[0],
      bio: role === 'doctor' ? 'Senior Pulmonologist Specialist' : 'Pulmonary Patient',
      role,
      biometricEnabled: false
    };
    this.state.otpSent = false;
    this.state.otpVerified = true;
    this.state.currentScreen = 'dashboard';
    this.saveState();
  }

  async registerUser(email, password, name, role = 'patient') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      let errorMsg = 'Failed to create account.';
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password must be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address.';
      }
      return { success: false, error: errorMsg };
    }
  }

  async authenticateUser(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      let errorMsg = 'Invalid email or password.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid email or password.';
      }
      return { success: false, error: errorMsg };
    }
  }

  verifyOTP() {
    this.state.otpVerified = true;
    this.state.currentScreen = 'dashboard';
    this.saveState();
  }

  selectRole(role) {
    if (this.state.user) {
      this.state.user.role = role;
    }
    this.state.currentScreen = 'dashboard';
    this.saveState();
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async updateProfile(name, bio, biometricEnabled) {
    if (this.state.user) {
      this.state.user.name = name;
      this.state.user.bio = bio;
      this.state.user.biometricEnabled = biometricEnabled;
      
      const email = this.state.user.email;
      if (email) {
        try {
          const userRef = doc(db, "users", email);
          await updateDoc(userRef, {
            name,
            bio,
            biometricEnabled
          });
        } catch (e) {
          console.error("Error updating user profile in Firestore: ", e);
        }
      }
      this.saveState();
    }
  }

  async addScan(scanType, severity, label, status) {
    const newScan = {
      userEmail: this.state.user?.email || 'anonymous',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: scanType,
      severity: parseInt(severity),
      label: label,
      status: status,
      createdAt: Date.now()
    };

    try {
      const docRef = await addDoc(collection(db, 'scans'), newScan);
      newScan.id = docRef.id;
    } catch (e) {
      console.error("Error adding scan to Firestore: ", e);
      newScan.id = 'scan_' + Date.now();
    }

    this.state.scans.unshift(newScan);
    
    // Add current entry to analytics
    this.state.analyticsData.labels.push(`Week ${this.state.analyticsData.labels.length + 1}`);
    this.state.analyticsData.oxygenLevels.push(status === 'Healthy' ? 98 : 94);
    this.state.analyticsData.lungCapacity.push(status === 'Healthy' ? 4.1 : 3.2);
    
    // Alert Notification
    this.addNotification(
      status === 'Healthy' ? 'info' : 'alert',
      'AI Analysis Complete',
      `Diagnostic report generated: Severity index is ${severity}%.`
    );

    this.saveState();
    return newScan;
  }

  async fetchUserScans(email) {
    try {
      const q = query(
        collection(db, "scans"),
        where("userEmail", "==", email),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const loadedScans = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedScans.push({ id: doc.id, ...data });
      });
      this.state.scans = loadedScans.length > 0 ? loadedScans : [...MOCK_SCANS];
      this.saveState();
    } catch (e) {
      console.error("Error fetching scans from Firestore: ", e);
      this.state.scans = [...MOCK_SCANS];
    }
  }

  async fetchUserAppointments(email) {
    try {
      const q = query(
        collection(db, "appointments"),
        where("userEmail", "==", email),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const loaded = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loaded.push({ id: doc.id, ...data });
      });
      this.state.appointments = loaded.length > 0 ? loaded : [
        {
          id: 'apt_001',
          doctor: MOCK_DOCTORS[0],
          date: '2026-07-15',
          time: '10:00 AM',
          status: 'Confirmed'
        }
      ];
    } catch (e) {
      console.error("Error fetching appointments: ", e);
      this.state.appointments = [
        {
          id: 'apt_001',
          doctor: MOCK_DOCTORS[0],
          date: '2026-07-15',
          time: '10:00 AM',
          status: 'Confirmed'
        }
      ];
    }
  }

  async bookAppointment(doctor, date, time) {
    const newAppointment = {
      userEmail: this.state.user?.email || 'anonymous',
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        rating: doctor.rating,
        experience: doctor.experience,
        online: doctor.online,
        avatar: doctor.avatar,
        fees: doctor.fees
      },
      date,
      time,
      status: 'Confirmed',
      createdAt: Date.now()
    };

    try {
      const docRef = await addDoc(collection(db, 'appointments'), newAppointment);
      newAppointment.id = docRef.id;
    } catch (e) {
      console.error("Error booking appointment in Firestore: ", e);
      newAppointment.id = 'apt_' + Date.now();
    }

    this.state.appointments.unshift(newAppointment);
    
    this.addNotification(
      'appointment',
      'Appointment Confirmed',
      `Meeting scheduled with ${doctor.name} on ${date} at ${time}.`
    );
    
    this.saveState();
  }

  async fetchUserMedications(email) {
    try {
      const q = query(
        collection(db, "medications"),
        where("userEmail", "==", email),
        orderBy("createdAt", "asc")
      );
      const querySnapshot = await getDocs(q);
      const loaded = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loaded.push({ id: doc.id, ...data });
      });
      
      if (loaded.length > 0) {
        this.state.medications = loaded;
      } else {
        // Seed with defaults
        const promises = MOCK_MEDICATIONS.map(async (med) => {
          const newMed = {
            userEmail: email,
            name: med.name,
            dosage: med.dosage,
            time: med.time,
            taken: med.taken,
            createdAt: Date.now() + med.id
          };
          const docRef = await addDoc(collection(db, 'medications'), newMed);
          return { id: docRef.id, ...newMed };
        });
        const savedMeds = await Promise.all(promises);
        this.state.medications = savedMeds;
      }
      this.saveState();
    } catch (e) {
      console.error("Error fetching medications: ", e);
      this.state.medications = [...MOCK_MEDICATIONS];
    }
  }

  async toggleMedication(id) {
    this.state.medications = this.state.medications.map(med => {
      if (med.id === id) {
        const updated = { ...med, taken: !med.taken };
        if (typeof id === 'string' && !id.startsWith('med_')) {
          const medRef = doc(db, 'medications', id);
          updateDoc(medRef, { taken: updated.taken }).catch(e => {
            console.error("Error updating medication in Firestore: ", e);
          });
        }
        return updated;
      }
      return med;
    });
    this.saveState();
  }

  async addMedication(name, dosage, time) {
    const newMed = {
      userEmail: this.state.user?.email || 'anonymous',
      name,
      dosage,
      time,
      taken: false,
      createdAt: Date.now()
    };

    try {
      const docRef = await addDoc(collection(db, 'medications'), newMed);
      newMed.id = docRef.id;
    } catch (e) {
      console.error("Error adding medication to Firestore: ", e);
      newMed.id = 'med_' + Date.now();
    }

    this.state.medications.push(newMed);
    this.saveState();
  }

  async removeMedication(id) {
    this.state.medications = this.state.medications.filter(med => med.id !== id);
    
    if (typeof id === 'string' && !id.startsWith('med_')) {
      try {
        const medRef = doc(db, 'medications', id);
        await deleteDoc(medRef);
      } catch (e) {
        console.error("Error deleting medication from Firestore: ", e);
      }
    }
    this.saveState();
  }


  async fetchUserChatMessages(email) {
    try {
      const q = query(
        collection(db, "chats"),
        where("userEmail", "==", email),
        orderBy("createdAt", "asc")
      );
      const querySnapshot = await getDocs(q);
      const loaded = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loaded.push({ id: doc.id, ...data });
      });
      this.state.chatMessages = loaded.length > 0 ? loaded : [
        { id: 1, sender: 'bot', text: 'Hello! I am your AI Pulmonary Assistant. You can ask me about Emphysema symptoms, breathing exercises, or how to upload your X-ray scan. How can I help you today?' }
      ];
    } catch (e) {
      console.error("Error fetching chats: ", e);
      this.state.chatMessages = [
        { id: 1, sender: 'bot', text: 'Hello! I am your AI Pulmonary Assistant. You can ask me about Emphysema symptoms, breathing exercises, or how to upload your X-ray scan. How can I help you today?' }
      ];
    }
  }

  async sendChatMessage(text) {
    const email = this.state.user?.email || 'anonymous';
    const userMsg = {
      userEmail: email,
      sender: 'user',
      text,
      createdAt: Date.now()
    };

    try {
      const docRef = await addDoc(collection(db, 'chats'), userMsg);
      userMsg.id = docRef.id;
    } catch (e) {
      console.error("Error saving user message to Firestore: ", e);
      userMsg.id = 'chat_' + Date.now();
    }

    this.state.chatMessages.push(userMsg);
    this.saveState();

    // Simulating AI response logic
    setTimeout(async () => {
      let botText = "I'm analyzing your request. For specific diagnoses, please make sure to upload a lung scan or book a clinical call with our pulmonologists.";
      const queryStr = text.toLowerCase();
      
      if (queryStr.includes('hello') || queryStr.includes('hi')) {
        botText = "Hello! How can I assist you with your lung health questions today?";
      } else if (queryStr.includes('emphysema') || queryStr.includes('copd')) {
        botText = "Emphysema is a form of Chronic Obstructive Pulmonary Disease (COPD) characterized by the destruction of alveoli (air sacs). Common symptoms include shortness of breath, persistent coughing, and wheezing. Would you like to read some health tips or run an AI Scan?";
      } else if (queryStr.includes('scan') || queryStr.includes('upload')) {
        botText = "You can upload a chest CT or X-ray scan through the 'Upload Scan' screen. Our AI model will analyze it for emphysematous tissue change and output a severity score.";
      } else if (queryStr.includes('exercise') || queryStr.includes('breathing')) {
        botText = "Guided breathing exercises like pursed-lip breathing can help reduce air trapping. I highly recommend checking out our built-in guided 'Breathing Exercise' tool in your services grid!";
      } else if (queryStr.includes('doctor') || queryStr.includes('consult')) {
        botText = "You can book a live consultation with certified pulmonologists under the 'Consult Doctor' fragment. We offer secure, instant video checkups.";
      }

      const botMsg = {
        userEmail: email,
        sender: 'bot',
        text: botText,
        createdAt: Date.now()
      };

      try {
        const docRef = await addDoc(collection(db, 'chats'), botMsg);
        botMsg.id = docRef.id;
      } catch (e) {
        console.error("Error saving bot response to Firestore: ", e);
        botMsg.id = 'chat_' + (Date.now() + 1);
      }

      this.state.chatMessages.push(botMsg);
      this.saveState();
    }, 1000);
  }

  addNotification(type, title, message) {
    const newNotif = {
      id: Date.now(),
      type,
      title,
      message,
      time: 'Just now'
    };
    this.state.notifications.unshift(newNotif);
    this.saveState();
  }

  clearNotifications() {
    this.state.notifications = [];
    this.saveState();
  }
}

export const store = new StateStore();
export { MOCK_DOCTORS, MOCK_TIPS };
