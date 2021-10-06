import FlowSelect from '../FlowSelect';
import ItemSelect from '../ItemSelect';
import { useSheet, useGetterEditionSection, useFrame } from '@/hooks';
import {
  DIGITAL_PORTRAIT_FLOW_OPTION_SINGLE,
  DIGITAL_PORTRAIT_FLOW_OPTION_MULTI
} from '@/common/constants';
import { getDataScreenOfMultiFolder } from '@/common/utils';
import { cloneDeep } from 'lodash';

export default {
  components: {
    FlowSelect,
    ItemSelect
  },
  setup() {
    const { currentSheet, getSheets: sheets } = useSheet();
    const { currentSection } = useGetterEditionSection();
    const { frameIds } = useFrame();
    return {
      currentSheet,
      sheets,
      currentSection,
      frameIds
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
    maxPortraitPerFrame() {
      const totalRow = this.flowSettings.layoutSettings.rowCount;
      const totalCol = this.flowSettings.layoutSettings.colCount;
      return totalRow * totalCol;
    },
    flowSingleSettings() {
      return this.flowSettings.flowSingleSettings;
    },
    portraitFlowOptionSingle() {
      return Object.values(DIGITAL_PORTRAIT_FLOW_OPTION_SINGLE);
    },
    selectedFlowSingle() {
      return this.portraitFlowOptionSingle.find(
        item => item.id === this.flowSingleSettings.flowOption
      );
    },
    isShowSelectFrameSingle() {
      return (
        !this.isMultiple &&
        this.selectedFlowSingle.id ===
          DIGITAL_PORTRAIT_FLOW_OPTION_SINGLE.MANUAL.id
      );
    },
    dataSelectFrameSingle() {
      const dataSelectFrame = [];
      Object.keys(this.flowSingleSettings.screen).forEach(key => {
        this.flowSingleSettings.screen[key].forEach((frame, frameIndex) => {
          dataSelectFrame.push({
            screen: key,
            frame,
            frameIndex
          });
        });
      });
      return dataSelectFrame.map(this.calculateDataFrameOfSingle);
    },
    flowMultiSettings() {
      return this.flowSettings.flowMultiSettings;
    },
    isSmallerNumberOfScreen() {
      return this.remainingSheetsOfSection < this.selectedFolders.length;
    },
    isSingleScreen() {
      return this.currentSection.sheetIds.length === 1;
    },
    portraitFlowOptionMulti() {
      const options = cloneDeep(DIGITAL_PORTRAIT_FLOW_OPTION_MULTI);
      if (this.isSmallerNumberOfScreen) {
        delete options.AUTO_NEXT_SCREEN;
      }
      if (this.isSingleScreen) {
        options.MANUAL.name = 'Allow me to designate the next frame';
      }
      return Object.values(options);
    },
    selectedFlowMulti() {
      return this.portraitFlowOptionMulti.find(
        item => item.id === this.flowMultiSettings.flowOption
      );
    },
    isShowSelectFrameMulti() {
      return (
        this.isMultiple &&
        this.selectedFlowMulti.id ===
          DIGITAL_PORTRAIT_FLOW_OPTION_MULTI.MANUAL.id
      );
    },
    dataSelectFrameMulti() {
      const dataSelectFrame = [];
      const dataScreen = getDataScreenOfMultiFolder(
        this.flowMultiSettings.screen,
        this.selectedFolders,
        this.maxPortraitPerFrame
      );

      dataScreen.forEach(item => {
        item.frames.forEach((frame, frameIndex) => {
          dataSelectFrame.push({
            screen: item.screen,
            frame,
            frameIndex
          });
        });
      });

      return dataSelectFrame.map(this.calculateDataFrameOfMulti);
    },

    remainingSheetsOfSection() {
      const sheetIndexOfSection = this.currentSection.sheetIds.findIndex(
        item => item === this.currentSheet.id
      );
      return this.currentSection.sheetIds.length - sheetIndexOfSection;
    }
  },
  methods: {
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val configuration changed
     */
    onFlowSettingChange(val) {
      this.$emit('flowSettingChange', val.id);
    },
    /**
     * calculate data select frame
     * @param {Object} folder portrait folder
     * @param {Number} index index of folder
     * @param {Array} arr portrait folders
     * @returns {Object} data select frame
     */
    calculateDataFrameOfSingle(item, index, arr) {
      return {
        startAsset: index * this.maxPortraitPerFrame + 1,
        endAsset:
          arr.length - 1 === index
            ? this.flowSettings.totalPortraitsCount
            : (index + 1) * this.maxPortraitPerFrame,
        selectedVal: {
          id: item.frame,
          name: item.frame
        },
        frameOptions: !item.frameIndex
          ? this.frameOptions(1, item.frame, item.screen)
          : this.frameOptions(
              arr[index - 1].frame + 1,
              item.frame,
              item.screen
            ),
        screen: item.screen,
        frameIndex: item.frameIndex
      };
    },
    /**
     * calculate data select frame
     * @param {Object} folder portrait folder
     * @param {Number} index index of folder
     * @param {Array} arr portrait folders
     * @returns {Object} data select frame
     */
    calculateDataFrameOfMulti(item, index, arr) {
      return {
        selectedVal: {
          id: item.frame.startOnPage,
          name: item.frame.startOnPage
        },
        screen: parseInt(item.screen),
        frameOptions: !item.frameIndex
          ? this.frameOptions(1, item.frame.startOnPage, item.screen)
          : this.frameOptions(
              arr[index - 1].frame.endOnPage + 1,
              item.frame.startOnPage,
              item.screen
            ),
        endOnFrameOptions: this.frameOptions(
          item.frame.endOnPage,
          item.frame.endOnPage,
          item.screen
        ),
        selectedValEndOnFrame: {
          id: item.frame.endOnPage,
          name: item.frame.endOnPage
        },
        selectedValScreen: {
          id: item.screen,
          name: 'Screen ' + item.screen
        },
        screenOptions: !index
          ? this.screenOptions(item.screen)
          : this.screenOptions(arr[index - 1].screen),
        frameIndex: item.frameIndex
      };
    },
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val value of selected frame
     * @param {Object} index index of frame in screen
     * @param {Object} screen id of screen
     */
    onFrameSettingChange(val, frameIndex, screen) {
      this.$emit('pageSettingChange', {
        id: val.id,
        frameIndex,
        screen
      });
    },
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val value of selected screen
     * @param {Object} frameIndex frame index of selected screen
     * @param {Object} oldScreenId old screen id
     */
    onScreenSettingChange(val, frameIndex, oldScreenId) {
      this.$emit('screenSettingChange', {
        newScreenId: val.id,
        frameIndex,
        oldScreenId
      });
    },
    /**
     * Get options of select screen
     * @param {Number} min min value
     * @param {Number} max max value
     * @returns {Array} screen options
     */
    screenOptions(min) {
      const startOption = parseInt(this.currentSheet.pageName);
      const screenOptions = Array.from(
        { length: this.remainingSheetsOfSection },
        (_, i) => {
          const id = i + startOption;
          return {
            id: id,
            name: 'Screen ' + id
          };
        }
      );
      return screenOptions.filter(item => {
        return item.id >= min;
      });
    },
    /**
     * Get total frames of screens
     * @param {Number} screenId screen id
     * @returns {Object} frame options
     */
    getTotalFramesOfScreens(screenId) {
      const totalFramesOfScreens = Object.values(this.sheets).reduce(
        (obj, sheet) => {
          const key = Number(sheet.pageName);
          obj[key] = sheet.frames.length || 1;
          return obj;
        },
        {}
      );
      totalFramesOfScreens[
        Number(this.currentSheet.pageName)
      ] = this.frameIds.length;
      return totalFramesOfScreens[screenId];
    },
    /**
     * Get options of select frame
     * @param {Number} min min value
     * @param {Number} value selected value
     * @param {Number} screenId screen id of selected value
     * @returns {Array} frame options
     */
    frameOptions(min, value, screenId) {
      const totalFramesOfScreen = this.getTotalFramesOfScreens(screenId);
      const maxOptions = Math.max(totalFramesOfScreen, value) + 5;
      return Array.from({ length: maxOptions }, (_, i) => i + 1)
        .map(item => ({
          id: item,
          name: item
        }))
        .filter(item => item.id >= min);
    }
  }
};
