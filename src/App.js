import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import { fetchCategories, fetchMenuItems, checkSession } from "./api";
import Header from "./components/Header";
import Special from "./components/Special";
import Categories from "./components/Categories";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Auth from "./components/Auth";
import OrderProcess from "./components/OrderProcess";
import ProfileModal from "./components/ProfileModal";

function App() {
  const [user, setUser] = useState(null); // user object: {name, phone, token}
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fp_cart")) || {};
    } catch (e) {
      return {};
    }
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [showOrderProcess, setShowOrderProcess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await checkSession();
        setUser({ username: userData.username, phone: userData.phone });
      } catch (error) {
        // Not logged in, stay on auth
      }
      setLoading(false);
    };
    checkUserSession();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedItems] = await Promise.all([
          fetchCategories(),
          fetchMenuItems(),
        ]);
        // Filter invalid items to prevent runtime errors
        const validItems = fetchedItems.filter(
          (item) =>
            item &&
            item.name &&
            item.description &&
            item.price !== undefined &&
            (item.image != null || item.image?.url)
        );
        // Map _id to id for categories to fix React key warning
        const mappedCategories = fetchedCategories.map((cat) => ({
          ...cat,
          id: cat._id || cat.id,
        }));
        setCategories(mappedCategories);
        // Map _id to id for items to fix React key warning and ensure unique ids
        const mappedItems = validItems.map((item) => ({
          ...item,
          id: item._id || item.id,
        }));
        setItems(mappedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("fp_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const addToCart = useCallback((id) => {
    setCart((prev) => {
      const newCart = { ...prev };
      const key = String(id);
      if (!newCart[key]) newCart[key] = { qty: 0 };
      newCart[key].qty += 1;
      return newCart;
    });
  }, []);

  // FIXED: changeQty function with proper quantity calculation
  const changeQty = useCallback((id, delta) => {
    setCart((prev) => {
      const newCart = { ...prev };
      const key = String(id);

      if (!newCart[key]) return newCart;

      // Create a completely new object to force React to see the change
      const updatedCart = { ...newCart };
      updatedCart[key] = {
        ...updatedCart[key],
        qty: updatedCart[key].qty + delta,
      };

      if (updatedCart[key].qty <= 0) {
        delete updatedCart[key];
      }

      return updatedCart;
    });
  }, []);

  const removeItem = (id) => {
    setCart((prev) => {
      const newCart = { ...prev };
      const key = String(id);
      delete newCart[key];
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const totals = () => {
    const ids = Object.keys(cart);
    let count = 0,
      subtotal = 0;
    for (const id of ids) {
      const item = items.find((i) => String(i.id) === id);
      if (!item) continue; // skip if item not found
      const qty = cart[id].qty;
      const discountedPrice =
        item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
      count += qty;
      subtotal += discountedPrice * qty;
    }
    const tax = +(subtotal * 0.05);
    const total = subtotal + tax;
    return { count, subtotal, tax, total };
  };

  const { count, subtotal, tax, total } = totals();

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Auth
        onLogin={(userData) => {
          setUser({ username: userData.username, phone: userData.phone }); // Standardize to username
          localStorage.removeItem("tableNumber");
          clearCart();
        }}
      />
    );
  }

  return (
    <div className="app">
      <Header
        search={search}
        setSearch={setSearch}
        user={user}
        onOpenProfile={() => setProfileOpen(true)}
      />
      <main>
        <Special addToCart={addToCart} />
        <div className="section-head">
          <h3>Categories</h3>
          <span className="hint">Swipe →</span>
        </div>
        <Categories
          categories={categories}
          category={category}
          setCategory={setCategory}
        />
        <div className="menu-head">
          <h3>Our Dishes</h3>
        </div>
        <Menu
          items={items}
          cart={cart}
          search={search}
          category={category}
          addToCart={addToCart}
          changeQty={changeQty}
        />
      </main>
      <footer className="cart-footer">
        <button className="cart-summary" onClick={() => setCartOpen(true)}>
          <div className="left">
            <i className="fa-solid fa-bag-shopping"></i>
            <div>
              <div id="footerItems">
                {count} item{count !== 1 ? "s" : ""}
              </div>
              <div className="cta">View cart • Order &amp; Pay</div>
            </div>
          </div>
          <div className="right">
            <strong id="footerTotal">₹{total.toFixed(2)}</strong>
          </div>
        </button>
      </footer>
      <div
        id="sheetBackdrop"
        className={`sheet-backdrop ${cartOpen ? "open" : ""}`}
        onClick={() => setCartOpen(false)}
      ></div>
      <Cart
        cart={cart}
        items={items}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        changeQty={changeQty}
        removeItem={removeItem}
        clearCart={clearCart}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onOrderNow={() => {
          setShowOrderProcess(true);
          setCartOpen(false);
        }}
      />
      {showOrderProcess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowOrderProcess(false);
            }
          }}
        >
          <OrderProcess
            user={user}
            items={items}
            onClose={() => setShowOrderProcess(false)}
            clearCart={clearCart}
          />
        </div>
      )}
      {profileOpen && (
        <ProfileModal
          user={user}
          onClose={() => setProfileOpen(false)}
          onLogout={() => {
            setUser(null);
            setProfileOpen(false);
            clearCart();
          }}
        />
      )}
    </div>
  );
}

export default App;
