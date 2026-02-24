import { Link } from 'react-router-dom';
import '../styles/ServiceCard.css';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-card-header">
        <span className="category-badge">{service.category}</span>
      </div>
      
      <div className="service-card-body">
        <h3>{service.name}</h3>
        <p className="service-description">
          {service.description || 'Service professionnel de qualité'}
        </p>
        
        <div className="service-card-footer">
          <div className="price-info">
            <span className="price">{service.priceMin} {service.currency}</span>
            <span className="duration">{service.duration} min</span>
          </div>
          
          <Link to={`/services/${service._id}`} className="btn-view">
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
