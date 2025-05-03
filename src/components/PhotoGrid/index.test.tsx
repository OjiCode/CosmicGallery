import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PhotoGrid } from './index';
import { ApodData } from '../../services/apodService';
import * as useApodQueries from '../../hooks/useApodQueries';

vi.mock('../../hooks/useApodQueries');

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

const mockPage1: ApodData[] = [
  {
    date: '2024-07-28',
    title: 'Image 1',
    media_type: 'image',
    url: 'img1.jpg',
    explanation: '',
    service_version: 'v1',
  },
  {
    date: '2024-07-27',
    title: 'Image 2',
    media_type: 'image',
    url: 'img2.jpg',
    explanation: '',
    service_version: 'v1',
  },
];

const mockInfiniteData = {
  pages: [mockPage1],
  pageParams: [0],
};

describe('PhotoGrid', () => {
  let mockUseInfiniteApodList: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseInfiniteApodList = vi.spyOn(useApodQueries, 'useInfiniteApodList');
  });

  it('renders loading state initially', () => {
    mockUseInfiniteApodList.mockReturnValue({
      status: 'pending',
      data: undefined,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetching: true,
      isFetchingNextPage: false,
    } as any);

    renderWithRouter(<PhotoGrid />);
    expect(screen.getByText(/Loading images.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to fetch';
    mockUseInfiniteApodList.mockReturnValue({
      status: 'error',
      data: undefined,
      error: new Error(errorMessage),
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetching: false,
      isFetchingNextPage: false,
    } as any);

    renderWithRouter(<PhotoGrid />);
    expect(
      screen.getByText(`Error loading images: ${errorMessage}`)
    ).toBeInTheDocument();
  });

  it('renders grid with data when loaded successfully', () => {
    mockUseInfiniteApodList.mockReturnValue({
      status: 'success',
      data: mockInfiniteData,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetching: false,
      isFetchingNextPage: false,
    } as any);

    renderWithRouter(<PhotoGrid />);

    expect(screen.getByAltText(/Image 1/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Image 2/i)).toBeInTheDocument();
    expect(screen.getByTestId('photo-grid-sentinel')).toBeInTheDocument();
  });

  it('renders loading more state when fetching next page', () => {
    mockUseInfiniteApodList.mockReturnValue({
      status: 'success',
      data: mockInfiniteData,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetching: false,
      isFetchingNextPage: true,
    } as any);

    renderWithRouter(<PhotoGrid />);
    expect(screen.getByText(/Loading more.../i)).toBeInTheDocument();
  });

  it('renders end of list message when no more pages', () => {
    mockUseInfiniteApodList.mockReturnValue({
      status: 'success',
      data: mockInfiniteData,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetching: false,
      isFetchingNextPage: false,
    } as any);

    renderWithRouter(<PhotoGrid />);
    expect(screen.getByText(/No more images to load./i)).toBeInTheDocument();
  });
});
