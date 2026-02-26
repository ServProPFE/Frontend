import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import '../styles/Home.css';

const Home = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesData, offersData] = await Promise.all([
        apiService.get(API_ENDPOINTS.SERVICES),
        apiService.get(API_ENDPOINTS.ACTIVE_OFFERS),
      ]);
      
      // Backend returns { items: [...] }, handle both formats
      const servicesArray = Array.isArray(servicesData.items) ? servicesData.items : (Array.isArray(servicesData) ? servicesData : []);
      const offersArray = Array.isArray(offersData.items) ? offersData.items : (Array.isArray(offersData) ? offersData : []);
      
      setServices(servicesArray);
      setFilteredServices(servicesArray);
      setOffers(offersArray);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      // Ensure states remain as arrays even on error
      setServices([]);
      setFilteredServices([]);
      setOffers([]);
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
    }

    setFilteredServices(filtered);
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{t('common.error', { message: error })}</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Active Offers Section */}
      {offers.length > 0 && (
        <section className="offers-section">
          <h2>{t('offers.title')}</h2>
          <div className="offers-grid">
            {offers.map(offer => (
              <div key={offer._id} className="offer-card">
                <div className="offer-badge">{t('offers.discount', { value: offer.discount })}</div>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <span className="offer-validity">
                  {t('offers.validUntil', { date: new Date(offer.validUntil).toLocaleDateString() })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="services-section">
        <h2>{t('services.title')}</h2>
        <div className="services-grid">
          {filteredServices.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
        {filteredServices.length === 0 && (
          <p className="no-results">{t('services.noResults')}</p>
        )}
      </section>
    </div>
  );
};

export default Home;
