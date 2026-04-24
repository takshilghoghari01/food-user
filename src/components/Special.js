import React, { useState, useEffect, useRef } from "react";
import { fetchTopRatedItems } from "../api";

function Special({ addToCart }) {
  const [topItems, setTopItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addProcessing = useRef(false);

  useEffect(() => {
    const loadTopItems = async () => {
      try {
        setLoading(true);
        const items = await fetchTopRatedItems();
        setTopItems(items.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTopItems();
  }, []);

  useEffect(() => {
    if (topItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % topItems.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [topItems.length]);

  if (loading) {
    return (
      <section className="special animate-slideInRight">
        Loading popular items...
      </section>
    );
  }

  if (error) {
    return (
      <section className="special animate-slideInRight">
        Error loading popular items: {error}
      </section>
    );
  }

  if (topItems.length === 0) {
    return (
      <section className="special animate-slideInRight">
        No popular items available.
      </section>
    );
  }

  const currentItem = topItems[currentIndex];

  return (
    <section className="special animate-slideInRight">
      <article className="special-card transition-opacity duration-500 opacity-100">
       <img
  className="bg w-full h-80 object-cover"
  src={
    currentItem.image
      ? currentItem.image.startsWith("http")
        ? currentItem.image
        : `${process.env.REACT_APP_API_URL}/${currentItem.image}`
      : "https://placehold.co/800x400"
  }
  alt={currentItem.name}
  onError={(e) => {
    e.target.src = "https://placehold.co/800x400";
  }}
/>
        <div className="special-overlay">
          <span className="tag">
            <i className="fa-solid fa-fire"></i> Top Rated
          </span>
          <h2 className="special-title">{currentItem.name}</h2>
          <p className="special-desc">
            {currentItem.description || "Delicious top-rated item."}
          </p>
          <div className="price-rating">
            <span className="price">₹{currentItem.price.toFixed(2)}</span>
            <span className="rating">
              <i className="fa-solid fa-star"></i> {currentItem.rating || 0}
            </span>
          </div>
          <button
            className="btn primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!addProcessing.current) {
                addProcessing.current = true;
                addToCart(currentItem._id);
                setTimeout(() => {
                  addProcessing.current = false;
                }, 100);
              }
            }}
            type="button"
          >
            <i className="fa-solid fa-plus"></i> Add to Cart
          </button>
        </div>
      </article>
      {/* Optional indicators for cycling */}
      {/* <div className="flex justify-center mt-4 space-x-2">
        {topItems.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div> */}
    </section>
  );
}

export default Special;
