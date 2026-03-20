import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ history, onSelect, onClear }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        {!collapsed && <h2 className="sidebar__title">History</h2>}
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {!collapsed && (
        <>
          {history.length === 0 ? (
            <p className="sidebar__empty">No history yet.<br />Generate a QR code to get started.</p>
          ) : (
            <ul className="sidebar__list">
              {history.map((item, index) => (
                <li key={index} className="sidebar__item">
                  <button
                    className="sidebar__item-btn"
                    onClick={() => onSelect(item)}
                    title={item}
                  >
                    <span className="sidebar__item-text">{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {history.length > 0 && (
            <button className="sidebar__clear-btn" onClick={onClear}>
              Clear History
            </button>
          )}
        </>
      )}
    </aside>
  );
}

export default Sidebar;
