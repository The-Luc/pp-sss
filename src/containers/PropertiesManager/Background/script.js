import Properties from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import PropertiesContent from './PropertiesContent';

import { useBackgroundProperties } from '@/hooks';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Properties,
    TabMenu,
    PropertiesContent
  },
  data() {
    return {};
  },
  setup() {
    const { backgroundsProps, triggerChange } = useBackgroundProperties();

    return {
      backgroundsProps,
      triggerChange
    };
  },
  computed: {
    isSingle() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return isEmpty(this.backgroundsProps) || this.backgroundsProps.isSingle;
    },
    opacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      if (isEmpty(this.backgroundsProps)) return { left: 1 };

      if (this.backgroundsProps.isSingle) {
        return { left: this.backgroundsProps.left.opacity };
      }

      return {
        left: this.backgroundsProps.left.opacity || 1,
        right: this.backgroundsProps.right.opacity || 1
      };
    },
    isDisabled() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      if (isEmpty(this.backgroundsProps)) return { left: true };

      if (this.backgroundsProps.isSingle) return { left: false };

      return {
        left: this.backgroundsProps.left.isEmpty,
        right: this.backgroundsProps.right.isEmpty
      };
    },
    isLeft() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      if (isEmpty(this.backgroundsProps)) return { left: true };

      if (this.backgroundsProps.isSingle) {
        return { left: this.backgroundsProps.left.isLeft };
      }

      return {
        left: true,
        right: false
      };
    },
    tabActiveName() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      if (isEmpty(this.backgroundsProps) || this.backgroundsProps.isSingle) {
        return '';
      }

      const position = this.backgroundsProps.left.isEmpty ? 'right' : 'left';

      return `background-${position}`;
    }
  },
  methods: {
    /**
     * Fire when opacity is changed from opacity component
     *
     * @param {Boolean} isLeft  is left background change
     * @param {Number}  opacity the opacity data
     */
    onChangeOpacity({ isLeft, opacity }) {
      //this.$root.$emit('printChangeBackgroundProperties', { opacity });
    },
    /**
     * Fire when remove button is click
     *
     * @param {Boolean} isLeft  is left background change
     */
    onRemove(isLeft) {
      //this.$root.$emit('printDeleteElements');
    }
  }
};
