/* EmphysemaAI Entry point and SPA Router */
import { store } from './state.js';
import { Screens } from './screens.js';

const appNode = document.getElementById('app');

// Central router dispatcher
function renderApp(state) {
  const { currentScreen, user } = state;
  
  // Track screens to prevent redundant re-renders on minor sub-state updates
  const activeNodeId = appNode.firstElementChild?.id;

  switch (currentScreen) {
    case 'splash':
      Screens.splash.render(appNode);
      Screens.splash.bind(appNode);
      break;

    case 'onboarding':
      Screens.onboarding.render(appNode);
      Screens.onboarding.bind(appNode);
      break;

    case 'login':
      Screens.login.render(appNode);
      Screens.login.bind(appNode);
      break;

    case 'signup':
      Screens.signup.render(appNode);
      Screens.signup.bind(appNode);
      break;

    case 'dashboard':
      if (user?.role === 'doctor') {
        // If doctor dashboard is already mounted, let internal tab handler manage updates
        if (activeNodeId !== 'doctor-app') {
          Screens.doctor_wrapper.render(appNode);
          Screens.doctor_wrapper.bind(appNode);
        }
      } else {
        // Patient dashboard
        if (activeNodeId !== 'patient-app') {
          Screens.patient_wrapper.render(appNode);
          Screens.patient_wrapper.bind(appNode);
        }
      }
      break;

    default:
      console.warn(`Routing error: Screen "${currentScreen}" is undefined.`);
      break;
  }
}

// Subscribe routing logic to state store changes
store.subscribe((state) => {
  renderApp(state);
});

// App startup bootstrapping
window.addEventListener('DOMContentLoaded', () => {
  store.initializeSession();
  
  // If user session is already present and verified, go direct to dashboard
  if (store.state.user && store.state.otpVerified) {
    store.setScreen('dashboard');
  } else {
    store.setScreen('splash');
  }
});
