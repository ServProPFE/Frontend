import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import ReviewModal from '../components/ReviewModal';
import '../styles/MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user } = useAuth();

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'DONE', 'CANCELLED'];

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const clientId = user?._id || user?.id;
      if (!clientId) {
        setBookings([]);
        return;
      }
      const data = await apiService.get(API_ENDPOINTS.MY_BOOKINGS(clientId));
      // Backend returns { items: [...] }
      const bookingsArray = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
      setBookings(bookingsArray);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      await apiService.patch(`${API_ENDPOINTS.BOOKING_BY_ID(bookingId)}/status`, {
        status: 'CANCELLED',
      });
      fetchBookings();
    } catch (err) {
      alert('Erreur lors de l\'annulation: ' + err.message);
    }
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    alert('Merci pour votre avis !');
    fetchBookings();
  };

  const filteredBookings = filter === 'ALL'
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  if (loading) {
    return <div className="loading">Chargement de vos réservations...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  return (
    <div className="my-bookings">
      <div className="bookings-header">
        <h1>Mes Réservations</h1>
        <div className="status-filters">
          {statuses.map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'ALL' ? 'Toutes' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="bookings-list">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancelBooking}
              onReview={handleReview}
              userType={user?.type}
            />
          ))
        ) : (
          <div className="no-bookings">
            <p>Aucune réservation trouvée</p>
          </div>
        )}
      </div>

      {showReviewModal && selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default MyBookings;
