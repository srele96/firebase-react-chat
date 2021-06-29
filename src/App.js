import { auth } from './firebase/firebase';
import Auth from './components/Auth';
import SignedIn from './components/SignedIn';

import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user, loading, error] = useAuthState(auth());

  if(error) return (
    <div>
      Oops! Something went wrong. Please refresh the page.
      <button onClick={document.location.reload}>Refresh</button>
    </div>
  );

  if(loading) return <div>Loading...</div>;

  return (
    <div className="App">
      {user ? <SignedIn user={user} /> : <Auth />}
    </div>
  );
}

export default App;
