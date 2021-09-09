import BoxProperties from '@/components/Properties/BoxProperties';
import Item from './Item';

import {
  useActionDigitalSheet,
  useFrame,
  useGetterDigitalSheet,
  useSheet
} from '@/hooks';

export default {
  components: {
    BoxProperties,
    Item
  },
  setup() {
    const { getAndCorrectTransitions } = useActionDigitalSheet();
    const { currentSheet } = useSheet();
    const { triggerTransition } = useGetterDigitalSheet();
    const { currentFrameIndex, totalFrame } = useFrame();

    return {
      getAndCorrectTransitions,
      currentSheet,
      triggerTransition,
      currentFrameIndex,
      totalFrame
    };
  },
  data() {
    return {
      transitions: [],
      sheetId: this.currentSheet.id
    };
  },
  watch: {
    triggerTransition() {
      this.updateTransitions();
    }
  },
  mounted() {
    this.updateTransitions();
  },
  methods: {
    /**
     * Update transitions
     */
    async updateTransitions() {
      this.transitions = await this.getAndCorrectTransitions(
        this.sheetId,
        this.totalFrame - 1
      );
    }
  }
};
