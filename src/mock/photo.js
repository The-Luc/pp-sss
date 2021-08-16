import BASEBALL_SD from '@/assets/image/albums/baseball-sd.jpeg';
import BASEBALL_HD from '@/assets/image/albums/baseball-hd.jpeg';
import RIPKEN_LOGO_SD from '@/assets/image/albums/ripken-logo-sd.png';
import RIPKEN_LOGO_HD from '@/assets/image/albums/ripken-logo-hd.png';
import RIPKEN_LOGO_2_SD from '@/assets/image/albums/ripken-logo-2-sd.png';
import RIPKEN_LOGO_2_HD from '@/assets/image/albums/ripken-logo-2-hd.png';
import SAMPLE_VIDEO from '@/assets/video/sample.mp4';
import VERTICAL_VIDEO from '@/assets/video/vertical.mp4';
import SAMPLE_THUMBNAIL from '@/assets/image/horizontal-photo.jpg';
import VERTICAL_THUMBNAIL from '@/assets/image/vertical-photo.jpg';
import { AlbumEntity } from '@/common/models/entities/album';
import { uniqueId } from 'lodash';
import {
  PictureAssetEntity,
  VideoAssetEntity
} from '@/common/models/entities/asset';

const photo1 = new PictureAssetEntity({
  id: uniqueId(),
  mediaFileName: 'baseball.jpeg',
  thumbUrl: BASEBALL_SD,
  imageUrl: BASEBALL_HD,
  originalHeight: 3647,
  originalWidth: 4757
});

const photo2 = new PictureAssetEntity({
  id: uniqueId(),
  mediaFileName: 'ripken-logo.png',
  thumbUrl: RIPKEN_LOGO_SD,
  imageUrl: RIPKEN_LOGO_HD,
  originalHeight: 1600,
  originalWidth: 1600
});

const photo3 = new PictureAssetEntity({
  id: uniqueId(),
  mediaFileName: 'ripken-logo-2.png',
  thumbUrl: RIPKEN_LOGO_2_SD,
  imageUrl: RIPKEN_LOGO_2_HD,
  originalHeight: 1600,
  originalWidth: 1600
});

const video = {
  id: uniqueId(),
  mediaFileName: 'sample.mp4',
  thumbUrl: SAMPLE_THUMBNAIL,
  imageUrl: SAMPLE_VIDEO,
  originalHeight: 1080,
  originalWidth: 1920,
  isMedia: true
};

const video1 = new VideoAssetEntity({
  id: uniqueId(),
  mediaFileName: 'sample.mp4',
  thumbUrl: SAMPLE_THUMBNAIL,
  mediaUrl: SAMPLE_VIDEO,
  originalHeight: 1080,
  originalWidth: 1920,
  duration: '1:20'
});

const video2 = new VideoAssetEntity({
  id: uniqueId(),
  mediaFileName: 'vertical.mp4',
  thumbUrl: VERTICAL_THUMBNAIL,
  mediaUrl: VERTICAL_VIDEO,
  originalHeight: 1920,
  originalWidth: 1080,
  duration: '2:20'
});

const mediaBase = [photo1, photo2, photo3, video1, video2];

const media = Array.from({ length: 20 }, () => {
  const inProject = Math.random() * 5 < 2;
  const media = {
    ...mediaBase[getRandomInt(5)],
    inProject,
    id: uniqueId()
  };
  return media;
});

const photosBase = [photo1, photo2, photo3, video];

const photos = Array.from({ length: 20 }, () => {
  const inProject = Math.random() * 5 < 2;
  const photo = {
    ...photosBase[getRandomInt(4)],
    inProject,
    id: uniqueId()
  };
  return photo;
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomAssets() {
  const assets = [];
  const quantity = getRandomInt(5) + 4;
  for (let i = 0; i < quantity; i++) {
    const photo = { ...photos[getRandomInt(20)], id: uniqueId() };
    assets.push(photo);
  }
  return assets;
}

const albumBase7 = new AlbumEntity({
  id: 7,
  name: 'Homecoming',
  displayDate: 'May 25, 2021',
  assets: randomAssets()
});

const albumBase1 = new AlbumEntity({
  id: 1,
  name: 'Track',
  displayDate: 'June 5, 2021',
  assets: randomAssets()
});

const albumBase2 = new AlbumEntity({
  id: 2,
  name: 'Chess Club',
  displayDate: 'June 5, 2021',
  assets: randomAssets()
});

const albumBase3 = new AlbumEntity({
  id: 3,
  name: 'Afterparty',
  displayDate: 'May 5, 2021',
  assets: randomAssets()
});

const albumBase4 = new AlbumEntity({
  id: 4,
  name: 'Science Fair',
  displayDate: 'June 5, 2021',
  assets: randomAssets()
});

const albumBase5 = new AlbumEntity({
  id: 5,
  name: 'France',
  displayDate: 'June 5, 2021',
  assets: randomAssets()
});

const albumBase6 = new AlbumEntity({
  id: 6,
  name: 'Middle School Life',
  displayDate: 'June 5, 2021',
  assets: randomAssets()
});

const albumBase8 = new AlbumEntity({
  id: 8,
  name: 'Cross Country',
  displayDate: 'June 5, 2021',
  assets: randomAssets()
});

const albumBase9 = new AlbumEntity({
  id: 9,
  name: 'AfterParty',
  displayDate: 'June 7, 2021',
  assets: []
});

const albumBase10 = new AlbumEntity({
  id: 10,
  name: 'Drama Fun',
  displayDate: 'June 8, 2021',
  assets: []
});

export const albums = [
  albumBase1,
  albumBase2,
  albumBase3,
  albumBase4,
  albumBase5,
  albumBase6,
  albumBase7,
  albumBase8,
  albumBase9,
  albumBase10
];

export const photoList = photos;

export const mediaList = media;
