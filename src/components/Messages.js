import {
  useState, useEffect
} from 'react';

import { 
  useCollectionData 
} from 'react-firebase-hooks/firestore';

function Messages(props) {
  // query messages
  const chatRef = props.firestore.collection(props.chatID);
  const query = chatRef.orderBy('createdAt').limitToLast(10);
  const [messages, loadingMessages] = useCollectionData(
    query, { idField: 'id' }
  );

  const [messagesSinceReload, setMessagesSinceReload] = useState([]);
  const [isFirstTenAdded, setIsFirstTenAdded] = useState(false);

  // loads queried messages and every next to state
  useEffect(() => {
    // add every new to state
    if(isFirstTenAdded && messages) {  
      setMessagesSinceReload(m => {
        const lastMessage = messages[messages.length - 1];

        return [...m, lastMessage];
      });
    }

    // load first n queried messages
    if(!isFirstTenAdded && messages) {
      setMessagesSinceReload(m => [...m, ...messages]);

      setIsFirstTenAdded(true);
    }
  }, [messages]);

  if(loadingMessages) return <div>Loading...</div>;

  return (
    <ul>
      { 
        messagesSinceReload.map(m => (
          <li key={ m.id }>
            <div>
              { m.senderNickname }
            </div>
            <div>
              { m.content }
            </div>
          </li>
        ))
      }
    </ul>
  );
}

export default Messages;