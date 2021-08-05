import BASEBALL_SD from '@/assets/image/albums/baseball-sd.jpeg';
import BASEBALL_HD from '@/assets/image/albums/baseball-hd.jpeg';
import RIPKEN_LOGO_SD from '@/assets/image/albums/ripken-logo-sd.png';
import RIPKEN_LOGO_HD from '@/assets/image/albums/ripken-logo-hd.png';
import RIPKEN_LOGO_2_SD from '@/assets/image/albums/ripken-logo-2-sd.png';
import RIPKEN_LOGO_2_HD from '@/assets/image/albums/ripken-logo-2-hd.png';
import { AlbumEntity } from '@/common/models/entities/album';
import { uniqueId } from 'lodash';
import { PictureAssetEntity } from '@/common/models/entities/asset';

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

const photosBase = [photo1, photo2, photo3];

const photos = [];

for (let i = 0; i < 20; i++) {
  const photo = {
    ...photosBase[getRandomInt(3)],
    id: uniqueId()
  };
  photos.push(photo);
}

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
  displayDate: 'May 25th, 2021',
  assets: randomAssets()
});

const albumBase1 = new AlbumEntity({
  id: 1,
  name: 'Track',
  displayDate: 'June 5th, 2021',
  assets: randomAssets()
});

const albumBase2 = new AlbumEntity({
  id: 2,
  name: 'Chess Club',
  displayDate: 'June 5th, 2021',
  assets: randomAssets()
});

const albumBase3 = new AlbumEntity({
  id: 3,
  name: 'Afterparty',
  displayDate: 'May 5th, 2021',
  assets: randomAssets()
});

const albumBase4 = new AlbumEntity({
  id: 4,
  name: 'Science Fair',
  displayDate: 'June 5th, 2021',
  assets: randomAssets()
});

const albumBase5 = new AlbumEntity({
  id: 5,
  name: 'France',
  displayDate: 'June 5th, 2021',
  assets: randomAssets()
});

const albumBase6 = new AlbumEntity({
  id: 6,
  name: 'Middle School Life',
  displayDate: 'June 5th, 2021',
  assets: randomAssets()
});

const albumBase8 = new AlbumEntity({
  id: 8,
  name: 'Cross Country',
  displayDate: 'June 5th, 2021',
  assets: randomAssets()
});

export const albums = [
  albumBase1,
  albumBase2,
  albumBase3,
  albumBase4,
  albumBase5,
  albumBase6,
  albumBase7,
  albumBase8
];

export const photoList = photos;
