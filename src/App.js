import { useState, useEffect } from "react";

function Logo() {
  return <h1>🏝️旅遊清單🏝️</h1>;
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) return;

    const newItem = {
      id: Date.now(),
      description: description.trim(),
      quantity,
      packed: false,
    };

    onAddItem(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>旅遊要帶的東西</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="請輸入要帶的東西..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>新增</button>
    </form>
  );
}

function PackingList({
  items,
  onDeleteItem,
  onToggleItem,
  onClearItem,
  onEditItem,
  onMarkAllPacked,
}) {
  const [sortBy, setSortBy] = useState("input");
  const hasUnpacked = items.some((item) => !item.packed);

  let sortedItems;

  if (sortBy === "input") sortedItems = items;

  if (sortBy === "description")
    sortedItems = items.slice().sort((a, b) =>
      a.description.localeCompare(b.description, "zh-TW", {
        sensitivity: "base",
        numeric: true,
      })
    );

  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            key={item.id}
            item={item}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
            onEditItem={onEditItem}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">依照時間排序</option>
          <option value="description">依照筆畫排序</option>
          <option value="packed">依照準備好的排序</option>
        </select>
        <button
          className="btn-mark-all"
          onClick={onMarkAllPacked}
          disabled={!hasUnpacked}
        >
          全部勾選
        </button>
        <button onClick={onClearItem}>清除</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItem, onEditItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempDescription, setTempDescription] = useState(item.description);
  const [tempQuantity, setTempQuantity] = useState(item.quantity);

  //暫存舊資料
  useEffect(() => {
    setTempDescription(item.description);
    setTempQuantity(item.quantity);
  }, [item.description, item.quantity]);

  function handleSave() {
    if (!tempDescription.trim()) return;
    onEditItem(item.id, tempDescription.trim(), tempQuantity);
    setIsEditing(false);
  }

  function handleCancel() {
    setTempDescription(item.description);
    setTempQuantity(item.quantity);
    setIsEditing(false);
  }

  if (isEditing) {
    //  編輯模式
    return (
      <li className="editing">
        <select
          value={tempQuantity}
          onChange={(e) => setTempQuantity(Number(e.target.value))}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={tempDescription}
          onChange={(e) => setTempDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
        />

        <button onClick={handleSave}>💾</button>
        <button onClick={handleCancel}>❌</button>
      </li>
    );
  }

  //  一般顯示模式
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} 個 {item.description}
      </span>
      <button onClick={() => setIsEditing(true)}>✏️</button>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <footer className="stats">
        <em>
          <span>✈️</span>開始準備旅遊用品吧!
        </em>
      </footer>
    );

  const numItem = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percent = Math.round((numPacked / numItem) * 100);

  return (
    <footer className="stats">
      <em>
        {percent === 100
          ? "東西都準備好了，可以出發了🛫"
          : `你有${numItem}個東西在清單裡，你已經準備了${numPacked}個 (${percent}%)`}
      </em>

      <div className="progress">
        <div className="progress__track">
          <div
            className="progress__fill"
            style={{ transform: `scaleX(${percent / 100})` }}
          ></div>
        </div>

        <span className="progress__label">{percent}%</span>
      </div>
    </footer>
  );
}

function App() {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem("travel-items");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to parse items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("travel-items", JSON.stringify(items));
  }, [items]);

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleAddItem(newItem) {
    setItems((items) => {
      const existing = items.find(
        (item) =>
          item.description.trim().toLowerCase() ===
          newItem.description.trim().toLowerCase()
      );

      if (!existing) {
        return [...items, newItem];
      }

      const confirmAdd = window.confirm(
        `「${existing.description}」已經在清單裡囉，要把數量增加 ${newItem.quantity} 嗎？`
      );

      if (!confirmAdd) return items;

      return items.map((item) =>
        item.id === existing.id
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
    });
  }

  function handleDeleteItem(id) {
    const confirmDelete = window.confirm(`確認要刪除嗎？`);

    if (confirmDelete)
      setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleEditItem(id, newDescription, newQuantity) {
    setItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, description: newDescription, quantity: newQuantity }
          : item
      )
    );
  }

  function handleClearItem() {
    const confirmClear = window.confirm("確定要清除所有資料嗎?");
    if (confirmClear) setItems([]);
  }

  function handleMarkAllPacked() {
    setItems((items) =>
      items.map((item) => ({
        ...item,
        packed: true,
      }))
    );
  }

  return (
    <div className="app">
      {/* 注意這裡 className="app"，對應你 CSS 的 .app */}
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearItem={handleClearItem}
        onEditItem={handleEditItem}
        onMarkAllPacked={handleMarkAllPacked}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;
