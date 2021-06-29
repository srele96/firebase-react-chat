import { useEffect, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function EditNickname(props) {
  const docRef = props.firestore.collection('users').doc(props.user.uid);
  const [myDoc] = useDocumentData(docRef, {});
  const [inputValue, setInputValue] = useState('');
  const [isChangedSuccess, setIsChangedSuccess] = useState(null);
  const MAX_CHARACTERS = 15;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsChangedSuccess(null);
    }, 5000);

    return () => clearTimeout(timeout);
  });

  const handleChange = e => {
    if(inputValue.length < MAX_CHARACTERS) {
      setInputValue(e.target.value);
    } else {
      setInputValue(e.target.value.substr(0, MAX_CHARACTERS));
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    // if down fails, it'll be changed to false
    setIsChangedSuccess(true);

    props
      .firestore
      .collection('users')
      .doc(props.user.uid)
      .set({
        nickname: inputValue
      }, { merge: true })
      .catch(err => setIsChangedSuccess(false));

      setInputValue('');
  }

  return (
    <div>
      <div>
        Your current nickname: {
          myDoc ? myDoc.nickname : <span>Loading...</span>
        }
      </div>
      {
        isChangedSuccess && <div>
          Successufully changed nickname
        </div>
      }
      {
        isChangedSuccess === false && <div>
          Failed to change nickname
        </div>
      }
      <form onSubmit={handleSubmit}>
        <input
          maxLength="15"
          type="text"
          onChange={handleChange}
          value={inputValue}
        />
        <input type="submit" value="Change Nickname" />
        <div>
          {inputValue.length} of {MAX_CHARACTERS} characters used
        </div>
      </form>
    </div>
  );
}

export default EditNickname;