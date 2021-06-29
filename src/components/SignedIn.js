import { auth, firestore} from '../firebase/firebase';
import Users from './Users';
import EditNickname from './EditNickname';

const SignedIn = ({user}) => {
  return (
    <div>
      <h1>Signed in</h1>
      <button onClick={() => auth().signOut()}>Sign out</button>
      <EditNickname firestore={firestore()} user={user} />
      <Users user={user} firestore={firestore()} />
    </div>
  )
}

export default SignedIn;