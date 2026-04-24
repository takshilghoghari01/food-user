import React, { useRef } from "react";

function MenuItem({ item, qty, addToCart, changeQty }) {
  const addProcessing = useRef(false);
  const changeProcessing = useRef(false);
  const discountedPrice =
    item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;

  return (
    <article className="card">
     <img
  className="thumb"
  src={
    item.image
      ? item.image.startsWith("http")
        ? item.image
        : `${process.env.REACT_APP_API_URL}/${item.image}`
      : "https://placehold.co/200x200"
  }
  alt={item.name}
  onError={(e) => {
    e.target.src = "https://placehold.co/200x200";
  }}
/>
      <div className="body">
        <h4 className="title">{item.name}</h4>
        <p className="desc">{item.description}</p>
        <div className="meta">
          <div className="price">
            {item.discount > 0 ? (
              <>
                <span style={{ textDecoration: "line-through", color: "#999" }}>
                  ₹{item.price.toFixed(2)}
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#e74c3c",
                    marginLeft: "8px",
                  }}
                >
                  ₹{discountedPrice.toFixed(2)}
                </span>
              </>
            ) : (
              `₹${item.price.toFixed(2)}`
            )}
          </div>
          <div className="rating">
            <i className="fa-solid fa-star"></i> {item.rating.toFixed(1)}
          </div>
        </div>
        <div className="rating-mobile">
          <i className="fa-solid fa-star"></i> {item.rating.toFixed(1)}
        </div>
        <div className="actions">
          {qty === 0 ? (
            <button
              className="add-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!addProcessing.current) {
                  addProcessing.current = true;
                  addToCart(item._id);
                  setTimeout(() => {
                    addProcessing.current = false;
                  }, 100);
                }
              }}
              type="button"
            >
              <i className="fa-solid fa-plus"></i> Add
            </button>
          ) : (
            <>
              <div className="qty">
                <button
                  aria-label="Decrease"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!changeProcessing.current) {
                      changeProcessing.current = true;
                      changeQty(item._id, -1);
                      setTimeout(() => {
                        changeProcessing.current = false;
                      }, 100);
                    }
                  }}
                  type="button"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span>{qty}</span>
                <button
                  aria-label="Increase"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!changeProcessing.current) {
                      changeProcessing.current = true;
                      changeQty(item._id, 1);
                      setTimeout(() => {
                        changeProcessing.current = false;
                      }, 100);
                    }
                  }}
                  type="button"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
              <div className="price">₹{(discountedPrice * qty).toFixed(2)}</div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default MenuItem;
