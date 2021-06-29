import { useEffect } from 'react';
import ReactDOM from 'react-dom';

const modalParent = document.getElementsByTagName('body')[0];

function Modal(props) {
  let el = document.createElement('div');

  useEffect(() => {
    modalParent.appendChild(el);
    
    return () => modalParent.removeChild(el);
  });

  return ReactDOM.createPortal(props.children, el);
}

export default Modal;