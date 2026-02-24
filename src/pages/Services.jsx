import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import '../styles/Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'PLOMBERIE', 'ELECTRICITE', 'CLIMATISATION', 'NETTOYAGE', 'AUTRE'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(API_ENDPOINTS.SERVICES);
      // Backend returns { items: [...] }
      const servicesArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
      setServices(servicesArray);
      setFilteredServices(servicesArray);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message);
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm, category) => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category && category !== 'ALL') {
      filtered = filtered.filter(service => service.category === category);
      setSelectedCategory(category);
    }

    setFilteredServices(filtered);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'ALL') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(service => service.category === category));
    }
  };

  if (loading) {
    return <div className="loading">Chargement des services...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Tous nos services</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="categories-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category === 'ALL' ? 'Tous' : category}
          </button>
        ))}
      </div>

      <div className="services-grid">
        {filteredServices.map(service => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="no-results">
          <p>Aucun service trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Services;
