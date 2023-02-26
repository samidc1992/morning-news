import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';

import Article from '../components/Article';
import styles from './Bookmarks.module.css';

function Bookmarks() {
  const bookmarks = useSelector((state) => state.bookmarks.value);

  let articles = useMemo(() => {
    if(bookmarks.length > 0) {
      return bookmarks.map((data, i) => {
        return <Article key={i} inBookmarks={true} {...data} isBookmarked />;
      });
    } else {
      return <div className={styles.defaultMessage}>No articles bookmarked yet.</div>;
    }
  }, [bookmarks]);

  return (
    <div>
      <Head>
        <title>Morning News - Bookmarks</title>
      </Head>
      <div className={styles.container}>
        <h2 className={styles.title}>Bookmarks</h2>
        <div className={styles.articlesContainer}>
          {articles}
        </div>
      </div>
    </div>
  );
}

export default Bookmarks;
