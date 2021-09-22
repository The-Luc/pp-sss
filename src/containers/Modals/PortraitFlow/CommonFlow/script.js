import FlowWarning from '@/components/Modals/FlowWarning';
import SaveSettingsModal from '@/components/Modals/SaveSettings/SavedSettingModal';
import SavedModal from '@/components/Modals/SaveSettings/SavedModal';

import CommonModal from '../../CommonModal';
import FlowSettings from '../FlowSettings';
import FlowPreview from '../FlowPreview';

import { PortraitFlowData } from '@/common/models';
import { usePortraitFlow } from '@/views/CreateBook/composables';

import {
  DEFAULT_PAGE_TITLE,
  DEFAULT_NAME_TEXT,
  DEFAULT_MARGIN_PAGE_TITLE,
  PORTRAIT_TEACHER_PLACEMENT,
  PORTRAIT_NAME_DISPLAY
} from '@/common/constants';
import { cloneDeep, merge } from 'lodash';
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
    FlowWarning,
    SavedModal,
    SaveSettingsModal
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
      type: String,
      default: ''
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
    },
    initialLayoutSetting: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { saveSettings, getSavedSettings } = usePortraitFlow();

    return { saveSettings, getSavedSettings };
  },
  data() {
    return {
      isPreviewDisplayed: false,
      flowReviewCompKey: true,
      savedSettings: [],
      isOpenModalSuccess: false,
      isOpenSaveSettingsModal: false,
      triggerTab: false,
      saveMsg: 'Your settings have been saved',
      loadMsg: 'Your saved portrait settings have loaded',
      message: ''
    };
  },
  async created() {
    const flowSettings = new PortraitFlowData({
      startOnPageNumber: this.startNumber,
      totalPortraitsCount: this.getTotalPortrait(),
      folders: cloneDeep(this.selectedFolders),
      textSettings: this.initDataTextSettings()
    });

    merge(flowSettings.layoutSettings, this.initialLayoutSetting);

    this.onSettingChange(flowSettings);

    this.savedSettings = await this.getSavedSettings(this.isDigital);
  },
  computed: {
    title() {
      return this.isPreviewDisplayed ? 'Portrait Flow Review' : 'Portrait Flow';
    },
    isMultiFolder() {
      return this.selectedFolders.length > 1;
    },
    isFirstLast() {
      return (
        this.flowSettings.textSettings.nameDisplay.value ===
        PORTRAIT_NAME_DISPLAY.FIRST_LAST.value
      );
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
        const isSameText =
          JSON.stringify(newVal.textSettings) ===
          JSON.stringify(oldVal.textSettings);

        if (isSameLayout && isSameTeacher && isSameText) return;

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
     * @param {Object}  name name save settings
     */
    async onSaveSettings(name) {
      if (!this.isOpenSaveSettingsModal) {
        this.isOpenSaveSettingsModal = true;
        return;
      }

      await this.saveSettings(
        { ...this.flowSettings, ...name },
        this.isDigital
      );
      this.onCancelSaveSettings();

      this.message = this.saveMsg;
      this.isOpenModalSuccess = true;
      setTimeout(() => {
        this.isOpenModalSuccess = false;
      }, 2000);

      this.savedSettings = await this.getSavedSettings(this.isDigital);
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
    /**
     * Handle page/frame setting change
     * @param {Object} val value of selected page/frame
     */
    onPageSettingChange(val) {
      this.$emit('pageSettingChange', val);
    },
    onScreenSettingChange(val) {
      this.$emit('screenSettingChange', val);
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
      const defaulfNameText = this.isDigital
        ? { ...DEFAULT_NAME_TEXT, fontSize: 9 }
        : DEFAULT_NAME_TEXT;

      return {
        ...this.flowSettings.textSettings,
        pageTitleFontSettings: DEFAULT_PAGE_TITLE,
        nameTextFontSettings: defaulfNameText,
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

      students.sort(sortPortraitByName(this.isFirstLast));
      teachers.sort(sortPortraitByName(this.isFirstLast));
      asstTeachers.sort(sortPortraitByName(this.isFirstLast));

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

      return [...teacherAndAsst, ...students].sort(
        sortPortraitByName(this.isFirstLast)
      );
    },
    /**
     * Update order of portrait in assets
     */
    updatePortraitOrder() {
      if (isEmpty(this.flowSettings)) return;

      if (this.isMultiFolder) {
        const folders = cloneDeep(this.flowSettings.folders);

        folders.forEach(f =>
          f.assets.sort(sortPortraitByName(this.isFirstLast))
        );

        this.onSettingChange({
          ...this.flowSettings,
          folders
        });
        return;
      }

      const portraits = this.rearrangePortraitOrder();

      const folders = cloneDeep(this.flowSettings.folders);

      folders[0].assets = portraits;
      folders[0].assetsCount = portraits.length;

      this.onSettingChange({
        ...this.flowSettings,
        totalPortraitsCount: portraits.length,
        folders
      });
    },
    /**
     * Load portrait setting saved
     * @param {Number} id id of portrait to load
     */
    onLoadSetting(id) {
      const portraitSetting = this.savedSettings.find(item => item.id === id);
      const flowSettings = { ...this.flowSettings, ...portraitSetting };

      this.message = this.loadMsg;
      this.isOpenModalSuccess = true;
      setTimeout(() => {
        this.isOpenModalSuccess = false;
        this.onSettingChange(flowSettings);
        this.triggerTab = !this.triggerTab;
      }, 2000);
    },
    /**
     * Cancel modal save setting
     */
    onCancelSaveSettings() {
      this.isOpenSaveSettingsModal = false;
    }
  }
};
