const API_BASE_URL = process.env.REACT_APP_API_URL + "/api";
// Login function
export const login = async (phone, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ phone, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    throw error;
  }
};

// Register function
export const register = async (name, phone, password, role = "customer") => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: name, phone, password, role }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Registration failed");
    }
  } catch (error) {
    throw error;
  }
};

// Fetch categories (public)
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch categories");
    }
  } catch (error) {
    throw error;
  }
};

// Fetch menu items (public)
export const fetchMenuItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu-items`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch menu items");
    }
  } catch (error) {
    throw error;
  }
};

// Check session function
export const checkSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      if (!data || !data.username || !data.phone) {
        throw new Error("Invalid user data from server");
      }
      return data;
    } else {
      throw new Error("Not logged in");
    }
  } catch (error) {
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Logout failed");
    }
  } catch (error) {
    throw error;
  }
};

// Create order function
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Order creation failed");
    }
  } catch (error) {
    throw error;
  }
};

// Submit order ratings function
export const submitOrderRatings = async (orderId, ratingsData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings/order/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
  overallRating: Number(ratingsData.overallRating), // 🔥 FIX
})
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Rating submission failed");
    }
  } catch (error) {
    throw error;
  }
};

export const fetchTopRatedItems = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/menu-items?sort=rating&limit=3`
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch top rated items");
    }
  } catch (error) {
    throw error;
  }
};

// Fetch user orders (authenticated)
export const fetchUserOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/user`, {
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch user orders");
    }
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateProfile = async (username, phone) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, phone }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Update failed");
    }
  } catch (error) {
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Status update failed");
    }
  } catch (error) {
    throw error;
  }
};

// Fetch ratings
export const fetchRatings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ratings`, {
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch ratings");
    }
  } catch (error) {
    throw error;
  }
};
