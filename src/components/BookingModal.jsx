import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/BookingModal.css';

const BookingModal = ({ service, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    expectedAt: '',
    address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeOffer, setActiveOffer] = useState(null);

  useEffect(() => {
    const fetchActiveOffer = async () => {
      try {
        const data = await apiService.get(`${API_ENDPOINTS.OFFERS}?serviceId=${service._id}&active=true`);
        let offersArray = [];
        if (Array.isArray(data?.items)) {
          offersArray = data.items;
        } else if (Array.isArray(data)) {
          offersArray = data;
        }
        const now = new Date();

        const validOffer = offersArray
          .filter((offer) => !offer.validUntil || new Date(offer.validUntil) >= now)
          .sort((a, b) => (Number(b.discount || 0) - Number(a.discount || 0)))[0] || null;

        setActiveOffer(validOffer);
      } catch {
        setActiveOffer(null);
      }
    };

    fetchActiveOffer();
  }, [service._id]);

  const priceInfo = useMemo(() => {
    const basePrice = Number(activeOffer?.basePrice ?? service.priceMin ?? 0);
    const discount = Math.max(0, Math.min(Number(activeOffer?.discount ?? 0), 100));
    const total = Math.round((basePrice * (1 - discount / 100) + Number.EPSILON) * 100) / 100;

    return {
      basePrice,
      discount,
      total,
      hasDiscount: discount > 0,
    };
  }, [activeOffer, service.priceMin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First create reservation detail
      const detailData = await apiService.post(API_ENDPOINTS.RESERVATION_DETAILS, {
        address: formData.address,
        description: formData.notes,
        urgent: false,
      });

      // Then create booking
      await apiService.post(API_ENDPOINTS.BOOKINGS, {
        client: user?._id || user?.id,
        service: service._id,
        provider: service.provider._id || service.provider,
        expectedAt: formData.expectedAt,
        totalPrice: priceInfo.total,
        currency: service.currency,
        detail: detailData._id,
      });

      onSuccess();
    } catch (err) {
      setError(err.message || t('booking.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('booking.title', { name: t(service.name) })}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="expectedAt">{t('booking.dateTime')}</label>
            <input
              type="datetime-local"
              id="expectedAt"
              name="expectedAt"
              value={formData.expectedAt}
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">{t('booking.address')}</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder={t('booking.addressPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">{t('booking.notes')}</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder={t('booking.notesPlaceholder')}
            />
          </div>

          <div className="price-summary">
            <span>{t('booking.totalPrice')}:</span>
            <span className="total-amount">{priceInfo.total} {service.currency}</span>
          </div>

          {priceInfo.hasDiscount && (
            <div className="price-summary" style={{ marginTop: '0.35rem' }}>
              <span>{t('offers.discount', { value: priceInfo.discount })}</span>
              <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>
                {priceInfo.basePrice} {service.currency}
              </span>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              {t('booking.cancel')}
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('booking.booking') : t('booking.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
