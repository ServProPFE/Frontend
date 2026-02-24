import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import '../styles/ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [providerInfo, setProviderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch service data
      const serviceData = await apiService.get(API_ENDPOINTS.SERVICE_BY_ID(id));
      setService(serviceData);

      // Fetch provider info if available
      if (serviceData?.provider) {
        setProviderInfo(serviceData.provider);
      }

      // Fetch reviews for this service (don't let reviews error break service display)
      try {
        const reviewsData = await apiService.get(API_ENDPOINTS.SERVICE_REVIEWS(id));
        // Backend returns { items: [...] }
        const reviewsArray = Array.isArray(reviewsData?.items) 
          ? reviewsData.items 
          : (Array.isArray(reviewsData) ? reviewsData : []);
        setReviews(reviewsArray);
      } catch (reviewErr) {
        console.error('Error fetching reviews:', reviewErr);
        setReviews([]);
      }
    } catch (err) {
      console.error('Error fetching service details:', err);
      setError(err.message || 'Erreur lors du chargement du service');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.type !== 'CLIENT') {
      alert('Seuls les clients peuvent réserver des services');
      return;
    }

    setShowBookingModal(true);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  if (!service) {
    return <div className="error">Service non trouvé</div>;
  }

  return (
    <div className="service-detail">
      <div className="service-header">
        <h1>{service.name}</h1>
        <span className="category-badge">{service.category}</span>
      </div>

      <div className="service-content">
        <div className="service-main">
          <div className="service-info">
            <h2>Description</h2>
            <p>{service.description || 'Aucune description disponible'}</p>
          </div>

          <div className="service-pricing">
            <h2>Tarification</h2>
            <div className="price-info">
              <span className="price">{service.priceMin} {service.currency}</span>
              <span className="duration">Durée: {service.duration} min</span>
            </div>
          </div>

          {providerInfo && (
            <div className="provider-info">
              <h2>À propos du prestataire</h2>
              <div className="provider-card">
                <h3>{providerInfo.name}</h3>
                {providerInfo.providerProfile && (
                  <>
                    {providerInfo.providerProfile.companyName && (
                      <p><strong>Entreprise:</strong> {providerInfo.providerProfile.companyName}</p>
                    )}
                    {providerInfo.providerProfile.experienceYears > 0 && (
                      <p><strong>Expérience:</strong> {providerInfo.providerProfile.experienceYears} ans</p>
                    )}
                    <span className={`status-badge ${providerInfo.providerProfile.verificationStatus}`}>
                      {providerInfo.providerProfile.verificationStatus}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="service-reviews">
            <h2>Avis clients ({reviews.length})</h2>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <span className="rating">⭐ {review.rating}/5</span>
                      <span className="date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucun avis pour le moment</p>
            )}
          </div>
        </div>

        <div className="service-sidebar">
          <div className="booking-card">
            <h3>Réserver ce service</h3>
            <div className="price-display">
              <span className="label">À partir de</span>
              <span className="amount">{service.priceMin} {service.currency}</span>
            </div>
            <button className="btn-book" onClick={handleBookNow}>
              Réserver maintenant
            </button>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          service={service}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            navigate('/my-bookings');
          }}
        />
      )}
    </div>
  );
};

export default ServiceDetail;
