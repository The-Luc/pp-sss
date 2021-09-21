import FlowSelect from '../FlowSelect';
import ItemSelect from '../ItemSelect';
import { useSheet, useGetterEditionSection } from '@/hooks';
import {
  DIGITAL_PORTRAIT_FLOW_OPTION_SINGLE,
  DIGITAL_PORTRAIT_FLOW_OPTION_MULTI
} from '@/common/constants';
import { getDataScreenOfMultiFolder } from '@/common/utils';

export default {
  components: {
    FlowSelect,
    ItemSelect
  },
  setup() {
    const { currentSheet, getSheets } = useSheet();
    const { currentSection } = useGetterEditionSection();
    return {
      currentSheet,
      getSheets,
      currentSection
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
      return this.currentSection.sheetIds.length < this.selectedFolders.length;
    },
    portraitFlowOptionMulti() {
      const option = Object.values(DIGITAL_PORTRAIT_FLOW_OPTION_MULTI);
      if (!this.isSmallerNumberOfScreen) {
        return option;
      }
      return option.filter(item => {
        return (
          item.id !== DIGITAL_PORTRAIT_FLOW_OPTION_MULTI.AUTO_NEXT_SCREEN.id
        );
      });
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
        frameOptions: this.frameOptions(arr[index - 1]?.frame, item.frame),
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
        frameOptions: this.frameOptions(
          arr[index - 1]?.frame.endOnPage,
          item.frame.startOnPage
        ),
        endOnFrameOptions: this.frameOptions(null, item.frame.endOnPage),
        selectedValEndOnFrame: {
          id: item.frame.endOnPage,
          name: item.frame.endOnPage
        },
        selectedValScreen: {
          id: item.screen,
          name: 'Screen ' + item.screen
        },
        screenOptions: !index
          ? this.screenOptions(item.screen, arr[index + 1]?.screen)
          : this.screenOptions(arr[index - 1].screen, arr[index + 1]?.screen),
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
     * @param {Object} val value of selected frame
     * @param {Object} screen screen
     */
    onScreenSettingChange(val, screen) {
      this.$emit('screenSettingChange', {
        id: val.id,
        screen
      });
    },
    /**
     * Get options of select screen
     * @param {Number} min min value
     * @param {Number} max max value
     * @returns {Array} screen options
     */
    screenOptions(min, max) {
      const totalSheet = this.currentSection.sheetIds.length;
      const startOption = parseInt(this.currentSheet.pageName);
      const screenOptions = Array.from(
        { length: totalSheet },
        (_, i) => i + startOption
      ).map(item => ({
        id: item,
        name: 'Screen ' + item
      }));
      return max
        ? screenOptions.filter(item => {
            return item.id >= min && item.id <= max;
          })
        : screenOptions.filter(item => {
            return item.id >= min;
          });
    },
    /**
     * Get options of select frame
     * @param {Number} min min value
     * @param {Number} value selected value
     * @returns {Array} frame options
     */
    frameOptions(min, value) {
      const minValue = min ? Math.min(min, value - 1) : value - 1;
      const totalSheet = value + 5;
      return Array.from({ length: totalSheet }, (_, i) => i + 1)
        .map(item => ({
          id: item,
          name: item
        }))
        .filter(item => item.id > minValue);
    }
  }
};
