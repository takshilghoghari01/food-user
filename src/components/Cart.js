import React, { useRef } from "react";

function Cart({
  cart,
  items,
  cartOpen,
  setCartOpen,
  changeQty,
  removeItem,
  clearCart,
  subtotal,
  tax,
  total,
  onOrderNow,
}) {
  const changeProcessing = useRef(false);
  const ids = Object.keys(cart);

  return (
    <aside id="cartSheet" className={`sheet ${cartOpen ? "open" : ""}`}>
      <div className="sheet-handle"></div>
      <div className="sheet-header">
        <h3>Your Cart</h3>
        <button
          className="close-sheet"
          id="closeCart"
          onClick={() => setCartOpen(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="sheet-body" id="cartItemsList">
        {ids.length > 0 ? (
          ids.map((id) => {
            const item = items.find((i) => String(i.id) === id);
            if (!item) return null; // skip if item not found
            const qty = cart[id].qty;
            const discountedPrice =
              item.discount > 0
                ? item.price * (1 - item.discount / 100)
                : item.price;
            const line = discountedPrice * qty;
            return (
              <div key={id} className="cart-item">
               <img
  className="ci-thumb"
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
                <div>
                  <h4 className="ci-title">{item.name}</h4>
                  <div className="ci-meta">
                    ₹{discountedPrice.toFixed(2)} •{" "}
                    <i
                      className="fa-solid fa-star"
                      style={{ color: "#f59e0b" }}
                    ></i>{" "}
                    {item.rating.toFixed(1)}
                  </div>
                  <div className="qty" style={{ marginTop: "8px" }}>
                    <button
                      aria-label="Decrease"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!changeProcessing.current) {
                          changeProcessing.current = true;
                          changeQty(id, -1);
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
                          changeQty(id, 1);
                          setTimeout(() => {
                            changeProcessing.current = false;
                          }, 100);
                        }
                      }}
                      type="button"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                    <button
                      aria-label="Remove item"
                      className="btn secondary"
                      style={{ marginLeft: "8px", padding: "6px 10px" }}
                      onClick={() => removeItem(id)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
                <div className="ci-price">₹{line.toFixed(2)}</div>
              </div>
            );
          })
        ) : (
          <p className="hint" style={{ margin: "6px 0" }}>
            Your cart is empty. Add something tasty 😋
          </p>
        )}
      </div>
      <div className="sheet-summary">
        <div className="row">
          <span>Subtotal</span>
          <span id="sumSubtotal">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="row">
          <span>Tax</span>
          <span id="sumTax">₹{tax.toFixed(2)}</span>
        </div>
        <div className="row total">
          <span>Total</span>
          <span id="sumTotal">₹{total.toFixed(2)}</span>
        </div>
        <div className="sheet-actions">
          <button
            className="btn secondary"
            id="clearCart"
            onClick={() => {
              if (Object.keys(cart).length === 0) return;
              if (window.confirm("Clear all items from cart?")) {
                clearCart();
              }
            }}
          >
            Clear Cart
          </button>
          <button
            className="btn primary"
            id="orderNow"
            onClick={() => {
              if (typeof onOrderNow === "function") {
                onOrderNow();
              }
            }}
          >
            Order Now
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Cart;
