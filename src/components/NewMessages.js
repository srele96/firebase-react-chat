import { useEffect, useState } from 'react';

import { useDocumentData } from 'react-firebase-hooks/firestore';

function NewMessagesNotifications(props) {
  const newMessagesRef = props
    .firestore
    .collection('newMessages')
    .doc(props.myId);
  
  // this is object
  /**
   * it's doc id is: user.uid
   * {
   *   whoSentMessageID: {
   *     info...
   *   },
   *   whoSentMessageID: {
   *     info...
   *   }
   * }
   */
  const [newMessagesNotifications] = useDocumentData(
    newMessagesRef, { }
  );
  
  const [unseenNewMessages, setUnseenNewMessages] = useState([]);
  
  // make array from object in separate state
  useEffect(() => {
    if(newMessagesNotifications) {
      Object.keys(newMessagesNotifications).forEach(senderID => {
        const messageRecievedInfo = newMessagesNotifications[senderID];
  
        if(messageRecievedInfo.hasNewMessage) {
          let newUnseenMessages = [
            ...unseenNewMessages, messageRecievedInfo
          ];
  
          setUnseenNewMessages(newUnseenMessages);
        }
      });
    }
    return () => setUnseenNewMessages([]);
  }, [newMessagesNotifications]);
  
  const renderNewMessagesNotifications =() => {
    const hasNewMessages = unseenNewMessages.length > 0;
    if(!hasNewMessages)
      return (<div>No new messages</div>);

    const listOfNewMessages = unseenNewMessages.map(m => {
      const chatId = m.chatID;
      const hisId = m.senderID;
      const hisNickname = m.nickname;

      return (<li key={m.senderID}>
        <button
          onClick={ () => props.open(chatId, hisId, hisNickname) }
        >
          + { m.nickname }
        </button>
      </li>);
    });

    return (
      <>
        <div>New messages</div>
        <ul>
          { listOfNewMessages }
        </ul>
      </>
    );
  }

  return (
    <div>
      { renderNewMessagesNotifications() }
    </div>
  );
}

export default NewMessagesNotifications;