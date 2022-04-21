import ThumbnailHeaderGroup from '@/components/Thumbnail/ThumbnailHeaderGroup';
import ThumbnailItem from '@/components/Thumbnail/ThumbnailItem';

import { mapGetters, mapMutations } from 'vuex';

import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import { useLayoutPrompt, usePopoverCreationTool, useUser } from '@/hooks';
import { TOOL_NAME, EDITION } from '@/common/constants';
import { isEmpty, getSectionsWithAccessible, autoScroll } from '@/common/utils';

export default {
  components: {
    ThumbnailHeaderGroup,
    ThumbnailItem
  },
  setup() {
    const { setToolNameSelected } = usePopoverCreationTool();
    const { updateVisited, setIsPrompt } = useLayoutPrompt(EDITION.PRINT);
    const { currentUser } = useUser();

    return {
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
      pageSelected: PRINT_GETTERS.CURRENT_SHEET,
      sectionList: PRINT_GETTERS.SECTIONS_SHEETS
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
      selectSheet: PRINT_MUTATES.SET_CURRENT_SHEET_ID
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
            this.autoScrollToSpread(value.id);
          }, 20);

          watchHandler();
        },
        {
          deep: true
        }
      );
    },
    /**
     * Get spread refs by sheet's id and handle auto scroll
     *
     * @param  {Number} pageSelected Sheet's id selected
     */
    autoScrollToSpread(pageSelected) {
      autoScroll(this.$refs, `spread${pageSelected}`);
    },
    /**
     * Get names of page of selected sheet
     *
     * @param   {String}  pageLeftName  name of page left of selected sheet
     * @param   {String}  pageRightName name of page right of selected sheet
     * @returns {Object}                names of page
     */
    getPageNames({ pageLeftName, pageRightName }) {
      return {
        left: pageLeftName,
        right: pageRightName
      };
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

      this.setToolNameSelected('');

      if (this.pageSelected.isVisited) return;

      this.setIsPrompt({ isPrompt: false });

      this.updateVisited({ sheetId: id });

      this.setToolNameSelected(TOOL_NAME.PRINT_LAYOUTS);
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
