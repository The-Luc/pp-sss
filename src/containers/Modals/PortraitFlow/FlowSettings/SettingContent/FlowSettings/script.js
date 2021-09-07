import FlowSelect from './FlowSelect';
import PpSelect from '@/components/Selectors/Select';
import ItemSelect from './ItemSelect';
import { useSheet } from '@/hooks';
import {
  PORTRAIT_FLOW_OPTION_SINGLE,
  PORTRAIT_FLOW_OPTION_MULTI
} from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    FlowSelect,
    PpSelect,
    ItemSelect
  },
  setup() {
    const { currentSheet, getSheets } = useSheet();
    return {
      currentSheet,
      getSheets
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
      return this.getDataFolders(this.flowMultiSettings.pages).map(
        (item, index, arr) => {
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
                ? this.pageOptions
                : this.getPageOptions(arr[index - 1].endOnPage)
          };
        }
      );
    },

    maxPortraitPerPage() {
      const totalRow = this.flowSettings.layoutSettings.rowCount;
      const totalCol = this.flowSettings.layoutSettings.colCount;
      return totalRow * totalCol;
    },

    pageOptions() {
      const totalSheet = Object.values(this.getSheets).length * 2 - 4;
      return Array.from({ length: totalSheet }, (_, i) => i + 1).map(item => ({
        id: item,
        name: item
      }));
    }
  },
  methods: {
    /**
     * Handle change flow option
     * @param {Object} val Id of section
     */
    onChange(val) {
      const flowSettings = {
        flowOption: val.id,
        pages: this.isMultiple
          ? this.getMultiRequiredPages(val.id)
          : this.getSingleRequiredPages()
      };
      if (this.isMultiple) {
        this.onChangeFlow({ flowMultiSettings: flowSettings });
        return;
      }
      this.onChangeFlow({ flowSingleSettings: flowSettings });
    },
    /**
     * Get single required pages
     * @returns {Array} required pages
     */
    getSingleRequiredPages() {
      const { totalPortraitsCount, startOnPageNumber } = this.flowSettings;

      return this.getFolderPages(totalPortraitsCount, startOnPageNumber);
    },
    /**
     * Get multi required pages
     * @param {Number} id selected option
     * @returns {Boolean} required pages
     */
    getMultiRequiredPages(id) {
      if (id === PORTRAIT_FLOW_OPTION_MULTI.CONTINUE.id) {
        return this.getSingleRequiredPages();
      }
      const pages = [...Array(this.selectedFolders.length).keys()].map(
        p => p + 1
      );
      return this.getDataFolders(pages).map(item => {
        return item.startOnPage;
      });
    },
    /**
     * Emit change event to parent component
     * @param {Object} val flow setting
     */
    onChangeFlow(val) {
      this.$emit('flowSettingChange', val);
    },
    /**
     * Handle change page option
     * @param {Object} val selected page
     * @param {Number} index index of page
     */
    onChangePageSingle(val, index) {
      const flowSettings = {
        ...this.flowSingleSettings
      };
      flowSettings.pages[index] = val.id;
      this.onChangeFlow({ flowSingleSettings: flowSettings });
    },
    /**
     * Handle change page option
     * @param {Object} val selected page
     * @param {Number} index index of page
     */
    onChangePageMulti(val, index) {
      const flowSettings = {
        ...this.flowMultiSettings
      };
      flowSettings.pages[index] = val.id;

      this.onChangeFlow({ flowMultiSettings: flowSettings });
    },
    /**
     * Get options of select page
     * @param {Number} minValue min value
     * @returns {Array} page options
     */
    getPageOptions(minValue) {
      return this.pageOptions.filter(item => {
        return item.id > minValue;
      });
    },
    /**
     * Get page of folder
     * @param {Number} totalPortraitsCount total portraits count
     * @param {Number} startOnPageNumber start on page number
     * @returns {Array} list pages
     */
    getFolderPages(totalPortraitsCount, startOnPageNumber) {
      const totalPage = Math.ceil(
        totalPortraitsCount / this.maxPortraitPerPage
      );

      return [...Array(totalPage).keys()].map(p => {
        return p + startOnPageNumber;
      });
    },
    /**
     * Get data folders
     * @param {Array} pages list start pages
     * @returns {Array} data folders
     */
    getDataFolders(pages) {
      const { startOnPageNumber } = this.flowSettings;

      const dataFolders = [];

      this.selectedFolders.forEach((element, index) => {
        const start =
          [...dataFolders].pop()?.endOnPage + 1 || startOnPageNumber;
        const totalPages = element.assetsCount / this.maxPortraitPerPage;

        const startOnPage = Math.max(start, pages[index]);
        const endOnPage = startOnPage + Math.ceil(totalPages);

        dataFolders.push({ startOnPage, endOnPage });
      });
      return dataFolders;
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
          index === 0 ? this.pageOptions : this.getPageOptions(arr[index - 1])
      };
    }
  },
  created() {
    if (isEmpty(this.flowSingleSettings.pages)) {
      this.onChange({ id: this.selectedFlowSingle.id });
    }
    if (isEmpty(this.flowMultiSettings.pages)) {
      this.onChange({ id: this.selectedFlowMulti.id });
    }
  }
};
