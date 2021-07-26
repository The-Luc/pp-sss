import ThumbnailHeaderGroup from '@/components/Thumbnail/ThumbnailHeaderGroup';
import ThumbnailItem from '@/components/Thumbnail/ThumbnailItem';

import { mapGetters, mapMutations } from 'vuex';

import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useObjectProperties,
  useUser
} from '@/hooks';
import { TOOL_NAME, EDITION } from '@/common/constants';
import {
  isEmpty,
  scrollToElement,
  getSectionsWithAccessible
} from '@/common/utils';

export default {
  components: {
    ThumbnailHeaderGroup,
    ThumbnailItem
  },
  setup() {
    const { setToolNameSelected } = usePopoverCreationTool();
    const { toggleMenuProperties } = useObjectProperties();
    const { updateVisited, setIsPrompt } = useLayoutPrompt(EDITION.DIGITAL);
    const { currentUser } = useUser();

    return {
      toggleMenuProperties,
      updateVisited,
      setToolNameSelected,
      setIsPrompt,
      currentUser
    };
  },
  data() {
    return {
      collapseSectionId: null
    };
  },
  computed: {
    ...mapGetters({
      pageSelected: DIGITAL_GETTERS.CURRENT_SHEET,
      sectionList: DIGITAL_GETTERS.SECTIONS_SHEETS,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    }),
    sections() {
      return getSectionsWithAccessible(this.sectionList, this.currentUser);
    }
  },
  created() {
    this.handleWatchForAutoScroll();
  },
  methods: {
    ...mapMutations({
      selectSheet: DIGITAL_MUTATES.SET_CURRENT_SHEET_ID
    }),
    /**
     * Handle watch when pageSelected change to make autoscroll then destroy watch
     */
    handleWatchForAutoScroll() {
      const watchHandler = this.$watch(
        'pageSelected',
        value => {
          if (isEmpty(value)) return;

          setTimeout(() => {
            this.autoScrollToScreen(value.id);
          }, 20);

          watchHandler();
        },
        {
          deep: true
        }
      );
    },
    /**
     * Get screen refs by sheet's id and handle auto scroll
     *
     * @param  {Number} pageSelected Sheet's id selected
     */
    autoScrollToScreen(pageSelected) {
      const currentScreendActive = this.$refs[`screen${pageSelected}`];

      if (isEmpty(currentScreendActive)) return;

      scrollToElement(currentScreendActive[0].$el);
    },
    /**
     * Get name of page of selected sheet
     *
     * @param   {String}  pageName  name of page of selected sheet
     * @returns {Object}            name of page
     */
    getPageName({ pageName }) {
      return { middle: pageName };
    },
    /**
     * Check if that sheet is activated
     *
     * @param   {String}  id  id of selected sheet
     * @returns {Boolean}     sheet is activated
     */
    checkIsActive({ id }) {
      return id === this.pageSelected?.id;
    },
    /**
     * Set selected sheet's id & show notice if not visited
     *
     * @param {String | Number} id  id of selected sheet
     */
    onSelectSheet({ id }) {
      if (this.pageSelected.id !== id) this.$router.push(`${id}`);

      this.toggleMenuProperties({ isOpenMenuProperties: false });

      this.setToolNameSelected('');

      if (this.pageSelected.isVisited) return;

      this.setIsPrompt({ isPrompt: false });

      this.updateVisited({ sheetId: id });

      this.setToolNameSelected(TOOL_NAME.DIGITAL_LAYOUTS);
    },
    /**
     * Toggle display sheets of section by changing collapse section id
     */
    onToggleSheets(sectionId) {
      const selectedId = this.collapseSectionId === sectionId ? '' : sectionId;

      this.collapseSectionId = selectedId;
    },
    /**
     * Check if section should be collapsed
     */
    checkIsExpand(sectionId) {
      return this.collapseSectionId !== sectionId;
    }
  }
};
