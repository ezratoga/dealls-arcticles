import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CategoryFilter from './CategoryFilter';
import '../App.css';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params: any = {
      category_id: category,
      page: page,
      limit: 5
    };

    if (!category) delete params.category_id;

    axios.get(`https://fe-tech-test-api-dev-416879028044.asia-southeast2.run.app/api/v1/articles`, {
      params
    })
    .then((response: any) => {
      console.log(response);
      setArticles(response.data.data.data);
      setTotalPages(response.data.data.metadata.total_pages);
    })
    .catch(error => console.error('Error fetching articles:', error));
  }, [category, page]);

  // Swipe event handlers for articles
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // Handle touch start event
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX);
    setIsSwiping(true);
  };

  // Handle touch move event
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].pageX;
    const diffX = startX - currentX;

    // Threshold for detecting swipe
    const swipeThreshold = 50;

    if (diffX > swipeThreshold && page < totalPages) {
      // Swiped left (Next page)
      setPage((prevPage) => Math.min(prevPage + 1, totalPages));
      setIsSwiping(false);
    } else if (diffX < -swipeThreshold && page > 1) {
      // Swiped right (Previous page)
      setPage((prevPage) => Math.max(prevPage - 1, 1));
      setIsSwiping(false);
    }
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    setIsSwiping(false);  // Reset swipe state after touch ends
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1); // Reset page when category changes
  };

  // Create pagination buttons dynamically
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={page === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  // Navigate to the next page
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    }
  };

  // Navigate to the previous page
  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };

  return (
    <div>
      <h1>Articles</h1>
      <CategoryFilter onCategoryChange={handleCategoryChange} />
      <div
        className="articles"
        ref={articlesRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {articles.map((article: any) => (
          <div key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <Link to={`/article/${article.id}`}>Read More</Link>
          </div>
        ))}
      </div>

      <div className="arrow-buttons">
        <button className="arrow left-arrow" onClick={handlePrevPage} disabled={page === 1}>
          &#9664; {/* Left Arrow */}
        </button>
        <button className="arrow right-arrow" onClick={handleNextPage} disabled={page === totalPages}>
          &#9654; {/* Right Arrow */}
        </button>
      </div>
      
      <div className="pagination">
        {renderPaginationButtons()}
        {/* {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} onClick={() => setPage(index + 1)}>{index + 1}</button>
        ))} */}
      </div>
    </div>
  );
};

export default ArticleList;
