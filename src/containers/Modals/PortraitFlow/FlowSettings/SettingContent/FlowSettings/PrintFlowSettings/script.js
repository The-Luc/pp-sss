import FlowSelect from '../FlowSelect';
import ItemSelect from '../ItemSelect';
import { useSheet } from '@/hooks';
import {
  PORTRAIT_FLOW_OPTION_SINGLE,
  PORTRAIT_FLOW_OPTION_MULTI
} from '@/common/constants';
import { getSelectedDataOfFolders, isEmpty } from '@/common/utils';
export default {
  components: {
    FlowSelect,
    ItemSelect
  },
  setup() {
    const { currentSheet, getSheets } = useSheet();
    return {
      currentSheet,
      getSheets
    };
  },
  data() {
    return {
      isOpenModalWarning: false,
      descriptModalWarning: ''
    };
  },
  props: {
    selectedFolders: {
      type: Array,
      required: true
    },
    flowSettings: {
      type: Object
    }
  },
  computed: {
    isMultiple() {
      return this.selectedFolders.length > 1;
    },
    portraitFlowOptionSingle() {
      return Object.values(PORTRAIT_FLOW_OPTION_SINGLE);
    },

    selectedFlowSingle() {
      return this.portraitFlowOptionSingle.find(
        item => item.id === this.flowSingleSettings.flowOption
      );
    },

    isShowSelectPageSingle() {
      return (
        !this.isMultiple &&
        this.selectedFlowSingle.id === PORTRAIT_FLOW_OPTION_SINGLE.MANUAL.id
      );
    },

    flowSingleSettings() {
      return this.flowSettings.flowSingleSettings;
    },

    dataSelectPageSingle() {
      return this.flowSingleSettings.pages.map(this.calculateDataSelectPage);
    },

    portraitFlowOptionMulti() {
      return Object.values(PORTRAIT_FLOW_OPTION_MULTI);
    },

    selectedFlowMulti() {
      return this.portraitFlowOptionMulti.find(
        item => item.id === this.flowMultiSettings.flowOption
      );
    },

    isShowSelectPageMulti() {
      return (
        this.isMultiple &&
        this.selectedFlowMulti.id === PORTRAIT_FLOW_OPTION_MULTI.MANUAL.id
      );
    },

    flowMultiSettings() {
      return this.flowSettings.flowMultiSettings;
    },

    dataSelectPageMulti() {
      const dataSelected = getSelectedDataOfFolders(
        this.flowMultiSettings.pages,
        this.flowSettings.startOnPageNumber,
        this.selectedFolders,
        this.maxPortraitPerPage
      );

      return dataSelected.map((item, index, arr) => {
        return {
          selectedVal: {
            id: item.startOnPage,
            name: item.startOnPage
          },
          selectedValEndOnPage: {
            id: item.endOnPage,
            name: item.endOnPage
          },
          pageOptions:
            index === 0
              ? this.getPageOptions(0, item.endOnPage)
              : this.getPageOptions(arr[index - 1].endOnPage, item.startOnPage),
          endOnPageOptions: [
            {
              id: item.endOnPage,
              name: item.endOnPage
            }
          ]
        };
      });
    },

    maxPortraitPerPage() {
      const totalRow = this.flowSettings.layoutSettings.rowCount;
      const totalCol = this.flowSettings.layoutSettings.colCount;
      return totalRow * totalCol;
    },

    pageOptions() {
      return Array.from({ length: this.maxPageOption }, (_, i) => i + 1).map(
        item => ({
          id: item,
          name: item
        })
      );
    },
    maxPageOption() {
      return Object.values(this.getSheets).length * 2 - 4;
    }
  },
  methods: {
    /**
     * Get options of select page
     * @param {Number} minValue min value
     * @returns {Array} page options
     */
    getPageOptions(minValue, value) {
      const options = this.pageOptions.filter(item => {
        return item.id > minValue;
      });
      return !isEmpty(options)
        ? options
        : [
            {
              id: value,
              name: value
            }
          ];
    },
    /**
     * Get start asset
     * @param {Number} index index of page
     * @returns {Number} start asset
     */
    getStartAsset(index) {
      return index * this.maxPortraitPerPage + 1;
    },
    /**
     * Get end asset
     * @param {Number} index index of page
     * @returns {Number} end asset
     */
    getEndAsset(index) {
      return (index + 1) * this.maxPortraitPerPage;
    },
    /**
     * calculate data select page
     * @param {Object} folder portrait folder
     * @param {Number} index index of folder
     * @param {Array} arr portrait folders
     * @returns {Object} data select page
     */
    calculateDataSelectPage(folder, index, arr) {
      return {
        startAsset: this.getStartAsset(index),
        endAsset:
          arr.length - 1 === index
            ? this.flowSettings.totalPortraitsCount
            : this.getEndAsset(index),
        selectedVal: {
          id: folder,
          name: folder
        },
        pageOptions:
          index === 0
            ? this.getPageOptions(0, folder)
            : this.getPageOptions(arr[index - 1], folder)
      };
    },
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val configuration changed
     */
    onFlowSettingChange(val) {
      this.$emit('flowSettingChange', val.id);
    },
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val value of selected page
     * @param {Object} index index of folder
     */
    onPageSettingChange(val, index) {
      this.$emit('pageSettingChange', {
        id: val.id,
        index
      });
    }
  }
};
