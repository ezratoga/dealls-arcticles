import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    axios.get(`https://fe-tech-test-api-dev-416879028044.asia-southeast2.run.app/api/v1/articles/${id}`)
      .then(response => {
        console.log(response.data.data.content);
        setArticle(response.data.data);
      })
      .catch(error => console.error('Error fetching article:', error));
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href
      }).catch(console.error);
    } else {
      alert('Sharing is not supported in this browser.');
    }
  };

  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{parse(article.content)}</p>
      <button onClick={handleShare}>Share</button>
    </div>
  );
};

export default ArticleDetail;
