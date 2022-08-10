import CommonFlow from '../CommonFlow';
import ApplyPortrait from '../ApplyPortrait';
import FlowWarning from '../FlowWarning';

import {
  PORTRAIT_FLOW_OPTION_MULTI,
  PORTRAIT_FLOW_OPTION_SINGLE
} from '@/common/constants';
import { useSheet } from '@/hooks';
import { cloneDeep, first, last } from 'lodash';
import {
  isEmpty,
  getSelectedDataOfFolders,
  getSelectedDataOfPages,
  getRangePortraitMultiFolder,
  getRangePortraitSingleFolder
} from '@/common/utils';

export default {
  components: {
    CommonFlow,
    ApplyPortrait,
    FlowWarning
  },
  props: {
    selectedFolders: {
      type: Array,
      default: () => []
    },
    container: {
      type: String
    },
    isLoadMapping: {
      type: Boolean,
      required: false
    }
  },
  setup() {
    const { currentSheet, getSheets } = useSheet();

    return { currentSheet, getSheets };
  },
  data() {
    return {
      flowSettings: {},
      requiredPages: [],
      isPreviewDisplayed: false,
      flowReviewCompKey: true,
      isWarningDisplayed: false,
      warningText: '',
      startPage: 1,
      isShowApplyPortrait: false,
      isPortrailSettingChange: false,
      isPortraitFlowDisplayed: false
    };
  },
  computed: {
    isMultiFolder() {
      return this.selectedFolders.length > 1;
    },
    maxPortraitPerPage() {
      if (isEmpty(this.flowSettings?.layoutSettings)) return;

      const { rowCount, colCount } = this.flowSettings.layoutSettings;

      return rowCount * colCount;
    },
    maxPageOption() {
      return Object.values(this.getSheets).length * 2 - 4;
    },
    previewPortraitsRange() {
      /*
      Return: 
        - Number of pages
        - Min - max indexes of particular page number
        - folderIndex
      Data struct: [{min, max, folderIdx},{...}]
      */
      if (isEmpty(this.flowSettings?.layoutSettings)) return [];

      const rows = this.flowSettings.layoutSettings.rowCount;
      const cols = this.flowSettings.layoutSettings.colCount;
      const folders = this.flowSettings.folders;

      if (this.isMultiFolder) {
        const { flowOption } = this.flowSettings.flowMultiSettings;
        const isContinuousFlow =
          flowOption === PORTRAIT_FLOW_OPTION_MULTI.CONTINUE.id;

        return getRangePortraitMultiFolder(
          this.maxPortraitPerPage,
          this.flowSettings.folders,
          isContinuousFlow
        );
      }

      return getRangePortraitSingleFolder(
        rows,
        cols,
        folders[0],
        this.flowSettings.teacherSettings
      );
    },
    initFlowOption() {
      return this.isMultiFolder
        ? PORTRAIT_FLOW_OPTION_MULTI.AUTO.id
        : PORTRAIT_FLOW_OPTION_SINGLE.AUTO.id;
    },
    isAcceptButtonDisabled() {
      return last(this.requiredPages) > this.maxPageOption;
    }
  },
  watch: {
    previewPortraitsRange(val, oldVal) {
      if (!val || !val.length || val?.length === oldVal?.length) return;

      if (this.isMultiFolder) {
        const { flowOption } = this.flowSettings.flowMultiSettings;
        const multiFolderPages = this.getMultiFolderDefaultPages(flowOption);
        this.flowSettings.flowMultiSettings.pages = multiFolderPages;
      }

      const pages = this.getSingleFolderDefaultPages();
      this.flowSettings.flowSingleSettings.pages = pages;
    },

    flowSettings: {
      deep: true,
      handler(newVal, oldVal) {
        const isSameLayout =
          JSON.stringify(newVal.layoutSettings) ===
          JSON.stringify(oldVal.layoutSettings);
        const isSameTeacher =
          JSON.stringify(newVal.teacherSettings) ===
          JSON.stringify(oldVal.teacherSettings);
        if (isSameLayout && isSameTeacher) return;
        this.isPortrailSettingChange = true;
      }
    },
    requiredPages: {
      deep: true,
      handler(newVal) {
        const overFlow = last(newVal) > this.maxPageOption;
        if (!overFlow || !this.isPortrailSettingChange) {
          this.isPortraitFlowDisplayed = true;
          return;
        }
        const folderNo = 1;
        const pageNo = first(newVal);
        const totalPages = newVal.length;
        if (this.isMultiFolder && this.isPortraitFlowDisplayed) {
          this.displayMultiFolderWarning(folderNo, pageNo);
          return;
        }
        this.displaySingleFolderWarning(totalPages, pageNo);
      }
    }
  },
  methods: {
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
      this.flowSettings = {};
    },
    /**
     * Emit accept event to parent
     */
    onApply() {
      if (!this.isShowApplyPortrait) {
        this.isPortraitFlowDisplayed = false;
        this.isShowApplyPortrait = true;
        return;
      }
      this.$emit('accept', this.flowSettings, this.requiredPages);
      this.onCancel();
    },
    /**
     * Cancel apply portrait
     */
    onCancelApplyPortrait() {
      this.isPortraitFlowDisplayed = true;
      this.isShowApplyPortrait = false;
    },
    /**
     * Set new start page
     *
     * @param {Number}  pageNo  selected page
     */
    onStartPageChange({ startNo }) {
      this.startPage = startNo;

      this.onPageSettingChange({ id: startNo, index: 0 });
    },
    /**
     * Update require pages
     */
    onRequirePageUpdate() {
      this.requiredPages = this.getRequiredPages();
    },
    /**
     * Get required pages
     *
     * @returns {Array} page list
     */
    getRequiredPages() {
      return this.isMultiFolder
        ? this.getMultiFolderRequiredPages()
        : this.getSingleFolderRequiredPages();
    },
    /**
     * Get required pages for single folder
     *
     * @returns {Array} page list
     */
    getSingleFolderRequiredPages() {
      return this.flowSettings.flowSingleSettings.pages;
    },
    /**
     * Get required pages for multi folder
     *
     * @returns {Array} page list
     */
    getMultiFolderRequiredPages() {
      if (isEmpty(this.flowSettings)) return;

      const { flowOption, pages } = this.flowSettings.flowMultiSettings;

      if (flowOption === PORTRAIT_FLOW_OPTION_MULTI.CONTINUE.id) {
        return pages;
      }

      const selectedData = getSelectedDataOfFolders(
        pages,
        this.flowSettings.startOnPageNumber,
        this.selectedFolders,
        this.maxPortraitPerPage
      );

      return selectedData.map(item => item.requiredPages).flat(1); //phan ga ra 2 cap
    },
    /**
     * To update flowSetting with data come from child componenet settings
     * @param {Object} setting data will be update to flowSetting
     */
    onSettingChange({ setting }) {
      this.flowSettings = { ...this.flowSettings, ...setting };
    },
    /**
     * Get start on page from current sheet
     */
    getStartOnPageNumber() {
      const { pageLeftName, pageRightName } = this.currentSheet;
      return parseInt(pageLeftName) || parseInt(pageRightName);
    },
    /**
     * Handle flow setting change
     * @param {Number} setting id selected flow
     */
    onFlowSettingChange({ setting }) {
      if (this.isMultiFolder) {
        this.onMultiFolderFlowChange(setting);
        return;
      }
      this.onSingleFolderFlowChange(setting);
    },
    /**
     * Handle single flow setting change
     * @param {Number} val id selected flow
     */
    onSingleFolderFlowChange(val) {
      const flowSingleSettings = {
        flowOption: val,
        pages: this.getSingleFolderDefaultPages(val)
      };

      this.onSettingChange({ setting: { flowSingleSettings } });
    },
    /**
     * Handle multi flow setting change
     * @param {Number} val id selected flow
     */
    onMultiFolderFlowChange(val) {
      const flowMultiSettings = {
        flowOption: val,
        pages: this.getMultiFolderDefaultPages(val)
      };

      this.onSettingChange({ setting: { flowMultiSettings } });
    },
    /**
     * Get multi default pages
     * @param {Number} id selected option
     * @returns {Array} default pages
     */
    getMultiFolderDefaultPages(id) {
      if (id === PORTRAIT_FLOW_OPTION_MULTI.CONTINUE.id) {
        return this.getSingleFolderDefaultPages();
      }
      const pages = this.getBasePages(this.selectedFolders.length, 1);
      return getSelectedDataOfFolders(
        pages,
        this.flowSettings.startOnPageNumber,
        this.selectedFolders,
        this.maxPortraitPerPage
      ).map(item => item.startOnPage);
    },
    /**
     * Get single default pages
     * @param {Number} id selected option
     * @returns {Array} default pages
     */
    getSingleFolderDefaultPages() {
      const totalPages = this.previewPortraitsRange.length;
      const { startOnPageNumber } = this.flowSettings;

      return this.getBasePages(totalPages, startOnPageNumber);
    },

    /**
     * Handle flow setting change
     * @param {String} id selected page
     * @param {Number} index index of page
     */
    onPageSettingChange({ id, index }) {
      if (this.isMultiFolder) {
        this.onMultiFolderPageChange(id, index);
        return;
      }
      this.onSingleFolderPageChange(id, index);
    },
    /**
     * Handle flow setting change
     * @param {String} id selected page
     * @param {Number} index index of page
     */
    onSingleFolderPageChange(id, index) {
      const flowSettings = cloneDeep(this.flowSettings.flowSingleSettings);
      const oldPage = flowSettings.pages[index];
      flowSettings.pages[index] = id;

      const startOnPageNumber = !index
        ? id
        : this.flowSettings.startOnPageNumber;

      if (flowSettings.flowOption === PORTRAIT_FLOW_OPTION_SINGLE.AUTO.id) {
        flowSettings.pages = this.getBasePages(flowSettings.pages.length, 1);
      }

      flowSettings.pages = getSelectedDataOfPages(
        flowSettings.pages,
        startOnPageNumber
      );
      const overFlow = last(flowSettings.pages) > this.maxPageOption;
      const increaseNumberOfPages = id > oldPage;
      if (!overFlow || !increaseNumberOfPages) {
        this.onSettingChange({
          setting: {
            flowSingleSettings: flowSettings,
            startOnPageNumber: flowSettings.pages[0]
          }
        });
        return;
      }

      this.onSettingChange({
        setting: {
          flowSingleSettings: this.flowSettings.flowSingleSettings,
          startOnPageNumber: this.flowSettings.startOnPageNumber
        }
      });
      this.displaySingleFolderWarning(flowSettings.pages.length, id);
    },
    /**
     * Handle flow setting change
     * @param {String} id selected page
     * @param {Number} index index of page
     */
    onMultiFolderPageChange(id, index) {
      const flowSettings = cloneDeep(this.flowSettings.flowMultiSettings);
      const oldPage = flowSettings.pages[index];
      flowSettings.pages[index] = id;
      const startOnPageNumber = !index
        ? id
        : this.flowSettings.startOnPageNumber;
      if (flowSettings.flowOption === PORTRAIT_FLOW_OPTION_MULTI.AUTO.id) {
        flowSettings.pages = this.getBasePages(flowSettings.pages.length, 1);
      }
      const selectedData = getSelectedDataOfFolders(
        flowSettings.pages,
        startOnPageNumber,
        this.selectedFolders,
        this.maxPortraitPerPage
      );

      flowSettings.pages = selectedData.map(item => {
        return item.startOnPage;
      });
      const overFlow = last(selectedData).endOnPage > this.maxPageOption;
      const increaseNumberOfPages = id > oldPage;
      if (!overFlow || !increaseNumberOfPages) {
        this.onSettingChange({
          setting: {
            flowMultiSettings: flowSettings,
            startOnPageNumber: flowSettings.pages[0]
          }
        });
        return;
      }
      this.onSettingChange({
        setting: {
          flowMultiSettings: this.flowSettings.flowMultiSettings,
          startOnPageNumber: this.flowSettings.startOnPageNumber
        }
      });
      this.displayMultiFolderWarning(index + 1, id);
    },
    /**
     * Open modal warning
     * @param {Number} folderNo folder
     * @param {Number} pageNo selected page
     */
    displayMultiFolderWarning(folderNo, pageNo) {
      this.warningText = `If you begin the portrait flow of folder ${folderNo} on page  ${pageNo}, 
                                      based on the current settings, 
                                      there won’t be enough pages available to flow your portraits. 
                                      If you click “Continue” you will need to reconfigure your settings or 
                                      select a different page to begin the portrait flow.`;

      this.isWarningDisplayed = true;
    },
    /**
     * Open modal warning
     * @param {Number} totalPages total page
     * @param {Number} pageNo index of folder
     */
    displaySingleFolderWarning(totalPages, pageNo) {
      this.warningText = `If you begin this portrait flow on page ${pageNo}, 
                                      based on the current settings, 
                                      there are not enough pages available to flow your portraits. 
                                      If you click “Continue” you will need to reconfigure your settings 
                                      so that the portrait flow takes no more than ${totalPages} pages.`;
      this.isWarningDisplayed = true;
    },
    /**
     * Close modal warning
     */
    onFlowWarningClose() {
      this.isPortraitFlowDisplayed = true;
      this.isPortrailSettingChange = false;
      this.isWarningDisplayed = false;
    },
    /**
     * Get base pages
     * @param {Number} total total pages
     * @param {Number} min min page number
     * @returns {Array} pages
     */
    getBasePages(total, min) {
      return Array.from({ length: total }, (_, index) => index + min);
    }
  },
  created() {
    this.startPage = this.getStartOnPageNumber();
  }
};
