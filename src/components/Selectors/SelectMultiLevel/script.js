import SelectSubLevel from './SelectSubLevel';

import { cloneDeep } from 'lodash';

import { ICON_LOCAL } from '@/common/constants';

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
      default: () => ({ name: '', id: '' })
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisplayCustomSelected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectedSub() {
      const itemSendToSub = cloneDeep(this.selectedVal);

      delete itemSendToSub.sub;

      return {
        ...this.selectedVal.sub,
        parentValue: itemSendToSub
      };
    }
  },
  methods: {
    /**
     * Get option select after change and emit
     *
     * @param  {Object} option option selected
     */
    onChange(data) {
      const elementDataId = this.getDataIdByItem(data.parent);

      const useElement = document.querySelector(`[data-id="${elementDataId}"]`);

      useElement.click();

      this.$emit('change', { item: { ...data.parent }, sub: data.sub });
    },
    /**
     * Get sub items for sub menu
     *
     * @param   {Object}  item  current item
     * @returns {Object}        sub item
     */
    getSubs(item) {
      const itemSendToSub = cloneDeep(item);

      delete itemSendToSub.subItems;

      return {
        parentValue: itemSendToSub,
        items: item.subItems
      };
    },
    /**
     * Event fire when click on item, for stopping close the selector
     *
     * @param {Object}  ev  the event
     */
    onItemClick(ev) {
      ev.stopPropagation();
    },
    /**
     * Get data id of the item
     *
     * @param   {Object}  item  current item
     * @returns {String}        the data id
     */
    getDataIdByItem(item) {
      return `select-multi-${item.value}`;
    }
  }
};
