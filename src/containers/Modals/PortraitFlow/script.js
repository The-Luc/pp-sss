import CommonModal from '../CommonModal';
import FlowSettings from './FlowSettings';
import FlowPreview from './FlowPreview';
import FlowWarning from '@/components/Modals/FlowWarning';
import { PortraitFlowData } from '@/common/models';

import {
  DEFAULT_PAGE_TITLE,
  DEFAULT_NAME_TEXT,
  DEFAULT_MARGIN_PAGE_TITLE,
  PORTRAIT_FLOW_OPTION_MULTI,
  PORTRAIT_FLOW_OPTION_SINGLE,
  PORTRAIT_TEACHER_PLACEMENT
} from '@/common/constants';
import { useSheet } from '@/hooks';
import { cloneDeep } from 'lodash';
import {
  getSelectedDataOfFolders,
  getPagesOfFolder,
  getSelectedDataOfPages,
  calcAdditionPortraitSlot,
  getTotalPagesForLastPlacement
} from '@/common/utils';

export default {
  components: {
    CommonModal,
    FlowSettings,
    FlowPreview,
    FlowWarning
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    selectedFolders: {
      type: Array,
      default: () => []
    },
    container: {
      type: String
    }
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
      flowSettings: {},
      requiredPages: [],
      isPreviewDisplayed: false,
      flowReviewCompKey: true,
      flowWarning: false,
      flowWarningDescript: ''
    };
  },
  created() {
    this.flowSettings = new PortraitFlowData({
      startOnPageNumber: this.getStartOnPageNumber(),
      totalPortraitsCount: this.getTotalPortrait(),
      folders: this.selectedFolders
    });

    this.flowSettings.textSettings = this.initDataTextSettings();
    this.initDataFlowSettings();
    this.requiredPages = this.getRequiredPages();
  },
  computed: {
    title() {
      return this.isPreviewDisplayed ? 'Portrait Flow Review' : 'Portrait Flow';
    },
    isMultiFolder() {
      return this.selectedFolders.length > 1;
    },
    maxPortraitPerPage() {
      const totalRow = this.flowSettings.layoutSettings.rowCount;
      const totalCol = this.flowSettings.layoutSettings.colCount;

      return totalRow * totalCol;
    },
    maxPageOption() {
      return Object.values(this.getSheets).length * 2 - 4;
    }
  },
  watch: {
    flowSettings: {
      deep: true,
      handler(newVal, oldVal) {
        this.requiredPages = this.getRequiredPages();
        if (
          JSON.stringify(newVal.layoutSettings) ===
            JSON.stringify(oldVal.layoutSettings) &&
          JSON.stringify(newVal.teacherSettings) ===
            JSON.stringify(oldVal.teacherSettings)
        )
          return;
        this.initDataFlowSettings();
      }
    }
  },
  methods: {
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Emit accept event to parent
     */
    onAccept() {
      this.$emit('accept', this.flowSettings);
    },
    /**
     * Emit back event
     */
    onBack() {
      this.isPreviewDisplayed = false;
    },
    /**
     * Set new start page
     *
     * @param {Number}  pageNo  selected page
     */
    onStartPageChange({ pageNo }) {
      this.onPageSettingChange({ id: pageNo, index: 0 });
    },
    /**
     * Show preview
     */
    onShowPreview() {
      this.flowReviewCompKey = !this.flowReviewCompKey;

      this.isPreviewDisplayed = true;
    },
    /**
     * Save settings
     */
    onSaveSettings() {
      console.log('save settings');
    },
    /**
     * Get total asset in selected folders
     *
     * @returns {Number}  total asset
     */
    getTotalPortrait() {
      if (this.selectedFolders.length === 1) {
        return this.selectedFolders[0].assets.length;
      }

      const sum = this.selectedFolders.reduce((accumulator, currentValue) => {
        const total = accumulator.assets.length + currentValue.assets.length;

        return { assets: { length: total } };
      });

      return sum.assets.length;
    },
    /**
     * Get required pages
     *
     * @returns {Array} page list
     */
    getRequiredPages() {
      const totalRow = this.flowSettings.layoutSettings.rowCount;
      const totalCol = this.flowSettings.layoutSettings.colCount;

      const maxPortraitPerPage = totalRow * totalCol;

      if (!this.isMultiFolder) {
        return this.getSingleFolderRequiredPages();
      }
      return this.getMultiFolderRequiredPages(maxPortraitPerPage);
    },
    /**
     * Get required pages for single folder
     *
     * @returns {Array}                       page list
     */
    getSingleFolderRequiredPages() {
      return this.flowSettings.flowSingleSettings.pages;
    },
    /**
     * Get required pages for multi folder
     *
     * @returns {Array}                       page list
     */
    getMultiFolderRequiredPages() {
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
     * @param {Object} val data will be update to flowSetting
     */
    onSettingChange(val) {
      this.flowSettings = { ...this.flowSettings, ...val };
    },
    /**
     * To create initial data for text settings
     */
    initDataTextSettings() {
      return {
        ...this.flowSettings.textSettings,
        pageTitleFontSettings: DEFAULT_PAGE_TITLE,
        nameTextFontSettings: DEFAULT_NAME_TEXT,
        pageTitleMargins: DEFAULT_MARGIN_PAGE_TITLE
      };
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
     * @param {Number} val id selected flow
     */
    onFlowSettingChange(val) {
      if (this.isMultiFolder) {
        this.onMultiFolderFlowChange(val);
        return;
      }
      this.onSingleFolderFlowChange(val);
    },
    /**
     * Handle single flow setting change
     * @param {Number} val id selected flow
     */
    onSingleFolderFlowChange(val) {
      const flowSettings = {
        flowOption: val,
        pages: this.getSingleFolderDefaultPages(val)
      };

      this.onSettingChange({
        flowSingleSettings: flowSettings
      });
    },
    /**
     * Handle multi flow setting change
     * @param {Number} val id selected flow
     */
    onMultiFolderFlowChange(val) {
      const flowSettings = {
        flowOption: val,
        pages: this.getMultiFolderDefaultPages(val)
      };

      this.onSettingChange({
        flowMultiSettings: flowSettings
      });
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
      const pages = [...Array(this.selectedFolders.length).keys()].map(
        p => p + 1
      );
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
      const { totalPortraitsCount, startOnPageNumber } = this.flowSettings;
      const teacherPlacement = this.flowSettings.teacherSettings
        .teacherPlacement;

      const extraSlots = calcAdditionPortraitSlot(
        this.flowSettings.teacherSettings,
        this.selectedFolders[0]
      );

      if (
        teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.FIRST ||
        extraSlots === 0
      ) {
        const totalPage = Math.ceil(totalPortraitsCount + extraSlots);
        return getPagesOfFolder(
          totalPage,
          startOnPageNumber,
          this.maxPortraitPerPage
        );
      }

      const rows = this.flowSettings.layoutSettings.rowCount;

      const totalPage = getTotalPagesForLastPlacement(
        rows,
        totalPortraitsCount,
        extraSlots,
        this.maxPortraitPerPage
      );

      return [...Array(totalPage).keys()].map(p => {
        return p + startOnPageNumber;
      });
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
      flowSettings.pages[index] = id;

      const startOnPageNumber = !index
        ? id
        : this.flowSettings.startOnPageNumber;

      if (flowSettings.flowOption === PORTRAIT_FLOW_OPTION_SINGLE.AUTO.id) {
        flowSettings.pages = [...Array(flowSettings.pages.length).keys()].map(
          p => p + 1
        );
      }

      flowSettings.pages = getSelectedDataOfPages(
        flowSettings.pages,
        startOnPageNumber
      );

      if (
        flowSettings.pages[flowSettings.pages.length - 1] <= this.maxPageOption
      ) {
        this.onSettingChange({
          flowSingleSettings: flowSettings,
          startOnPageNumber: flowSettings.pages[0]
        });
        return;
      }

      this.onSettingChange({
        flowSingleSettings: this.flowSettings.flowSingleSettings,
        startOnPageNumber: this.flowSettings.startOnPageNumber
      });
      this.onSingleFolderFlowWarningOpen(flowSettings.pages.length, id);
    },
    /**
     * Handle flow setting change
     * @param {String} id selected page
     * @param {Number} index index of page
     */
    onMultiFolderPageChange(id, index) {
      const flowSettings = cloneDeep(this.flowSettings.flowMultiSettings);
      flowSettings.pages[index] = id;
      const startOnPageNumber = !index
        ? id
        : this.flowSettings.startOnPageNumber;
      if (flowSettings.flowOption === PORTRAIT_FLOW_OPTION_MULTI.AUTO.id) {
        flowSettings.pages = [...Array(flowSettings.pages.length).keys()].map(
          p => p + 1
        );
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
      if (
        selectedData[selectedData.length - 1].endOnPage <= this.maxPageOption
      ) {
        this.onSettingChange({
          flowMultiSettings: flowSettings,
          startOnPageNumber: flowSettings.pages[0]
        });
        return;
      }
      this.onSettingChange({
        flowMultiSettings: this.flowSettings.flowMultiSettings,
        startOnPageNumber: this.flowSettings.startOnPageNumber
      });
      this.onMultiFolderFlowWarning(index + 1, id);
    },
    /**
     * Open modal warning
     * @param {Number} folderNo folder
     * @param {Number} pageNo selected page
     */
    onMultiFolderFlowWarning(folderNo, pageNo) {
      this.flowWarningDescript = `If you begin the portrait flow of folder ${folderNo} on page  ${pageNo}, 
                                      based on the current settings, 
                                      there won’t be enough pages available to flow your portraits. 
                                      If you click “Continue” you will need to reconfigure your settings or 
                                      select a different page to begin the portrait flow.`;
      this.flowWarning = true;
    },
    /**
     * Open modal warning
     * @param {Number} totalPage total page
     * @param {Number} pageNo index of folder
     */
    onSingleFolderFlowWarningOpen(totalPage, pageNo) {
      this.flowWarningDescript = `If you begin this portrait flow on page ${pageNo}, 
                                      based on the current settings, 
                                      there are not enough pages available to flow your portraits. 
                                      If you click “Continue” you will need to reconfigure your settings 
                                      so that the portrait flow takes no more than ${totalPage} pages.`;
      this.flowWarning = true;
    },
    /**
     * Close modal warning
     */
    onFlowWarningClose() {
      this.flowWarning = false;
    },
    initDataFlowSettings() {
      const flowOption = this.isMultiFolder
        ? PORTRAIT_FLOW_OPTION_MULTI.AUTO.id
        : PORTRAIT_FLOW_OPTION_SINGLE.AUTO.id;
      this.onFlowSettingChange(flowOption);
    }
  }
};
