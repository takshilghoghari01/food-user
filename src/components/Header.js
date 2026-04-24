import React from "react";
import "./Header.css";

function Header({ search, setSearch, user, onOpenProfile }) {
  const getInitials = (username) => {
    if (!username) return "JD";
    return username
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="brand-logo">FP</div>
        <div className="brand-name">FoodPoint</div>
      </div>
      <label className="nav-search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="search"
          id="searchInput"
          placeholder="Search dishes, e.g. pizza"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase().trim())}
        />
      </label>
      <div className="user-profile-new" onClick={onOpenProfile}>
        <div className="avatar-modern">{getInitials(user?.username)}</div>
        <i className="fa-solid fa-chevron-down profile-arrow"></i>
      </div>
    </header>
  );
}

export default Header;
