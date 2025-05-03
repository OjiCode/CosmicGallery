import React from 'react';
import { Link } from 'react-router-dom';
import { ApodData } from '../../services/apodService';
import styles from './ApodCard.module.css';

interface ApodCardProps {
  apod: ApodData;
}

export const ApodCard = React.memo(({ apod }: ApodCardProps) => {
  const altText = `NASA's Astronomy Picture of the Day for ${apod.date}: ${apod.title}`;

  const displayUrl =
    apod.media_type === 'video' ? apod.thumbnail_url : apod.url;
  const displayAlt =
    apod.media_type === 'video' ? `Video thumbnail for ${altText}` : altText;

  if (!displayUrl) {
    return null;
  }

  return (
    <Link
      to={`/apod/${apod.date}`}
      className={styles.apodCard}
      aria-label={altText}
    >
      <img
        src={displayUrl}
        alt={displayAlt}
        loading="lazy"
        className={styles.apodCard__image}
      />
    </Link>
  );
});

// Since this is a memoized component, this will help with debugging.
ApodCard.displayName = 'ApodCard';
