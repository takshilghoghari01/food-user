import React, { useState, useEffect } from "react";
import {
  fetchUserOrders,
  updateProfile,
  logout,
  submitOrderRatings,
  fetchRatings,
} from "../api";
import "./ProfileModal.css";

function ProfileModal({ user, onClose, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [fullName, setFullName] = useState(user.username);
  const [phone, setPhone] = useState(user.phone);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratedOrders, setRatedOrders] = useState(new Set());

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchUserOrders();
        setOrders(data);
        // Fetch ratings
        const ratings = await fetchRatings();
        setRatedOrders(new Set(ratings.map((r) => r.orderId)));
      } catch (error) {
        console.error("Failed to fetch orders or ratings:", error);
      }
      setLoading(false);
    };
    loadOrders();
  }, [user.username]);

  const getInitials = (username) => {
    if (!username) return "JD";
    return username
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const handleEditProfile = () => {
    setFullName(user.username);
    setPhone(user.phone);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(fullName, phone);
      // Update user in parent
      onClose(); // Close modal, perhaps refresh user
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    setConfirmModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      alert("Logout failed");
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setOrderModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusTag = (status) => {
    if (status === "completed") return "complete";
    return "pending";
  };

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    try {
      await submitOrderRatings(selectedOrder._id, {
        overallRating: selectedRating,
      });
      alert(
        `Thank you for rating us ${selectedRating} star${
          selectedRating > 1 ? "s" : ""
        }!`
      );
      setRatedOrders((prev) => new Set([...prev, selectedOrder.orderId]));
      setShowRating(false);
      setSelectedRating(0);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-container" onClick={(e) => e.stopPropagation()}>
        <button className="back-arrow" onClick={onClose}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="user-info">
          <div className="avatar">{getInitials(user.username)}</div>
          <h1 className="user-name">{user.username}</h1>
          <p className="user-phone">{user.phone}</p>
          <button className="edit-profile-btn" onClick={handleEditProfile}>
            Edit
          </button>
        </div>

        <h2 className="order-history-title">Order History</h2>
        <div className="order-history">
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => {
              const isRated = ratedOrders.has(order.orderId);
              return (
                <div
                  key={order._id}
                  className="order-card"
                  style={{ position: "relative" }}
                  onClick={() => openOrderModal(order)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openOrderModal(order);
                    }
                  }}
                >
                  <div className="product-thumb">
                    {order.items && order.items.length > 0
                      ? order.items[0].itemName.charAt(0)
                      : "?"}
                  </div>
                  <div className="order-info">
                    <div className="order-id">Order ID: {order.orderId}</div>
                    <div className="product-names">
                      {order.items
                        ? order.items.map((item) => item.itemName).join(", ")
                        : "No items"}
                    </div>
                    <div className="order-date">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className={`status-tag ${getStatusTag(order.status)}`}>
                    {order.status}
                  </div>
                  <div className="order-amount">
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                  <button
                    className="rate-btn"
                    disabled={isRated}
                    onClick={
                      isRated
                        ? () => alert("Rating already given")
                        : (e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setShowRating(true);
                          }
                    }
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "5px 10px",
                      background: isRated ? "#ccc" : "#ff6b00",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: isRated ? "not-allowed" : "pointer",
                      fontSize: "12px",
                    }}
                  >
                    {isRated ? "Rated" : "Rate"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Order Details Modal */}
      {orderModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeOrderModal}>
              &times;
            </button>
            <h2>Order Details</h2>
            <ul>
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.itemName} - Quantity: {item.quantity} - Price: ₹
                  {item.priceAtOrder.toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="total-bill">
              Total Bill: ₹{selectedOrder.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div
          className="edit-modal-overlay"
          onClick={() => setEditModalOpen(false)}
        >
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Profile</h3>
            <form onSubmit={handleEditSubmit}>
              <label htmlFor="fullNameInput">Full Name</label>
              <input
                type="text"
                id="fullNameInput"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength="2"
                pattern="^[a-zA-Z\s]+$"
                title="Full name should only contain letters and spaces."
              />
              <label htmlFor="phoneInput">Phone Number</label>
              <input
                type="tel"
                id="phoneInput"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="^\+?\d[\d\s\-]{7,}$"
                title="Enter a valid phone number, minimum 8 digits."
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  Save
                </button>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Logout Modal */}
      {confirmModalOpen && (
        <div
          className="confirm-overlay"
          onClick={() => setConfirmModalOpen(false)}
        >
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-message">
              Are you sure you want to logout?
            </div>
            <div className="confirm-buttons">
              <button className="btn-confirm" onClick={confirmLogout}>
                Yes
              </button>
              <button
                className="btn-cancel"
                onClick={() => setConfirmModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRating && (
        <div
          className="rating-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
          onClick={() => setShowRating(false)}
        >
          <main
            id="ratingInterface"
            className="container"
            style={{
              width: "100%",
              maxWidth: "420px",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0,0,0,.08)",
              background: "#ffffff",
              padding: "32px 28px",
              boxSizing: "border-box",
              fontFamily: "'Inter', sans-serif",
              color: "#111827",
              textAlign: "center",
              paddingBottom: "40px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                color: "#ff6b00",
                fontWeight: 700,
                fontSize: "22px",
                marginBottom: "24px",
              }}
            >
              Rate Your Experience
            </h2>
            <div
              className="rating-container"
              style={{
                position: "relative",
                textAlign: "center",
                paddingBottom: "40px",
              }}
            >
              <div
                className="stars"
                role="radiogroup"
                aria-label="Star rating"
                style={{
                  display: "inline-block",
                  fontSize: "32px",
                  userSelect: "none",
                  cursor: "pointer",
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    role="radio"
                    aria-checked={selectedRating === star}
                    tabIndex={0}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    onClick={() => handleRatingSelect(star)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleRatingSelect(star);
                      }
                      if (e.key === "ArrowRight" && star < 5) {
                        e.target.nextSibling?.focus();
                      }
                      if (e.key === "ArrowLeft" && star > 1) {
                        e.target.previousSibling?.focus();
                      }
                    }}
                    style={{
                      color: selectedRating >= star ? "#ffb400" : "#d1d5db",
                      transition: "color 0.3s ease, transform 0.2s ease",
                      display: "inline-block",
                      transform:
                        selectedRating >= star ? "scale(1.25)" : "none",
                      marginRight: star < 5 ? "4px" : "0",
                    }}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <div
                className="rating-text"
                id="ratingText"
                style={{
                  marginTop: "12px",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#ff6b00",
                }}
              >
                {selectedRating
                  ? `You selected ${selectedRating} star${
                      selectedRating > 1 ? "s" : ""
                    }`
                  : "Select a rating"}
              </div>
              <button
                className="btn-submit"
                id="submitRatingBtn"
                style={{
                  marginTop: "24px",
                  fontWeight: 700,
                  cursor: "pointer",
                  borderRadius: "16px",
                  border: "none",
                  transition: "background 0.3s ease",
                  fontSize: "16px",
                  padding: "14px 0",
                  width: "100%",
                  background: "linear-gradient(135deg, #ff6b00, #ff8a33)",
                  color: "white",
                }}
                onClick={handleSubmitRating}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg, #ff8a33, #ff6b00)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(135deg, #ff6b00, #ff8a33)")
                }
              >
                Submit Rating
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default ProfileModal;
