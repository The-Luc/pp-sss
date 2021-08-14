import { ID_PHOTO_All } from '@/common/constants/photoDropdowns';
export const albums = [
  {
    id: ID_PHOTO_All,
    name: 'All'
  },
  {
    id: 1,
    name: 'Track'
  },
  {
    id: 2,
    name: 'Chess Club'
  },
  {
    id: 3,
    name: 'Afterparty'
  },
  {
    id: 8,
    name: 'Cross Country'
  },
  {
    id: 9,
    name: 'AfterParty'
  }
];

export const communities = [
  {
    id: ID_PHOTO_All,
    name: 'All'
  },
  {
    id: 4,
    name: 'Science Fair'
  },
  {
    id: 5,
    name: 'France'
  },
  {
    id: 6,
    name: 'Middle School Life'
  },
  {
    id: 7,
    name: 'Homecoming'
  },
  {
    id: 10,
    name: 'Drama Fun'
  }
];

export const groups = [
  {
    id: 9,
    name: 'Drama Club',
    albums: [...albums]
  },
  {
    id: 10,
    name: 'Recycling Club',
    albums: [...albums]
  }
];

export const personalAlbums = [...albums];

export const photoDropdowns = {
  communities, // community photos
  groups, // group photos
  personalAlbums // my photos
};
