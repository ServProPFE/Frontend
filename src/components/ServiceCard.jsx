import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/ServiceCard.css';

const ServiceCard = ({ service }) => {
  const { t } = useTranslation();

  return (
    <div className="service-card">
      <div className="service-card-header">
        <span className="category-badge">{t(`services.categories.${service.category}`)}</span>
      </div>
      
      <div className="service-card-body">
        <h3>{t(service.name)}</h3>
        <p className="service-description">
          {service.description || t('services.descriptionFallback')}
        </p>
        
        <div className="service-card-footer">
          <div className="price-info">
            <span className="price">{service.priceMin} {service.currency}</span>
            <span className="duration">{t('service.minutes', { count: service.duration })}</span>
          </div>
          
          <Link to={`/services/${service._id}`} className="btn-view">
            {t('services.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
