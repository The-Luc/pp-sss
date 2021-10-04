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
    const { getTransitions } = useActionDigitalSheet();
    const { currentSheet } = useSheet();
    const { triggerTransition } = useGetterDigitalSheet();
    const { currentFrameIndex } = useFrame();

    return {
      getTransitions,
      currentSheet,
      triggerTransition,
      currentFrameIndex
    };
  },
  data() {
    return {
      transitions: [],
      sheetId: this.currentSheet.id,
      sectionId: this.currentSheet.sectionId
    };
  },
  watch: {
    triggerTransition: {
      immediate: true,
      handler() {
        this.updateTransitions();
      }
    }
  },
  methods: {
    /**
     * Update transitions
     */
    async updateTransitions() {
      this.transitions = await this.getTransitions(
        this.sheetId,
        this.sectionId
      );
    }
  }
};
