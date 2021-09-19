import CustomMenu from '@/components/Menu';

import Item from '../../../PropertiesMenu//Transition/Item';

import {
  useActionDigitalSheet,
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
    const { getTransition } = useActionDigitalSheet();
    const { currentSheet } = useSheet();
    const { triggerTransition } = useGetterDigitalSheet();

    return {
      getTransition,
      currentSheet,
      triggerTransition
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
      const target = event.target;

      const container = 'transition-properties';
      const atrribute = 'data-container';

      const selfContainer = target.getAttribute(atrribute);

      if (!isEmpty(selfContainer) && selfContainer === container) return;

      const query = `[${atrribute}="${container}"]`;

      if (target.closest(query) || target.querySelector(query)) return;

      this.$emit('onClose');
    },
    /**
     * Update transition
     */
    async updateTransition() {
      this.transition = await this.getTransition(this.sheetId, this.index);
    }
  }
};
