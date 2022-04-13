import { mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';
import { MUTATES as THEME_MUTATES } from '@/store/modules/theme/const';
import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import Themes from './Themes';
import Preview from './Preview';
import { getThemesApi } from '@/api/theme';
import { useLayoutPrompt, useGetDigitalLayouts } from '@/hooks';
import { EDITION } from '@/common/constants';

export default {
  setup() {
    const { openPrompt } = useLayoutPrompt(EDITION.DIGITAL);
    const { getDigitalLayouts } = useGetDigitalLayouts();
    return {
      openPrompt,
      getDigitalLayouts
    };
  },
  components: {
    Modal,
    PpButton,
    Themes,
    Preview
  },
  data() {
    return {
      selectedThemeId: null,
      isPreviewing: false,
      layoutsOfThemePreview: [],
      themes: []
    };
  },
  computed: {
    themeNamePreview() {
      let name = '';
      if (this.isPreviewing) {
        name = this.themes.find(item => item.id == this.selectedThemeId).name;
      }
      return name;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      setDefaultThemId: DIGITAL_MUTATES.SET_DEFAULT_THEME_ID,
      setDigitalThemes: THEME_MUTATES.DIGITAL_THEMES,
      setDigitalLayouts: THEME_MUTATES.DIGITAL_LAYOUTS
    }),
    /**
     * Set selected theme's id
     * @param  {Number} theme.themeId - Theme's id selected
     */
    onSelectTheme({ themeId }) {
      this.selectedThemeId = themeId;
    },
    /**
     * Set preview theme's id
     * @param  {Number} theme.themeId - Theme's id preview
     */
    async onPreviewTheme({ themeId }) {
      this.isPreviewing = true;
      this.selectedThemeId = themeId;

      // clear previous layout
      this.layoutsOfThemePreview = [];

      this.selectedThemeId = themeId;
      this.layoutsOfThemePreview = await this.getDigitalLayouts(themeId);
    },
    /**
     * Set preview theme's id empty and close preview
     */

    onClosePreview() {
      this.isPreviewing = false;
    },
    /**
     * Set theme for print editor and close modal
     */
    onSubmitThemeId() {
      this.setDefaultThemId({
        themeId: this.selectedThemeId
      });
      this.onCloseModal();
      this.openPrompt();
    },
    /**
     * Close Modal
     */
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  },
  async created() {
    this.themes = await getThemesApi(true);

    this.setDigitalThemes({ themes: this.themes });

    this.selectedThemeId = this.themes[0]?.id;
  }
};
