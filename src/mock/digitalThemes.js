import THEME_01 from '@/assets/image/digital-themes/confetti.jpg';
import THEME_02 from '@/assets/image/digital-themes/3D.jpg';
import THEME_03 from '@/assets/image/digital-themes/newsprint.jpg';
import THEME_04 from '@/assets/image/digital-themes/tokyo.jpg';
import THEME_05 from '@/assets/image/digital-themes/glitch.jpg';
import THEME_06 from '@/assets/image/digital-themes/nature.jpg';
import THEME_07 from '@/assets/image/digital-themes/pixel.jpg';
import THEME_08 from '@/assets/image/digital-themes/scribble.jpg';

/**
 * TODO: get image 16x9 from design and use as mock data
 */
const themes = [
  {
    id: 1,
    name: 'Confetti',
    previewImageUrl: THEME_01
  },
  {
    id: 2,
    name: '3D',
    previewImageUrl: THEME_02
  },
  {
    id: 3,
    name: 'Newsprint',
    previewImageUrl: THEME_03
  },
  {
    id: 4,
    name: 'Tokyo',
    previewImageUrl: THEME_04
  },
  {
    id: 5,
    name: 'Glitch',
    previewImageUrl: THEME_05
  },
  {
    id: 6,
    name: 'Nature',
    previewImageUrl: THEME_06
  },
  {
    id: 7,
    name: 'Pixel',
    previewImageUrl: THEME_07
  },
  {
    id: 8,
    name: 'Scribble',
    previewImageUrl: THEME_08
  }
];

export const themeOptions = themes.map(t => ({
  ...t,
  id: t.id,
  name: t.name,
  value: t.id
}));

export default themes;
