import CommonFlow from '../CommonFlow';
import ApplyPortrait from '../ApplyPortrait';

import {
  DIGITAL_PORTRAIT_FLOW_OPTION_SINGLE,
  DIGITAL_PORTRAIT_FLOW_OPTION_MULTI,
  DEFAULT_DIGITAL_PORTRAIT,
  DEFAULT_MARGIN
} from '@/common/constants';
import { useFrame, useSheet, useGetterEditionSection } from '@/hooks';
import { cloneDeep } from 'lodash';
import {
  isEmpty,
  getSelectedDataOfFolders,
  getSelectedDataOfPages,
  getRangePortraitMultiFolder,
  getRangePortraitSingleFolder,
  getDataScreenOfMultiFolder
} from '@/common/utils';

export default {
  components: {
    CommonFlow,
    ApplyPortrait
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
    const { currentFrameId, frameIds } = useFrame();
    const { currentSection } = useGetterEditionSection();
    return {
      currentSheet,
      getSheets,
      currentFrameId,
      frameIds,
      currentSection
    };
  },
  data() {
    const initialLayoutSetting = {
      rowCount: DEFAULT_DIGITAL_PORTRAIT.ROW_COUNT,
      colCount: DEFAULT_DIGITAL_PORTRAIT.COLUMN_COUNT,
      margins: {
        bottom: DEFAULT_MARGIN.DIGITAL_BOTTOM
      }
    };

    return {
      flowSettings: {},
      requiredFrames: [],
      isPreviewDisplayed: false,
      flowReviewCompKey: true,
      isWarningDisplayed: false,
      warningText: '',
      startPage: 1,
      initialLayoutSetting,
      isShowApplyPortrait: false,
      isPortraitFlowDisplayed: true
    };
  },
  computed: {
    isMultiFolder() {
      return this.selectedFolders.length > 1;
    },
    maxPortraitPerPage() {
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
        return getRangePortraitMultiFolder(
          this.maxPortraitPerPage,
          this.flowSettings.folders,
          false
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
        ? DIGITAL_PORTRAIT_FLOW_OPTION_MULTI.AUTO_NEXT_FRAME.id
        : DIGITAL_PORTRAIT_FLOW_OPTION_SINGLE.AUTO_NEXT_FRAME.id;
    }
  },
  watch: {
    previewPortraitsRange(val, oldVal) {
      if (!val || !val.length || val?.length === oldVal?.length) return;

      if (this.isMultiFolder) {
        const { flowOption } = this.flowSettings.flowMultiSettings;
        const multiFolderScreen = this.getMultiFolderDefaultFrames(flowOption);
        this.flowSettings.flowMultiSettings.screen = multiFolderScreen;
      }

      const screen = this.getSingleFolderDefaultFrames();
      this.flowSettings.flowSingleSettings.screen = screen;
    },
    isOpen(val) {
      if (!val) return;
      this.startPage = this.getStartOnPageNumber();
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
      this.$emit('accept', this.flowSettings, this.requiredFrames);
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
     * Set new start frame
     *
     * @param {Number}  startNo  selected frame
     */
    onStartChange({ startNo }) {
      this.startPage = startNo;

      this.onFrameSettingChange({
        id: startNo,
        frameIndex: 0,
        screen: parseInt(this.currentSheet.pageName)
      });
    },
    /**
     * Save settings
     */
    onSaveSettings() {
      console.log('save settings');
    },
    /**
     * Update require frames
     */
    onRequireFrameUpdate() {
      this.requiredFrames = this.getRequiredFrames();
    },
    /**
     * Get required frames
     *
     * @returns {Array} frame list
     */
    getRequiredFrames() {
      return this.isMultiFolder
        ? this.getMultiFolderRequiredFrames()
        : this.getSingleFolderRequiredFrames();
    },
    /**
     * Get required frames for single folder
     *
     * @returns {Array} frame list
     */
    getSingleFolderRequiredFrames() {
      const screenNo = parseInt(this.currentSheet.pageName);
      return this.flowSettings.flowSingleSettings.screen[screenNo]?.map(
        item => {
          return {
            frame: item,
            screen: screenNo
          };
        }
      );
    },
    /**
     * Get required frames for multi folder
     *
     * @returns {Array} frame list
     */
    getMultiFolderRequiredFrames() {
      const dataScreen = getDataScreenOfMultiFolder(
        this.flowSettings.flowMultiSettings.screen,
        this.selectedFolders,
        this.maxPortraitPerPage
      );
      const requiredFrames = [];
      dataScreen.forEach(item => {
        item.frames.forEach(el => {
          el.requiredPages.forEach(frame => {
            requiredFrames.push({
              frame,
              screen: item.screen
            });
          });
        });
      });
      return requiredFrames;
    },
    /**
     * To update flowSetting with data come from child componenet settings
     * @param {Object} setting data will be update to flowSetting
     */
    onSettingChange({ setting }) {
      this.flowSettings = { ...this.flowSettings, ...setting };
    },
    /**
     * Get start on frame from current screen
     */
    getStartOnPageNumber() {
      return this.frameIds.findIndex(item => item === this.currentFrameId) + 1;
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
        screen: this.getSingleFolderDefaultFrames(val)
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
        screen: this.getMultiFolderDefaultFrames(val)
      };

      this.onSettingChange({ setting: { flowMultiSettings } });
    },
    /**
     * Get multi default frames
     * @param {Number} id selected option
     * @returns {Array} default frames
     */
    getMultiFolderDefaultFrames(id) {
      const { startOnPageNumber } = this.flowSettings;
      const startScreenNo = parseInt(this.currentSheet.pageName);
      if (id !== DIGITAL_PORTRAIT_FLOW_OPTION_MULTI.AUTO_NEXT_SCREEN.id) {
        const frames = this.getBaseFrames(this.selectedFolders.length, 1);
        return {
          [startScreenNo]: getSelectedDataOfFolders(
            frames,
            startOnPageNumber,
            this.selectedFolders,
            this.maxPortraitPerPage
          ).map(item => item.startOnPage)
        };
      }

      const screen = {};
      this.selectedFolders.forEach((item, index) => {
        const screenNo = startScreenNo + index;
        const startNo = !index ? startOnPageNumber : 1;
        const frames = [startNo];
        screen[screenNo] = getSelectedDataOfFolders(
          frames,
          startNo,
          [item],
          this.maxPortraitPerPage
        ).map(el => el.startOnPage);
      });
      return screen;
    },
    /**
     * Get multi default frames
     * @param {Number} id selected option
     * @returns {Array} default frames
     */
    getSingleFolderDefaultFrames() {
      const totalPage = this.previewPortraitsRange.length;
      const screenNo = parseInt(this.currentSheet.pageName);
      const { startOnPageNumber } = this.flowSettings;
      return {
        [screenNo]: this.getBaseFrames(totalPage, startOnPageNumber)
      };
    },
    /**
     * Handle flow setting change
     * @param {Number} val value of selected frame
     * @param {Number} index index of frame in screen
     * @param {Number} screen id of screen
     */
    onFrameSettingChange({ id, frameIndex, screen }) {
      if (this.isMultiFolder) {
        this.onMultiFolderPageChange(id, frameIndex, screen);
        return;
      }
      this.onSingleFolderPageChange(id, frameIndex, screen);
    },
    /**
     * Handle flow setting change
     * @param {Number} val value of selected frame
     * @param {Number} index index of frame in screen
     * @param {Number} screen id of screen
     */
    onSingleFolderPageChange(id, frameIndex, screen) {
      const flowSettings = cloneDeep(this.flowSettings.flowSingleSettings);
      flowSettings.screen[screen][frameIndex] = id;
      const startOn = !frameIndex ? id : flowSettings.screen[screen][0];
      flowSettings.screen[screen] = getSelectedDataOfPages(
        flowSettings.screen[screen],
        startOn
      );
      this.onSettingChange({
        setting: {
          flowSingleSettings: flowSettings,
          startOnPageNumber: startOn
        }
      });
    },
    /**
     * Handle flow setting change
     * @param {Number} val value of selected frame
     * @param {Number} index index of frame in screen
     * @param {Number} screen id of screen
     */
    onMultiFolderPageChange(id, frameIndex, screen) {
      const flowSettings = cloneDeep(this.flowSettings.flowMultiSettings);
      flowSettings.screen[screen][frameIndex] = id;
      const startOn =
        parseInt(this.currentSheet.pageName) === screen && !frameIndex
          ? id
          : this.flowSettings.startOnPageNumber;
      const dataScreen = getDataScreenOfMultiFolder(
        flowSettings.screen,
        this.selectedFolders,
        this.maxPortraitPerPage
      );
      flowSettings.screen = dataScreen.reduce((result, item) => {
        return {
          ...result,
          [item.screen]: item.frames.map(el => el.startOnPage)
        };
      }, {});
      this.onSettingChange({
        setting: {
          flowMultiSettings: flowSettings,
          startOnPageNumber: startOn
        }
      });
    },
    /**
     * Handle screen setting change
     * @param {Number} newScreenId id of new screen
     * @param {Number} frameIndex frame index of selected in screen
     * @param {Number} oldScreenId id of old screen
     */
    onScreenSettingChange({ newScreenId, frameIndex, oldScreenId }) {
      const flowSettings = cloneDeep(this.flowSettings.flowMultiSettings);
      if (isEmpty(flowSettings.screen[newScreenId])) {
        flowSettings.screen[newScreenId] = [];
      }
      if (newScreenId < oldScreenId) {
        flowSettings.screen[oldScreenId].shift();
        flowSettings.screen[newScreenId].push(1);
      }
      if (newScreenId > oldScreenId) {
        const totalFrameAutoFlow = this.getTotalFrameAutoFlow(
          flowSettings,
          oldScreenId,
          newScreenId,
          frameIndex
        );
        for (let i = 0; i < totalFrameAutoFlow; i++) {
          flowSettings.screen[newScreenId].unshift(1);
        }
      }
      if (isEmpty(flowSettings.screen[oldScreenId])) {
        delete flowSettings.screen[oldScreenId];
      }
      const dataScreen = getDataScreenOfMultiFolder(
        flowSettings.screen,
        this.selectedFolders,
        this.maxPortraitPerPage
      );
      flowSettings.screen = dataScreen.reduce((result, item) => {
        return {
          ...result,
          [item.screen]: item.frames.map(el => el.startOnPage)
        };
      }, {});
      this.onSettingChange({
        setting: {
          flowMultiSettings: flowSettings
        }
      });
    },
    /**
     * Get base frames
     * @param {Number} total total frames
     * @param {Number} min min frame number
     * @returns {Array} frames
     */
    getBaseFrames(total, min) {
      return Array.from({ length: total }, (_, index) => index + min);
    },
    /**
     * Get total frame auto flow
     * @param {Number} flowSettings flow settings
     * @param {Number} newScreenId id of new screen
     * @param {Number} frameIndex frame index of selected in screen
     * @param {Number} oldScreenId id of old screen
     * @returns {Number} total frame auto flow
     */
    getTotalFrameAutoFlow(flowSettings, oldScreenId, newScreenId, frameIndex) {
      const frameAutoFlow =
        flowSettings.screen[oldScreenId].length - frameIndex;
      flowSettings.screen[oldScreenId].splice(frameIndex, frameAutoFlow);
      return Object.keys(flowSettings.screen).reduce((result, item) => {
        if (item <= oldScreenId || item >= newScreenId) {
          return result;
        }
        const count = flowSettings.screen[item].length;
        delete flowSettings.screen[item];
        return result + count;
      }, frameAutoFlow);
    }
  }
};
