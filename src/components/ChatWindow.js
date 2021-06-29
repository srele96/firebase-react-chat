import React, { useState } from 'react';
import Messages from './Messages';

function ChatWindow(props) {
  const inputRef = React.useRef();
  const [inputValue, setInputValue] = useState('');

  const handleInput = e => {
    setInputValue(e.target.value);
  }

  const handleKeyUp = e => {
    e.stopPropagation();

    if(e.which === 13 && !e.shiftKey)
      handleSubmit(e);
  }

  const addMessage = () => {
    const msg = {
      senderNickname: props.myNickname,
      senderID: props.myId,
      recipientID: props.hisId,
      content: inputValue,
      createdAt: Date.now()
    }

    // add message to chat
    props
      .firestore
      .collection(props.chatId)
      .doc()
      .set(msg)
  }

  const addChat = () => {
    const chat = {
      participantsIDS: [props.myId, props.hisId],
      chatID: props.chatId
    };

    const chatRef = props
      .firestore
      .collection('chats')
      .doc(props.chatId);
    
    // add new chat
    chatRef
      .get()
      .then(thisDoc => {
        if(!thisDoc.exists)
          chatRef.set(chat);
      });
  }

  const addNewMessageNotification = () => {
    const idWhoRecievesMessage = props.hisId;
    const idWhoSendsMessage = props.myId;

    let newMessage = {
      [idWhoSendsMessage]: {
        chatID: props.chatId,
        senderID: idWhoSendsMessage,
        nickname: props.myNickname,
        hasNewMessage: true
      }
    };

    props
      .firestore
      .collection('newMessages')
      .doc(idWhoRecievesMessage)
      .set(newMessage, { merge: true });
  }

  const newMessageRead = () => {
    const docIdMyUnreadMessage = props.myId;
    const idWhoSentMeMessage = props.hisId;

    // firestore update dot notation
    const setMessageReadObject = {
      [`${idWhoSentMeMessage}.hasNewMessage`]: false
    };

    // i've seen new message
    const myUnreadMessageDocRef = props
      .firestore
      .collection('newMessages')
      .doc(docIdMyUnreadMessage);

      myUnreadMessageDocRef
      .get()
      .then(thisDoc => {
        if(thisDoc.exists) {
          myUnreadMessageDocRef.update(setMessageReadObject);
        }
      });
  }

  const handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    addMessage();
    addChat();
    addNewMessageNotification();
    
    setInputValue('');
    inputRef.current.focus();
  }

  return (
    <div>
      <div>
        { props.hisNickname }
        <button onClick={() => props.close(props.chatId)}>Close</button>
      </div>

      <div onClick={newMessageRead}>
        <Messages firestore={props.firestore} chatID={props.chatId}/>
        
        <form onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            onInput={handleInput}
            value={inputValue}
            onKeyUp={handleKeyUp}
            />
          <input type="submit" value="Send"/>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;