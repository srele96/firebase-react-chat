import { StyledFirebaseAuth } from 'react-firebaseui';
import { auth } from '../firebase/firebase';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // disable redirects on successuful login
    signInSuccessWithAuthResult: () => false
  }
};

const Auth = () => (
  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()}/>
);

export default Auth;