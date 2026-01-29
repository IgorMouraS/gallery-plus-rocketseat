import type { Album } from '../../albuns/models/album';

export interface Photo {
  id: string;
  title: string;
  imageId: string;
  albums: Album[];
  albumsIds: string[];
}
