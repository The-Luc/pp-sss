import FlowWarning from '@/components/Modals/FlowWarning';

import CommonModal from '../../CommonModal';
import FlowSettings from '../FlowSettings';
import FlowPreview from '../FlowPreview';

import { PortraitFlowData } from '@/common/models';

import {
  DEFAULT_PAGE_TITLE,
  DEFAULT_NAME_TEXT,
  DEFAULT_MARGIN_PAGE_TITLE,
  PORTRAIT_TEACHER_PLACEMENT
} from '@/common/constants';
import { cloneDeep } from 'lodash';
import {
  getPortraitsByRole,
  getTeacherAndAsstOrder,
  isEmpty,
  sortPortraitByName
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
    },
    flowSettings: {
      type: Object,
      default: () => ({})
    },
    startNumber: {
      type: Number,
      default: 1
    },
    requiredPages: {
      type: Array,
      default: () => []
    },
    isWarningDisplayed: {
      type: Boolean,
      default: false
    },
    warningText: {
      type: String
    },
    initFlowOption: {
      type: Number,
      default: 0
    },
    previewPortraitsRange: {
      type: Array,
      required: () => []
    },
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPreviewDisplayed: false,
      flowReviewCompKey: true
    };
  },
  created() {
    const flowSettings = new PortraitFlowData({
      startOnPageNumber: this.startNumber,
      totalPortraitsCount: this.getTotalPortrait(),
      folders: cloneDeep(this.selectedFolders),
      textSettings: this.initDataTextSettings()
    });

    this.onSettingChange(flowSettings);
  },
  computed: {
    title() {
      return this.isPreviewDisplayed ? 'Portrait Flow Review' : 'Portrait Flow';
    },
    isMultiFolder() {
      return this.selectedFolders.length > 1;
    }
  },
  watch: {
    flowSettings: {
      deep: true,
      handler(newVal, oldVal) {
        this.$emit('updateRequirePage');

        const isSameLayout =
          JSON.stringify(newVal.layoutSettings) ===
          JSON.stringify(oldVal.layoutSettings);
        const isSameTeacher =
          JSON.stringify(newVal.teacherSettings) ===
          JSON.stringify(oldVal.teacherSettings);

        if (isSameLayout && isSameTeacher) return;

        this.initDataFlowSettings();
        this.updatePortraitOrder();
      }
    }
  },
  mounted() {
    this.updatePortraitOrder();
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
     * Set new start page / frame
     *
     * @param {Number}  startNo  selected page / frame
     */
    onStartChange({ startNo }) {
      this.$emit('startChange', { startNo });
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
      this.$emit('saveSetting');
    },
    /**
     * Handle flow setting change
     */
    onFlowSettingChange(val) {
      this.$emit('flowSettingChange', { setting: val });
    },
    /**
     * To update flowSetting with data come from child componenet settings
     * @param {Object} val data will be update to flowSetting
     */
    onSettingChange(val) {
      this.$emit('settingChange', { setting: val });
    },
    /**
     * Close modal warning
     */
    onFlowWarningClose() {
      this.$emit('closeWarning');
    },
    onPageSettingChange() {
      this.$emit('pageSettingChange');
    },
    /**
     * Initital data for portrait flow
     */
    initDataFlowSettings() {
      this.onFlowSettingChange(this.initFlowOption);
    },
    /**
     * Get total asset in selected folders
     *
     * @returns {Number}  total asset
     */
    getTotalPortrait() {
      if (!this.isMultiFolder) {
        return this.selectedFolders[0].assets.length;
      }

      return this.selectedFolders.reduce(
        (acc, val) => acc + val.assets.length,
        0
      );
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
     * Update the order portrait when use choose teacher placement FIRST or LAST
     */
    rearrangePortraitOrder() {
      if (isEmpty(this.flowSettings) || this.isMultiFolder) return [];

      const {
        teacherPlacement,
        assistantTeacherPlacement,
        hasTeacher,
        hasAssistantTeacher
      } = this.flowSettings.teacherSettings;

      const { students, teachers, asstTeachers } = getPortraitsByRole(
        this.selectedFolders[0]
      );

      if (!hasTeacher) {
        return students;
      }

      const teacherAndAsst = !hasAssistantTeacher
        ? teachers
        : getTeacherAndAsstOrder(
            teachers,
            asstTeachers,
            assistantTeacherPlacement
          );

      if (teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.FIRST) {
        return [...teacherAndAsst, ...students];
      }

      if (teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.LAST) {
        return [...students, ...teacherAndAsst];
      }

      return [...teacherAndAsst, ...students].sort(sortPortraitByName);
    },
    /**
     * Update order of portrait in assets
     */
    updatePortraitOrder() {
      if (isEmpty(this.flowSettings) || this.isMultiFolder) return;

      const portraits = this.rearrangePortraitOrder();

      this.flowSettings.folders[0].assets = portraits;
      this.flowSettings.folders[0].assetsCount = portraits.length;
      this.flowSettings.totalPortraitsCount = portraits.length;
    }
  }
};
