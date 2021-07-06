import THEME_01 from '@/assets/image/themes/theme1.jpg';
import THEME_02 from '@/assets/image/themes/theme2.jpg';
import THEME_04 from '@/assets/image/themes/theme4.jpg';
import THEME_05 from '@/assets/image/themes/theme5.jpg';
import THEME_06 from '@/assets/image/themes/theme6.jpg';
import THEME_07 from '@/assets/image/themes/theme7.jpg';
import THEME_08 from '@/assets/image/themes/theme8.jpg';
import THEME_09 from '@/assets/image/themes/theme9.jpg';
import THEME_10 from '@/assets/image/themes/theme10.jpg';
import THEME_11 from '@/assets/image/themes/none.png';
import THEME_12 from '@/assets/image/themes/theme12.jpg';

const themes = [
  {
    id: 1,
    name: 'Confetti',
    previewImageUrl: THEME_01
  },
  {
    id: 2,
    name: 'Comic Too',
    previewImageUrl: THEME_02
  },
  {
    id: 3,
    name: 'Paint Spill',
    previewImageUrl: THEME_12
  },
  {
    id: 4,
    name: 'Chalkboard',
    previewImageUrl: THEME_04
  },
  {
    id: 5,
    name: 'Color Block',
    previewImageUrl: THEME_05
  },
  {
    id: 6,
    name: 'Retro Fun',
    previewImageUrl: THEME_06
  },
  {
    id: 7,
    name: 'Paper',
    previewImageUrl: THEME_07
  },
  {
    id: 8,
    name: 'Outerspace',
    previewImageUrl: THEME_08
  },
  {
    id: 9,
    name: 'Linen',
    previewImageUrl: THEME_09
  },
  {
    id: 10,
    name: 'Dark',
    previewImageUrl: THEME_10
  },
  {
    id: 11,
    name: 'None',
    previewImageUrl: THEME_11
  }
];

export const themeOptions = themes.map(t => ({
  ...t,
  id: t.id,
  name: t.name,
  value: t.id
}));

export default themes;
