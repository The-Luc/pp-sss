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
  props: {
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: ''
    };
  },
  setup({ isDigital }) {
    const { backgroundsProps, triggerChange } = useBackgroundProperties(
      isDigital
    );

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
      console.log(this.backgroundsProps.isSingle)

      return this.backgroundsProps.isSingle;
    },
    opacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      if (this.backgroundsProps.isEmpty) return 1;

      if (this.backgroundsProps.isSingle) {
        return this.backgroundsProps.background.opacity;
      }

      const { left, right } = this.backgroundsProps;

      return {
        left: isEmpty(left) ? 1 : left.opacity,
        right: isEmpty(right) ? 1 : right.opacity
      };
    },
    isDisabled() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      if (this.backgroundsProps.isEmpty) return true;

      if (this.backgroundsProps.isSingle) return false;

      return {
        left: isEmpty(this.backgroundsProps.left),
        right: isEmpty(this.backgroundsProps.right)
      };
    },
    isLeft() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      if (this.backgroundsProps.isEmpty) return true;

      if (this.backgroundsProps.isSingle) {
        return this.backgroundsProps.background.isLeftPage;
      }

      return {
        left: true,
        right: false
      };
    },
    emptyStatus() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      if (this.backgroundsProps.isEmpty || this.backgroundsProps.isSingle) {
        return null;
      }

      return {
        left: isEmpty(this.backgroundsProps.left),
        right: isEmpty(this.backgroundsProps.right)
      };
    }
  },
  watch: {
    emptyStatus: {
      deep: true,
      handler(newValue, oldValue) {
        if (isEmpty(newValue)) {
          return;
        }

        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          const name = `background-${newValue.left ? 'right' : 'left'}`;

          this.activeTab = name;
        }
      }
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
      this.$root.$emit('printChangeBackgroundProperties', {
        backgroundId: this.getId(isLeft),
        isLeftBackground: isLeft,
        prop: { opacity }
      });
    },
    /**
     * Fire when remove button is click
     *
     * @param {Boolean} isLeft  is left background change
     */
    onRemove(isLeft) {
      this.$root.$emit('printDeleteBackground', {
        backgroundId: this.getId(isLeft),
        isLeftBackground: isLeft
      });
    },
    /**
     * Get the id of background which triggered event
     *
     * @param   {Boolean} isLeft  is left background
     * @returns {String}          id of background
     */
    getId(isLeft) {
      const position = isLeft ? 'left' : 'right';

      return this.backgroundsProps.isSingle
        ? this.backgroundsProps.background.id
        : this.backgroundsProps[position].id;
    },
    /**
     * Get the name of tab when use change tab
     *
     * @param {String}  tabName current tab name
     */
    onTabChange(tabName) {
      this.activeTab = tabName;
    }
  }
};
