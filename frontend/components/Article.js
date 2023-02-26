import { useMemo } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import Image from 'next/image';

import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { hideArticle } from '../reducers/hiddenArticles';
import styles from './Article.module.css';

function Article(props) {
  const { isModalVisible, setIsModalVisible } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

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

  let iconStyle = useMemo(
    () => props.isBookmarked ? { 'color': '#E9BE59' } : {}, 
    [props.isBookmarked]
  );

  return (
    <div className={styles.articles}>
      <div className={styles.articleHeader}>
        <h3>{props.title.length > 75 ? `${props.title.slice(0, 75)}...` : props.title }</h3>
        <FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
        {
          props.inBookmarks || 
          <Tooltip title="hide article">
            <FontAwesomeIcon icon={faEyeSlash} onClick={() => dispatch(hideArticle(props.title))} className={styles.hideIcon} />
          </Tooltip>
        }
      </div>
      <h4 style={{ textAlign: "right" }}>- {props.author}</h4>
      <div className={styles.divider}></div>
      <Image src={props.urlToImage} alt={props.title} width={600} height={314} />
      <p>{props.description}</p>
    </div>
  );
}

export default Article;
