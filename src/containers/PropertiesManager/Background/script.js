import PropertiesContainer from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import Animation from '@/components/Properties/Features/Animation';
import PropertiesContent from './PropertiesContent';

import { useBackgroundProperties, useGetterDigitalSheet } from '@/hooks';

import { isEmpty } from '@/common/utils';

import {
  BACKGROUND_APPLY_OPTIONS,
  EVENT_TYPE,
  OBJECT_TYPE
} from '@/common/constants';

export default {
  components: {
    PropertiesContainer,
    TabMenu,
    PropertiesContent,
    Animation
  },
  props: {
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { backgroundsProps, triggerChange } = useBackgroundProperties();
    const { totalPlayOutOrder } = useGetterDigitalSheet();

    return {
      backgroundsProps,
      triggerChange,
      totalPlayOutOrder
    };
  },
  data() {
    return {
      activeTab: '',
      applyOptions: BACKGROUND_APPLY_OPTIONS
    };
  },
  computed: {
    isSingle() {
      if (this.triggerChange) {
        // just for trigger the change
      }

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
  mounted() {
    if (this.isDigital) {
      this.$root.$emit(EVENT_TYPE.BACKGROUND_SELECT, { isSelected: true });
    }
  },
  beforeDestroy() {
    if (this.isDigital) {
      this.$root.$emit(EVENT_TYPE.BACKGROUND_SELECT, { isSelected: false });
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
      const eventName = this.isDigital
        ? 'digitalChangeBackgroundProperties'
        : 'printChangeBackgroundProperties';

      this.$root.$emit(eventName, {
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
      const eventName = this.isDigital
        ? 'digitalDeleteBackground'
        : 'printDeleteBackground';

      this.$root.$emit(eventName, {
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
    },
    /**
     * Emit animation option selected
     * @param {Object} animationConfig Animation option selected
     */
    onChangeAnimation(object) {
      this.$emit('change', object);
    },
    /**
     * Emit apply option selected
     * @param {Object} applyOption apply option selected
     */
    onApplyAnimation(object) {
      this.$emit('onApply', object);
    },
    /**
     * Emit apply option selected
     * @param {Object} applyOption apply option selected
     */
    onPreviewAnimation({ config }) {
      this.$root.$emit(EVENT_TYPE.PREVIEW_ANIMATION, {
        config,
        objectType: OBJECT_TYPE.BACKGROUND
      });
    }
  }
};
