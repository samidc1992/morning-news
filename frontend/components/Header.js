import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Moment from 'react-moment';

import { logout } from '../reducers/user';
import { removeAllBookmark } from '../reducers/bookmarks';
import ConnectionModal from './ConnectionModal';
import styles from './Header.module.css';

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const date = new Date();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeAllBookmark());
  };

  let userSection = useMemo(() => user.token ? 
    <div className={styles.logoutSection}>
      <p>Welcome {user.username} / </p>
      <button onClick={() => handleLogout()}>Logout</button>
    </div> 
    :
    <div className={styles.headerIcons}>
    <FontAwesomeIcon onClick={setIsModalVisible} className={styles.userSection} icon={faUser} />
    </div>
  , [user.token]);

  return (
		<header className={styles.header}>
			<div className={styles.logoContainer}>
				<Moment className={styles.date} date={date} format="MMM Do YYYY" />
				<h1 className={styles.title}>Morning News</h1>
				{userSection}
			</div>
			<div className={styles.linkContainer}>
				<Link href="/"><span className={styles.link}>Articles</span></Link>
				<Link href="/bookmarks"><span className={styles.link}>Bookmarks</span></Link>
			</div>
			{isModalVisible && <ConnectionModal
      isModalVisible
      setIsModalVisible={() => setIsModalVisible(!isModalVisible)}
      />}
		</header >
	);
}

export default Header;
