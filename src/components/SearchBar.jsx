import { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('ALL');

  const categories = ['ALL', 'PLOMBERIE', 'ELECTRICITE', 'CLIMATISATION', 'NETTOYAGE', 'AUTRE'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, category);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Rechercher un service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="ALL">Toutes catégories</option>
          {categories.slice(1).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <button type="submit" className="search-button">
          Rechercher
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
