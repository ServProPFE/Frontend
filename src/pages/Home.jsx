import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import { resolveServiceName } from '../utils/serviceName';

const Home = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  const normalizeItems = (payload) => {
    if (Array.isArray(payload?.items)) {
      return payload.items;
    }

    if (Array.isArray(payload)) {
      return payload;
    }

    return [];
  };

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
      const servicesArray = normalizeItems(servicesData);
      const offersArray = normalizeItems(offersData);
      
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
      filtered = filtered.filter(service => {
        const translatedName = resolveServiceName(t, service.name);
        return translatedName.toLowerCase().includes(searchTerm.toLowerCase());
      });
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
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 px-6 py-14 text-white shadow-2xl shadow-slate-900/20 sm:px-10">
        <div className="absolute -left-20 top-4 h-60 w-60 rounded-full bg-teal-300/30 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-orange-300/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
            Smart Home Services Platform
          </p>
          <h1 className="display-title text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-100/90 sm:text-base">
            {t('hero.subtitle')}
          </p>

          <div className="mx-auto mt-8 max-w-4xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {offers.length > 0 && (
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="display-title text-2xl font-bold text-slate-900 sm:text-3xl">{t('offers.title')}</h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
              Limited Time
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {offers.map(offer => (
              <article key={offer._id} className="rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-orange-50 p-5 shadow-lg shadow-orange-200/30">
                <div className="mb-3 inline-flex rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                  {t('offers.discount', { value: offer.discount })}
                </div>
                <h3 className="display-title text-lg font-bold text-slate-900">{t(offer.title)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{offer.description}</p>
                <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t('offers.validUntil', { date: new Date(offer.validUntil).toLocaleDateString() })}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="display-title text-2xl font-bold text-slate-900 sm:text-3xl">{t('services.title')}</h2>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-700">
            {filteredServices.length} {t('services.title')}
          </span>
        </div>

        <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            {t('services.noResults')}
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
