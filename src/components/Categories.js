import React, { useRef } from "react";

function Categories({ categories, category, setCategory }) {
  const categoriesRef = useRef();

  const handleClick = (cat, btn) => {
    setCategory(cat.name);
    categoriesRef.current.scrollTo({
      left: btn.offsetLeft - 16,
      behavior: "smooth",
    });
  };

  return (
    <section className="categories" ref={categoriesRef} id="categories">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`cat ${cat.name === category ? "active" : ""}`}
          data-cat={cat.name}
          onClick={(e) => handleClick(cat, e.currentTarget)}
        >
          <span className="circle">
            <img
  src={
    cat.image
      ? cat.image.startsWith("http")
        ? cat.image
        : `${process.env.REACT_APP_API_URL}/${cat.image}`
      : "https://placehold.co/200x200"
  }
  alt={cat.name}
  loading="lazy"
  onError={(e) => {
    e.target.src = "https://placehold.co/200x200";
  }}
/>
          </span>
          <span className="label">{cat.name}</span>
        </button>
      ))}
    </section>
  );
}

export default Categories;
