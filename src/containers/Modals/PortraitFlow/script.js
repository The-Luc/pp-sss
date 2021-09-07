import CommonModal from '../CommonModal';
import FlowSettings from './FlowSettings';
import FlowPreview from './FlowPreview';

import { PortraitFlowData } from '@/common/models';

import {
  PORTRAIT_FLOW_OPTION_SINGLE,
  PORTRAIT_FLOW_OPTION_MULTI
} from '@/common/constants';

export default {
  components: {
    CommonModal,
    FlowSettings,
    FlowPreview
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
  data() {
    return {
      flowSettings: {},
      requiredPages: [],
      isPreviewDisplayed: false,
      flowReviewCompKey: true
    };
  },
  created() {
    this.flowSettings = new PortraitFlowData({
      startOnPageNumber: 1, // TODO: get from current sheet (implement in another ticket)
      totalPortraitsCount: this.getTotalPortrait(),
      folders: this.selectedFolders
    });

    this.requiredPages = this.getRequiredPages();
  },
  computed: {
    title() {
      return this.isPreviewDisplayed ? 'Portrait Flow Review' : 'Portrait Flow';
    }
  },
  watch: {
    flowSettings: {
      deep: true,
      handler() {
        this.requiredPages = this.getRequiredPages();
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
      this.$emit('accept');
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
      this.flowSettings.startOnPageNumber = pageNo;

      this.requiredPages = this.getRequiredPages();
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

      if (this.selectedFolders.length === 1) {
        return this.getSingleFolderRequiredPages(maxPortraitPerPage);
      }

      return this.getMultiFolderRequiredPages(maxPortraitPerPage);
    },
    /**
     * Get required pages for single folder
     *
     * @param   {Number}  maxPortraitPerPage  max portrait per page
     * @returns {Array}                       page list
     */
    getSingleFolderRequiredPages(maxPortraitPerPage) {
      if (
        this.flowSettings.flowSingleSettings.flowOption ===
        PORTRAIT_FLOW_OPTION_SINGLE.MANUAL.id
      ) {
        return this.flowSettings.flowSingleSettings.pages;
      }

      const totalPage = Math.ceil(
        this.flowSettings.totalPortraitsCount / maxPortraitPerPage
      );

      return [...Array(totalPage).keys()].map(p => {
        return p + this.flowSettings.startOnPageNumber;
      });
    },
    /**
     * Get required pages for multi folder
     *
     * @param   {Number}  maxPortraitPerPage  max portrait per page
     * @returns {Array}                       page list
     */
    getMultiFolderRequiredPages(maxPortraitPerPage) {
      const flowOption = this.flowSettings.flowSingleSettings.flowOption;
      let totalPages = 0;

      if (flowOption === PORTRAIT_FLOW_OPTION_MULTI.CONTINUE.id) {
        totalPages = Math.ceil(
          this.flowSettings.totalPortraitsCount / maxPortraitPerPage
        );
      }
      if (flowOption === PORTRAIT_FLOW_OPTION_MULTI.AUTO.id) {
        totalPages = this.selectedFolders.reduce((total, folder) => {
          return total + Math.ceil(folder.assetsCount / maxPortraitPerPage);
        }, 0);
      }

      return [...Array(totalPages).keys()].map(p => {
        return p + this.flowSettings.startOnPageNumber;
      });
    },
    /**
     * To update flowSetting with data come from child componenet settings
     * @param {Object} val data will be update to flowSetting
     */
    onSettingChange(val) {
      this.flowSettings = { ...this.flowSettings, ...val };
    }
  }
};
