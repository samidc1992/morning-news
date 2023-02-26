import { Modal } from 'antd';
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { login } from '../reducers/user';
import styles from './ConnectionModal.module.css'

function ConnectionModal(props) {
    const dispatch = useDispatch();

    const { isModalVisible, setIsModalVisible } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [signin, setSignin] = useState(false);

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const signinOrSignup = (username, password, isSignin) => {
      return fetch(`https://morning-news-eight.vercel.app/users/${isSignin ? 'signin' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }).then(response => response.json())
        .then(data => {
          if (data.result) {
            dispatch(login({ username, token: data.token }));
            setUsername('');
            setPassword('');
            setIsModalVisible(false);
            setErrorMessage('');
          } else if (data.error === "Missing or empty fields") {
            setErrorMessage('Missing or empty fields.');
          } else if (data.error === "User already exists") {
            setErrorMessage('Username already taken.');
          } else if (data.error === "User not found or wrong password") {
            setErrorMessage('Invalid username or password.');
          }
        });
    };

    const handleRegister = () => {
     signinOrSignup(username, password, false);
    };

    const handleConnection = () => {
     signinOrSignup(username, password, true);
    };

    const toggleModal = () => {
      setSignin(!signin);
      setErrorMessage('');
      setUsername('');
      setPassword('');
    };

    return (
      <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
        <div className={styles.registerContainer}>
        
          <div>
            <div className={styles.registerSection}>
              <p>{ signin ? 'Sign-in' : 'Sing-up' }</p>
              <input type="text" placeholder="Username" id="username" onChange={(e) => setUsername(e.target.value)} value={username} />
              <input type="password" placeholder="Password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
              <button id="connection" onClick={() => signin ? handleConnection() : handleRegister() }>{ signin ? 'Connect' : 'Register' }</button>
              {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
            </div>
            <span className={styles.signin}>
            {signin ? (
              <>
                Do not have an account yet? 
                <div>
                  <a onClick={toggleModal}>Join now.</a>
                </div>
              </>
            ) : (
              <>
                Already have an account?
                <div>
                  Click <a onClick={toggleModal}>here</a> to signin.
                </div>
              </>
            )
          }
          </span>
          </div>
          
        </div>
	    </Modal>
    )
};

export default ConnectionModal;
