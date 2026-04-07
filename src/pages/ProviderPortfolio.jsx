import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';
import { resolveServiceName } from '../utils/serviceName';

const ProviderPortfolio = () => {
  const { providerId } = useParams();
  const { t } = useTranslation();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      setError('');

      try {
        const [providersRes, servicesRes, portfoliosRes] = await Promise.all([
          apiService.get(API_ENDPOINTS.PROVIDERS),
          apiService.get(`${API_ENDPOINTS.SERVICES}?providerId=${encodeURIComponent(providerId)}`),
          apiService.get(`${API_ENDPOINTS.PORTFOLIOS}?providerId=${encodeURIComponent(providerId)}`),
        ]);

        let providersItems = [];
        if (Array.isArray(providersRes?.items)) {
          providersItems = providersRes.items;
        } else if (Array.isArray(providersRes)) {
          providersItems = providersRes;
        }

        const currentProvider = providersItems.find((item) => String(item._id || item.id) === String(providerId));
        setProvider(currentProvider || null);

        let serviceItems = [];
        if (Array.isArray(servicesRes?.items)) {
          serviceItems = servicesRes.items;
        } else if (Array.isArray(servicesRes)) {
          serviceItems = servicesRes;
        }

        let portfolioItems = [];
        if (Array.isArray(portfoliosRes?.items)) {
          portfolioItems = portfoliosRes.items;
        } else if (Array.isArray(portfoliosRes)) {
          portfolioItems = portfoliosRes;
        }

        setServices(serviceItems);
        setPortfolios(portfolioItems);
      } catch (err) {
        setError(err.message || 'Failed to load provider portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      loadPortfolio();
    }
  }, [providerId]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{provider?.name || 'Provider Portfolio'}</h1>
          <p className="mt-2 text-sm text-slate-600">Provider ID: {providerId}</p>
        </div>
        <Link to="/providers" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Back to providers
        </Link>
      </div>

      {loading && <p className="text-slate-700">Loading portfolio...</p>}
      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Services</h2>
            <div className="mt-4 space-y-3">
              {services.map((service) => (
                <article key={service._id} className="rounded-xl border border-slate-200 p-3">
                  <h3 className="font-semibold text-slate-900">{resolveServiceName(t, service.name, 'Service')}</h3>
                  <p className="text-sm text-slate-600">Category: {service.category || '-'}</p>
                  <p className="text-sm text-slate-600">Price: {service.priceMin ?? '-'} {service.currency || ''}</p>
                  <p className="text-sm text-slate-600">Duration: {service.duration ?? '-'} min</p>
                </article>
              ))}
              {!services.length && <p className="text-sm text-slate-600">No services found for this provider.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Portfolio Items</h2>
            <div className="mt-4 space-y-4">
              {portfolios.map((portfolio) => (
                <article key={portfolio._id} className="rounded-xl border border-slate-200 p-3">
                  <h3 className="font-semibold text-slate-900">{portfolio.title || 'Untitled portfolio'}</h3>
                  <p className="text-sm text-slate-600">{portfolio.description || 'No description'}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {(Array.isArray(portfolio.images) ? portfolio.images : []).filter(Boolean).map((imageUrl, index) => (
                      <img
                        key={`${portfolio._id}-${index}`}
                        src={imageUrl}
                        alt="Portfolio"
                        className="h-24 w-full rounded-lg border border-slate-200 object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </article>
              ))}
              {!portfolios.length && <p className="text-sm text-slate-600">No portfolio items found for this provider.</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProviderPortfolio;
