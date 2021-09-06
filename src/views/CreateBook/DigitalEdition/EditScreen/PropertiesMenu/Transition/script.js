import BoxProperties from '@/components/Properties/BoxProperties';
import Item from './Item';

import { useFrame } from '@/hooks';

export default {
  components: {
    BoxProperties,
    Item
  },
  setup() {
    const { frames } = useFrame();

    return { frames };
  }
};
