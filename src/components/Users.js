import {
  useState, useEffect
} from 'react';
import Modal from './Modal';
import ChatWindow from './ChatWindow';
import NewMessages from './NewMessages';

import { useUsers } from './useUsers';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function Users(props) {
  const users = useUsers(props.user.uid, props.firestore);

  const [activeChats, setActiveChats] = useState([]);

  const myDocRef = props.firestore.collection('users').doc(props.user.uid);
  const [myData] = useDocumentData(myDocRef, {} );

  const createUser = docRef => {
    docRef.set({
      nickname: props.user.displayName,
      id: props.user.uid
    });
  }
  
  // make sure that my doc exist
  useEffect(() => {
    const docRef = props
      .firestore
      .collection('users')
      .doc(props.user.uid);

    docRef.get()
      .then(doc => {
        if(!doc.exists) createUser(docRef);
      });
  });

  const open = (chatId, hisId, hisNickname) => {
    // filter then add
    const currentActiveChats = activeChats;
    let newActiveChats = currentActiveChats.filter(
      c => c.chatId !== chatId
    );

    const chat = {
      chatId: chatId,
      myNickname: myData.nickname,
      myId: myData.id,
      hisNickname: hisNickname,
      hisId: hisId
    };

    newActiveChats = [...newActiveChats, chat];
    setActiveChats(newActiveChats);
  }

  const close = chatId => {
    // just filter
    const currentActiveChats = activeChats;
    let newActiveChats = currentActiveChats.filter(
      c => c.chatId !== chatId
    );

    setActiveChats(newActiveChats);
  }

  const renderUsers = () => {
    let usersExist = users.length > 0;

    if(usersExist) {
      const usersList = users.map(u => (
        <li key={u.user.id}>
          <button 
            onClick={() => open(
              u.chatIdWithHim, u.user.id, u.user.nickname
            )}>
              {u.user.nickname}
          </button>
        </li>
      ));
      
      return (
        <div>
          <div>Users</div>
          <ul>
            { usersList }
          </ul>
        </div>
      );
    }

    return <div>No users to load</div>;
  }
  
  const renderActiveChatWindows = () => {
    return (activeChats.length > 0) ?
      <Modal>
        {
          activeChats.map(chat => (
            <ChatWindow
              close={ () => close(chat.chatId) } 
              key={ chat.chatId } 
              chatId={ chat.chatId }
              myId={ chat.myId } 
              myNickname={ chat.myNickname }
              hisId={ chat.hisId }
              hisNickname={ chat.hisNickname }
              firestore={ props.firestore } />
          ))
        }
      </Modal>
      : '';
  }

  return (
    <div>
      <NewMessages 
        open={open} 
        firestore={props.firestore} 
        myId={props.user.uid}
      />
      {
        myData && renderUsers()
      }
      {
        myData && renderActiveChatWindows()
      }
    </div>
  );
}

export default Users;