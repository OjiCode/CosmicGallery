import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteApodList } from '../../hooks/useApodQueries';
import { ApodCard } from '../ApodCard';
import { ApodData } from '../../services/apodService';
import styles from './PhotoGrid.module.css';

export const PhotoGrid = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteApodList();

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (status === 'pending') {
    return <div className={styles.loadingState}>Loading images...</div>; // TODO: Style this
  }

  if (status === 'error') {
    return (
      <div className={styles.errorState}>
        Error loading images: {error?.message}
      </div> // TODO: Style this as well
    );
  }

  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {data.pages.map((page: ApodData[]) =>
          page.map((apod: ApodData) => {
            return <ApodCard key={apod.date} apod={apod} />;
          })
        )}
      </div>
      <div
        ref={sentinelRef}
        className={styles.photoGrid__sentinel}
        aria-hidden="true"
      />

      {isFetchingNextPage && (
        <div className={styles.loadingMoreState}>Loading more...</div>
      )}
      {/* // TODO: More styling here */}

      {!hasNextPage && !isFetching && (
        <div className={styles.endOfListState}>No more images to load.</div>
      )}
      {/* // TODO: Last  bit of styling... I'm tired boss */}
    </div>
  );
};
