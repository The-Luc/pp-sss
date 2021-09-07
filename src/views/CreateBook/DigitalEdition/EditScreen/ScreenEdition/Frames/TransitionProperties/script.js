import CustomMenu from '@/components/Menu';

import Item from '../../../PropertiesMenu//Transition/Item';

import { useDigitalSheetAction, useSheet } from '@/hooks';

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
    const { getTransition } = useDigitalSheetAction();
    const { currentSheet } = useSheet();

    return { getTransition, currentSheet };
  },
  data() {
    return {
      transition: {},
      topValue: this.top
    };
  },
  async mounted() {
    this.transition = await this.getTransition(
      this.currentSheet.id,
      this.index
    );
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
    onClickOutsideMenu() {
      this.$emit('onClose');
    }
  }
};
