import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import styles from './TopArticle.module.css';

function TopArticle(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const { isModalVisible, setIsModalVisible } = props;

  const handleBookmarkClick = () => {
    if (!user.token) {
      setIsModalVisible(!isModalVisible);
      return;
    }

    fetch(`http://localhost:3000/users/canBookmark/${user.token}`)
      .then(response => response.json())
      .then(data => {
        if (data.result && data.canBookmark) {
          if (props.isBookmarked) {
            dispatch(removeBookmark(props));
          } else {
            dispatch(addBookmark(props));
          }
        }
      });
  }

  let iconStyle = useMemo(() => props.isBookmarked ? { 'color': '#E9BE59' } : {}, [props.isBookmarked]);

  return (
    <div className={styles.topContainer}>
      <img src={props.urlToImage} className={styles.image} alt={props.title} />
      <div className={styles.topText}>
        <h2 className={styles.topTitle}>{props.title}</h2>
        <FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
        <h4>{props.author}</h4>
        <p className={styles.description}>{props.description}</p>
      </div>
    </div>
  );
}

export default TopArticle;
