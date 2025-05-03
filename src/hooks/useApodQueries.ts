import {
  useQuery,
  UseQueryResult,
  useInfiniteQuery,
  InfiniteData,
  QueryFunctionContext,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { getApodList, getApodByDate, ApodData } from '../services/apodService';
import { formatUTCDate } from '../utils/date';
import {
  DAYS_PER_PAGE,
  MILLISECONDS_PER_SECOND,
  SECONDS_PER_MINUTE,
} from '../constants';

const STALE_TIME_MINUTES = 10;
const STALE_TIME_MS =
  STALE_TIME_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

// Helper function to calculate date ranges for pages in useInfiniteApodList
const getDatesForPage = (
  pageParam: number
): { startDate: string; endDate: string } => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setUTCDate(today.getUTCDate() - pageParam * DAYS_PER_PAGE);

  const startDate = new Date(endDate);
  // Subtract (DAYS_PER_PAGE - 1) days to get the start date of the 30-day window
  startDate.setUTCDate(endDate.getUTCDate() - (DAYS_PER_PAGE - 1));

  return {
    startDate: formatUTCDate(startDate),
    endDate: formatUTCDate(endDate),
  };
};

/**
 * Hook to fetch APOD data in 30-day pages for infinite scrolling.
 */
export function useInfiniteApodList(): UseInfiniteQueryResult<
  InfiniteData<ApodData[], number>,
  Error
> {
  return useInfiniteQuery<
    ApodData[],
    Error,
    InfiniteData<ApodData[], number>,
    (string | number)[],
    number
  >({
    queryKey: ['apodList', 'infinite'],
    queryFn: async ({
      pageParam,
    }: QueryFunctionContext<(string | number)[], number>): Promise<
      ApodData[]
    > => {
      const { startDate, endDate } = getDatesForPage(pageParam);
      console.log(`Fetching page ${pageParam}: ${startDate} to ${endDate}`); // TODO: Remove before committing
      return getApodList(startDate, endDate);
    },
    getNextPageParam: (
      lastPage: ApodData[],
      _allPages: ApodData[][],
      lastPageParam: number
    ): number | undefined => {
      // Keep fetching unless the last page was empty
      return lastPage.length > 0 ? lastPageParam + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: STALE_TIME_MS,
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
