import SelectSubLevel from './SelectSubLevel';

import { ICON_LOCAL } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    SelectSubLevel
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    prependedIcon: {
      type: String,
      default: ''
    },
    appendedIcon: {
      type: String,
      default: ICON_LOCAL.ARROW_SELECT
    },
    activeMenuIcon: {
      type: String,
      default: ICON_LOCAL.ACTIVE_MENU
    },
    selectedVal: {
      type: Object,
      default: () => ({ value: '', sub: '' })
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisplayCustomSelected: {
      type: Boolean,
      default: false
    },
    container: {
      type: String
    },
    isUseSubShortName: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectedValue() {
      const item = this.items.find(
        ({ value }) => value === this.selectedVal.value
      );

      if (isEmpty(item)) return { value: '', sub: '' };

      const sub = item.subItems.find(
        ({ value }) => value === this.selectedVal.sub
      );

      return {
        ...item,
        sub: isEmpty(sub) ? { name: '' } : sub
      };
    },
    displaySelected() {
      const subName = this.isUseSubShortName
        ? this.selectedValue.sub?.shortName
        : this.selectedValue.sub?.name;

      const displaySubName = isEmpty(subName) ? '' : `: ${subName}`;

      return `${this.selectedValue.name}${displaySubName}`;
    }
  },
  methods: {
    /**
     * Get option select after change and emit
     *
     * @param  {Object} option option selected
     */
    onChange(data) {
      const elementDataId = this.getDataIdByValue({ value: data.parent });

      this.$refs[`${elementDataId}`].$el.click();

      this.$emit('change', { value: data.parent, sub: data.sub });
    },
    /**
     * Event fire when click on item, for stopping close the selector
     *
     * @param {Object}  event  the event
     */
    onItemClick(event, totalSubItem, itemValue) {
      if (totalSubItem > 0) {
        event.stopPropagation();

        return;
      }

      this.$emit('change', { value: itemValue, sub: '' });
    },
    /**
     * Get data id of the item
     *
     * @param   {Object}  item  current item
     * @returns {String}        the data id
     */
    getDataIdByValue({ value }) {
      return `select-multi-${value}`;
    },
    getSelectedSub(item) {
      return item.value === this.selectedVal.value ? this.selectedVal.sub : '';
    }
  }
};
