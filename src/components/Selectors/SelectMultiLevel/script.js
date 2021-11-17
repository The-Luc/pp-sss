import SelectSubLevel from './SelectSubLevel';

import { ICON_LOCAL } from '@/common/constants';
import { getRefElement, isEmpty } from '@/common/utils';

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
  data() {
    return {
      isOverSub: false
    };
  },
  computed: {
    selectedValue() {
      const item = this.items.find(
        ({ value }) => value === this.selectedVal.value
      );

      if (isEmpty(item)) return { value: '', sub: '' };

      const sub = this.getSubRecursion(this.selectedVal, item.subItems);
      return {
        ...item,
        sub: isEmpty(sub) ? { name: '' } : sub
      };
    },
    displaySelected() {
      const displaySubName = this.getDisplaySubName(this.selectedValue);

      const displaySub = isEmpty(displaySubName) ? '' : `: ${displaySubName}`;

      return `${this.selectedValue.name}${displaySub}`;
    }
  },
  watch: {
    displaySelected: {
      deep: true,
      handler(val) {
        this.$emit('changeDisplaySelected', val);
      }
    }
  },
  methods: {
    /**
     * Get display sub name
     * @param   {Object}  selectedValue  current value
     * @returns {String}  display sub name
     */
    getDisplaySubName(selectedValue) {
      const subName = this.isUseSubShortName
        ? selectedValue.sub?.shortName
        : selectedValue.sub?.name;

      if (!selectedValue.sub?.sub) {
        return isEmpty(subName) ? '' : `${subName}`;
      }

      return isEmpty(subName)
        ? ''
        : `${subName}: ${this.getDisplaySubName(selectedValue.sub)}`;
    },
    /**
     * Get sub value of selected item
     *
     * @param   {Object}  selectedVal  current item
     * @param   {Array}  items  sub items
     * @returns {Object} sub value
     */
    getSubRecursion(selectedVal, items) {
      const selectedValue =
        typeof selectedVal.sub === 'object'
          ? selectedVal.sub.value
          : selectedVal.sub;

      const sub = items.find(({ value }) => value === selectedValue);

      if (isEmpty(sub?.subItems)) return sub;

      return {
        ...sub,
        sub: this.getSubRecursion(selectedVal.sub, sub.subItems)
      };
    },
    /**
     * Get option select after change and emit
     *
     * @param  {Object} option option selected
     */
    onChange(data) {
      const elementDataId = this.getDataIdByValue({ value: data.value });

      const element = getRefElement(this.$refs, elementDataId);

      if (!isEmpty(element)) element.click();

      this.$emit('change', { value: data.value, sub: data.sub });
    },
    /**
     * Event fire when click on item, stop default click if contain subitem
     * or emit change event to parent
     *
     * @param {Object}          event         the event
     * @param {Array}           subItems      sub items of selected item
     * @param {String | Number} itemValue     value of selected item
     */
    onItemClick(event, subItems, itemValue) {
      if (!isEmpty(subItems)) {
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
    /**
     * Get sub value of selected item
     *
     * @param   {Object}  item  current item
     * @returns {String}        sub value
     */
    getSelectedSub(item) {
      return item.value === this.selectedVal.value ? this.selectedVal.sub : '';
    },
    /**
     * Check submenu is existed
     *
     * @returns {Boolean} is existed
     */
    isSubmenuExisted(item) {
      return !isEmpty(item.subItems);
    },
    getSubmenuPosition(item) {
      const elementDataId = this.getDataIdByValue(item);

      const element = getRefElement(this.$refs, elementDataId);

      if (isEmpty(element)) return { x: 0, y: 0 };

      const { x, y, width } = element.getBoundingClientRect();

      const margin = -3;

      return { x: x + width + margin, y };
    }
  }
};
