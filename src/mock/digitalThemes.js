/**
 * TODO: get image 16x9 from design and use as mock data
 */
const themes = [
  {
    id: 1,
    name: 'Confetti',
    previewImageUrl: 'theme1.jpg'
  },
  {
    id: 2,
    name: 'Comic Too',
    previewImageUrl: 'theme2.jpg'
  },
  {
    id: 3,
    name: 'Paint Spill',
    previewImageUrl: 'theme12.jpg'
  },
  {
    id: 4,
    name: 'Chalkboard',
    previewImageUrl: 'theme4.jpg'
  },
  {
    id: 5,
    name: 'Color Block',
    previewImageUrl: 'theme5.jpg'
  },
  {
    id: 6,
    name: 'Retro Fun',
    previewImageUrl: 'theme6.jpg'
  },
  {
    id: 7,
    name: 'Paper',
    previewImageUrl: 'theme7.jpg'
  },
  {
    id: 8,
    name: 'Outerspace',
    previewImageUrl: 'theme8.jpg'
  },
  {
    id: 9,
    name: 'Linen',
    previewImageUrl: 'theme9.jpg'
  },
  {
    id: 10,
    name: 'Dark',
    previewImageUrl: 'theme10.jpg'
  },
  {
    id: 11,
    name: 'None',
    previewImageUrl: 'none.png'
  }
];

export const themeOptions = themes.map(t => ({
  ...t,
  id: t.id,
  name: t.name,
  value: t.id
}));

export default themes;
