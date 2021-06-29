import {
  useState, useEffect
} from 'react';

import {
  useCollectionData
} from 'react-firebase-hooks/firestore';

import shortid from 'shortid';

function useUsers(myId, firestore) {
  // customUserState array is structured in useEffect
  // therefore: customUserState
  const [customUserState, setCustomUserState] = useState([]);

  // get usersOtherThanMe
  const usersRef = firestore.collection('users');
  const usersQuery = usersRef.where('id', '!=', myId);
  const [usersOtherThanMe] = useCollectionData( usersQuery, {} );

  // get chats
  const chatsRef = firestore.collection('chats');
  const chatsQuery = chatsRef
    .where('participantsIDS', 'array-contains', myId);
  const [chats] = useCollectionData( chatsQuery, {} );

  // gets existing or generates new id
  const getChatId = otherPersonId => {
    const chatObject = chats.find(chat => 
      chat.participantsIDS.every(participantId => 
        participantId === myId || 
        participantId === otherPersonId
      )
    );
    
    if(chatObject) {
      return chatObject.chatID;
    }

    let newChatID = shortid.generate();
    newChatID += shortid.generate();
    return newChatID;
  }

  // uses chats and users to structure customUserState
  useEffect(() => {
    if(usersOtherThanMe && chats) {
      let newCustomUserState = [];

      usersOtherThanMe.forEach(user => {
        const hisId = user.id;
        const chatIdWithHim = getChatId(hisId);

        const userState = {
          user: user,
          chatIdWithHim: chatIdWithHim
        }
        
        newCustomUserState = [...newCustomUserState, userState];
      });

      setCustomUserState(newCustomUserState);
    }

    return () => setCustomUserState([]);
  }, [usersOtherThanMe, chats]);

  return customUserState;
}

export { useUsers };