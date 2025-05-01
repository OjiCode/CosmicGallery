import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getApodList, getApodByDate, ApodData } from '../services/apodService';

/**
 * Fetch a list of APOD entries for a given date range.
 * @param startDate - The start date (YYYY-MM-DD).
 * @param endDate - The end date (YYYY-MM-DD).
 * @returns A list of APOD items for the given date range.
 */
export function useApodList(
  startDate?: string,
  endDate?: string
): UseQueryResult<ApodData[], Error> {
  return useQuery({
    queryKey: ['apodList', startDate, endDate],
    queryFn: () => {
      if (!startDate || !endDate) {
        return Promise.reject(
          new Error('Start date and end date are required.')
        );
      }
      return getApodList(startDate, endDate);
    },
    staleTime: 60 * 60 * 1000, // 1 hour in milliseconds
    enabled: !!startDate && !!endDate,
  });
}

/**
 * Fetch a single APOD entry for a specific date.
 * @param date - The date (YYYY-MM-DD).
 * @returns The APOD for the given date.
 */
export function useApodByDate(date?: string): UseQueryResult<ApodData, Error> {
  return useQuery({
    queryKey: ['apod', date],
    queryFn: () => {
      if (!date) {
        return Promise.reject(new Error('Date is required.'));
      }
      return getApodByDate(date);
    },
    enabled: !!date,
  });
}
