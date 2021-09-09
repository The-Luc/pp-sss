import CustomMenu from '@/components/Menu';

import Item from '../../../PropertiesMenu//Transition/Item';

import {
  useActionDigitalSheet,
  useFrame,
  useGetterDigitalSheet,
  useSheet
} from '@/hooks';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    CustomMenu,
    Item
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    top: {
      type: Number,
      required: true
    },
    left: {
      type: Number,
      required: true
    }
  },
  setup() {
    const { getAndCorrectTransitions } = useActionDigitalSheet();
    const { currentSheet } = useSheet();
    const { triggerTransition } = useGetterDigitalSheet();
    const { totalFrame } = useFrame();

    return {
      getAndCorrectTransitions,
      currentSheet,
      triggerTransition,
      totalFrame
    };
  },
  data() {
    return {
      transition: {},
      topValue: this.top,
      sheetId: this.currentSheet.id
    };
  },
  watch: {
    triggerTransition() {
      this.updateTransition();
    }
  },
  mounted() {
    this.updateTransition();
  },
  methods: {
    /**
     * Change transition
     *
     * @param {Boolean}  isChanged  is changed
     */
    onTransitionChange({ isChanged }) {
      // 36 is height of Apply to
      this.topValue = isChanged ? this.top - 36 : this.top;
    },
    onClickOutsideMenu({ event }) {
      const target = event.target?.getAttribute('data-container');

      if (isEmpty(target) || target !== 'transition-properties') {
        this.$emit('onClose');
      }
    },
    /**
     * Update transition
     */
    async updateTransition() {
      const transitions = await this.getAndCorrectTransitions(
        this.sheetId,
        this.totalFrame - 1
      );

      this.transition = transitions[this.index];
    }
  }
};
