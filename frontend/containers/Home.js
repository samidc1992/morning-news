import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from '../components/Article';
import TopArticle from '../components/TopArticle';
import ConnectionModal from '../components/ConnectionModal';
import styles from './Home.module.css';

function Home() {
  const bookmarks = useSelector((state) => state.bookmarks.value);
  const hiddenArticles = useSelector((state) => state.hiddenArticles.value);

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);


  useEffect(() => {
    fetch('https://morning-news-eight.vercel.app/articles')
      .then(response => response.json())
      .then(data => {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.filter((data, i) => i > 0));
      });
  }, []);

  const filteredArticles = useMemo(() => 
    articlesData.filter((data) => !hiddenArticles.includes(data.title), 
    [hiddenArticles, articlesData])
  );

  const articles = useMemo(() => {
    return filteredArticles.map((data, i) => {
      const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
      return <Article 
      key={i} {...data} 
      isBookmarked={isBookmarked} 
      isModalVisible 
      setIsModalVisible={() => setIsModalVisible(!isModalVisible)}/>;
    })
  }, [filteredArticles, bookmarks]);

  let topArticles = useMemo(() => {
    if (bookmarks.some(bookmark => bookmark.title === topArticle.title)) {
      return <TopArticle 
      {...topArticle} 
      isBookmarked={true} 
      isModalVisible 
      setIsModalVisible={() => setIsModalVisible(!isModalVisible)}
      />;
    } else {
      return <TopArticle 
      {...topArticle} 
      isBookmarked={false} 
      isModalVisible 
      setIsModalVisible={() => setIsModalVisible(!isModalVisible)}
      />
    }
  }, [bookmarks, topArticle]);
  
  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {topArticles}
      <div className={styles.articlesContainer}>
        {articles}
      </div>
      {isModalVisible && 
      <ConnectionModal 
      isModalVisible 
      setIsModalVisible={() => setIsModalVisible(!isModalVisible)}
      />}
    </div>
  );
}

export default Home;
