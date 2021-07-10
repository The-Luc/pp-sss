import { mapGetters, mapMutations } from 'vuex';

import { themeOptions } from '@/mock/digitalThemes';
import {
  GETTERS as THEME_GETTERS,
  MUTATES as THEME_MUTATES
} from '@/store/modules/theme/const';

import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';
import { TOOL_NAME } from '@/common/constants';
import ThemesToolPopover from '@/components/ToolPopover/Theme';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { loadDigitalThemes } from '@/api/themes';

export default {
  components: {
    ThemesToolPopover
  },
  data() {
    return {
      items: themeOptions,
      selectedThemeId: null,
      optionThemeSelected: {}
    };
  },
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_DIGITAL_THEMES,
      digitalThemeSelectedId: DIGITAL_GETTERS.DEFAULT_THEME_ID,
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME
    })
  },
  watch: {
    selectedToolName(toolName) {
      if (!toolName) {
        this.selectedThemeId = null;
        this.optionThemeSelected = {};
      }
      if (
        this.digitalThemeSelectedId &&
        toolName === TOOL_NAME.DIGITAL_THEMES
      ) {
        this.initData();
      }
    }
  },
  mounted() {
    if (this.digitalThemeSelectedId) {
      this.initData();
    }
  },
  methods: {
    ...mapMutations({
      triggerThemeIdSelected: DIGITAL_MUTATES.SET_DEFAULT_THEME_ID,
      setToolNameSelected: APP_MUTATES.SET_TOOL_NAME_SELECTED,
      setDigitalThemes: THEME_MUTATES.DIGITAL_THEMES
    }),
    /**
     * Set up needly data to render to view: selectedThemeId, optionThemeSelected
     */
    initData() {
      this.selectedThemeId = this.digitalThemeSelectedId;
      this.setOptionThemeSelected(this.digitalThemeSelectedId);
    },
    /**
     * Set selected theme id after click on theme in list of themes
     */
    onSelectTheme(theme) {
      this.selectedThemeId = theme.id;
      this.setOptionThemeSelected(theme.id);
    },
    /**
     * Set value for select base on theme selected
     */
    setOptionThemeSelected(themeId) {
      this.optionThemeSelected =
        this.items.find(item => item.id === themeId) || {};
    },
    /**
     * Set selected theme id after change option from select and get theme ref
     */
    onChangeTheme(theme) {
      this.selectedThemeId = theme.id;
    },
    /**
     * Trigger mutation set tool name selected is empty to close popover after click Cancel button
     */
    onCancel() {
      this.setToolNameSelected({
        name: ''
      });
    },
    /**
     * Trigger mutation change theme selected id and set tool name selected is empty to close popover after click Change Theme button
     */
    onChangeThemeSelected() {
      this.triggerThemeIdSelected({
        themeId: this.selectedThemeId
      });
      this.setToolNameSelected({
        name: ''
      });
    }
  },
  async created() {
    if (this.themes.length === 0) {
      const themes = await loadDigitalThemes();
      this.setDigitalThemes({
        themes
      });
    }
  }
};
