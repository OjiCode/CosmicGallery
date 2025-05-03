import { PhotoGrid } from '../../components/PhotoGrid';
import './GalleryPage.css';

export const GalleryPage = () => {
  return (
    <div className="gallery-page">
      <PhotoGrid />
    </div>
  );
};

GalleryPage.displayName = 'GalleryPage';
