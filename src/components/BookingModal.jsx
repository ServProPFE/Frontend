import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import '../styles/BookingModal.css';

const BookingModal = ({ service, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    expectedAt: '',
    address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        totalPrice: service.priceMin,
        currency: service.currency,
        detail: detailData._id,
      });

      onSuccess();
    } catch (err) {
      setError(err.message || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Réserver: {service.name}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="expectedAt">Date et heure</label>
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
            <label htmlFor="address">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Adresse complète"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (optionnel)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Informations supplémentaires..."
            />
          </div>

          <div className="price-summary">
            <span>Prix total:</span>
            <span className="total-amount">{service.priceMin} {service.currency}</span>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Réservation...' : 'Confirmer la réservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
