import ToolButton from '@/components/Buttons/ToolButton';

import { useToolBar } from '@/hooks';

import { isToolActivated } from '@/common/utils';

export default {
  components: {
    ToolButton
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    selectedToolName: {
      type: String
    },
    isMenuOpen: {
      type: Boolean,
      default: false
    },
    propertiesType: {
      type: String
    },
    isPrompt: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { disabledToolbarItems } = useToolBar();

    return { disabledToolbarItems };
  },
  computed: {
    /**
     * Check whether icon tool active or not
     * @param  {String} iconName The name of icon be clicked
     * @return {Boolean}  Active current icon clicked and inactive icon before
     */
    isActive() {
      return iconName => {
        return isToolActivated(
          iconName,
          this.propertiesType,
          this.isMenuOpen,
          this.selectedToolName
        );
      };
    }
  },
  methods: {
    /**
     * Emit event click when click on icon
     * @param  {object} item Icon's object selected
     */
    onClick(item) {
      this.$emit('click', item);
    },
    /**
     * Check if item is disabled
     *
     * @param   {String}  name  name of item
     * @returns {Boolean}       item is disabled
     */
    isDisabledItem({ name }) {
      return this.disabledToolbarItems.includes(name);
    }
  }
};
