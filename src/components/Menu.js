import React from "react";
import MenuItem from "./MenuItem";

function Menu({ items, cart, search, category, addToCart, changeQty }) {
  const filtered = items.filter((it) => {
    if (!it) return false; // Skip undefined items to prevent errors
    const byCat = category === "all" ? true : it.category === category;
    const bySearch = !search
      ? true
      : it.name.toLowerCase().includes(search) ||
        it.description.toLowerCase().includes(search);
    return byCat && bySearch;
  });

  return (
    <section className="grid" id="menuGrid">
      {filtered.length > 0 ? (
        filtered.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            qty={cart[item.id]?.qty || 0}
            addToCart={addToCart}
            changeQty={changeQty}
          />
        ))
      ) : (
        <p className="hint" style={{ margin: "8px 4px" }}>
          No dishes found. Try another search.
        </p>
      )}
    </section>
  );
}

export default Menu;
