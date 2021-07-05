/**
 * TODO: get image 16x9 from design and use as mock data
 */
const themes = [
  {
    id: 1,
    name: 'Confetti',
    previewImageUrl: 'confetti.jpg'
  },
  {
    id: 2,
    name: '3D',
    previewImageUrl: '3D.jpg'
  },
  {
    id: 3,
    name: 'Newsprint',
    previewImageUrl: 'newsprint.jpg'
  },
  {
    id: 4,
    name: 'Tokyo',
    previewImageUrl: 'tokyo.jpg'
  },
  {
    id: 5,
    name: 'Glitch',
    previewImageUrl: 'glitch.jpg'
  },
  {
    id: 6,
    name: 'Nature',
    previewImageUrl: 'nature.jpg'
  },
  {
    id: 7,
    name: 'Pixel',
    previewImageUrl: 'pixel.jpg'
  },
  {
    id: 8,
    name: 'Scribble',
    previewImageUrl: 'scribble.jpg'
  }
];

export const themeOptions = themes.map(t => ({
  ...t,
  id: t.id,
  name: t.name,
  value: t.id
}));

export default themes;
