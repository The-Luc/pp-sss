import PpToolPopover from '@/components/ToolPopover';

import BackgroundTypeSelection from './BackgroundTypeSelection';
import BackgroundPageTypeSelection from './BackgroundPageTypeSelection';
import Item from './Item';

import { mapGetters, mapMutations } from 'vuex';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';

import {
  MODAL_TYPES,
  TOOL_NAME,
  HALF_SHEET,
  BACKGROUND_TYPE,
  BACKGROUND_PAGE_TYPE
} from '@/common/constants';

import { usePopoverCreationTool } from '@/hooks';

import { cloneDeep } from 'lodash';
import { isEmpty } from '@/common/utils';

import { themeOptions } from '@/mock/themes';
import { BACKGROUNDS, BACKGROUND_CATEGORIES } from '@/mock/backgrounds';

export default {
  components: {
    PpToolPopover,
    Item,
    BackgroundTypeSelection,
    BackgroundPageTypeSelection
  },
  data() {
    const backgroundTypes = Object.keys(BACKGROUND_TYPE).map(k => {
      const bgType = {
        ...BACKGROUND_TYPE[k],
        value: BACKGROUND_TYPE[k].id,
        subItems: []
      };

      if (BACKGROUND_TYPE[k].id === 0) {
        bgType.subItems = themeOptions;
      }

      if (BACKGROUND_TYPE[k].id === 1) {
        bgType.subItems = Object.keys(BACKGROUND_CATEGORIES).map(k => {
          return {
            ...BACKGROUND_CATEGORIES[k],
            value: BACKGROUND_CATEGORIES[k].id
          };
        });
      }

      return bgType;
    });

    const displayBackgroundTypes = backgroundTypes.filter(
      b => b.subItems.length > 0
    );

    const displayBackgroundPageType = Object.keys(BACKGROUND_PAGE_TYPE).map(
      k => {
        return {
          ...BACKGROUND_PAGE_TYPE[k],
          value: BACKGROUND_PAGE_TYPE[k].id
        };
      }
    );

    return {
      displayBackgroundTypes,
      displayBackgroundPageType,
      chosenBackgroundType: {},
      chosenBackgroundPageType: {},
      chosenBackground: {},
      noBackgroundLength: 4
    };
  },
  setup() {
    const { setToolNameSelected, selectedToolName } = usePopoverCreationTool();

    return {
      selectedToolName,
      setToolNameSelected
    };
  },
  computed: {
    ...mapGetters({
      book: BOOK_GETTERS.BOOK_DETAIL,
      sectionId: BOOK_GETTERS.SECTION_ID,
      currentSheet: BOOK_GETTERS.GET_PAGE_SELECTED,
      currentThemeId: BOOK_GETTERS.PRINT_THEME_SELECTED_ID,
      sheetBackgrounds: BOOK_GETTERS.SHEET_BACKGROUNDS,
      sheetType: BOOK_GETTERS.SHEET_TYPE
    }),
    isHalfSheet() {
      return HALF_SHEET.indexOf(this.sheetType(this.currentSheet.id)) >= 0;
    },
    alreadyAppliedBackground() {
      const currentBackgrounds = this.sheetBackgrounds(this.currentSheet.id);

      return isEmpty(currentBackgrounds) ? {} : currentBackgrounds[0];
    },
    selectedBackgroundType() {
      if (!isEmpty(this.chosenBackgroundType)) {
        return this.chosenBackgroundType;
      }

      if (isEmpty(this.alreadyAppliedBackground)) {
        const sub = themeOptions.find(t => t.id === this.currentThemeId);

        return {
          ...BACKGROUND_TYPE.THEME,
          value: BACKGROUND_TYPE.THEME.id,
          sub
        };
      }

      const backgroundType = Object.keys(BACKGROUND_TYPE).find(
        k =>
          BACKGROUND_TYPE[k].id === this.alreadyAppliedBackground.property.type
      );

      if (isEmpty(backgroundType)) return { id: '', property: {} };

      return {
        ...BACKGROUND_TYPE[backgroundType],
        value: BACKGROUND_TYPE[backgroundType].id,
        sub: this.getSelectedBackgroundType(BACKGROUND_TYPE[backgroundType].id)
      };
    },
    selectedBackgroundPageType() {
      if (!isEmpty(this.chosenBackgroundPageType)) {
        return this.chosenBackgroundPageType;
      }

      if (isEmpty(this.alreadyAppliedBackground)) {
        const selectedBgPageType = this.isHalfSheet
          ? BACKGROUND_PAGE_TYPE.SINGLE_PAGE
          : BACKGROUND_PAGE_TYPE.FULL_PAGE;

        return {
          ...selectedBgPageType,
          value: selectedBgPageType.id
        };
      }

      const selectedBgPageType = Object.keys(BACKGROUND_PAGE_TYPE).find(k => {
        return (
          BACKGROUND_PAGE_TYPE[k].id ===
          this.alreadyAppliedBackground.property.pageType
        );
      });

      if (!isEmpty(selectedBgPageType)) {
        return {
          ...BACKGROUND_PAGE_TYPE[selectedBgPageType],
          value: BACKGROUND_PAGE_TYPE[selectedBgPageType].id
        };
      }

      const selectedPageType = this.isHalfSheet
        ? BACKGROUND_PAGE_TYPE.SINGLE_PAGE
        : BACKGROUND_PAGE_TYPE.FULL_PAGE;

      return {
        ...selectedPageType,
        value: selectedPageType.id
      };
    },
    selectedBackground() {
      if (!isEmpty(this.chosenBackground)) {
        return this.chosenBackground;
      }

      if (!isEmpty(this.alreadyAppliedBackground)) {
        return this.alreadyAppliedBackground;
      }

      this.chosenBackground =
        this.backgrounds.length > 0
          ? this.backgrounds[0]
          : { id: '', property: {} };

      return this.chosenBackground;
    },
    isDisablePageTypeSelection() {
      return this.isHalfSheet;
    },
    backgrounds() {
      return BACKGROUNDS.filter(b => {
        const { type, categoryId, pageType } = b.property;

        if (type !== this.selectedBackgroundType.id) return false;

        if (categoryId !== this.selectedBackgroundType.sub.id) return false;

        return pageType === this.selectedBackgroundPageType.id;
      });
    }
  },
  watch: {
    selectedToolName(val) {
      if (val && val === TOOL_NAME.BACKGROUNDS) {
        this.initData();
      }
    },
    currentSheet: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.id !== oldVal.id) {
          this.initData();
        }
      }
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
    /**
     * Set up inital data to render in view
     */
    initData() {
      this.chosenBackgroundType = {};
      this.chosenBackgroundPageType = {};
      this.chosenBackground = {};
    },
    /**
     * Get selected background type data by type id
     *
     * @param   {String}  backgroundTypeId  background type id
     * @returns {Object}                    the background data
     */
    getSelectedBackgroundType(backgroundTypeId) {
      if (backgroundTypeId === BACKGROUND_TYPE.THEME.id) {
        return themeOptions.find(
          t => t.id === this.alreadyAppliedBackground.property.categoryId
        );
      }

      if (backgroundTypeId === BACKGROUND_TYPE.CATEGORY.id) {
        const category = Object.keys(BACKGROUND_CATEGORIES).find(
          k =>
            BACKGROUND_CATEGORIES[k].id ===
            this.alreadyAppliedBackground.property.categoryId
        );

        return {
          ...BACKGROUND_CATEGORIES[category],
          value: BACKGROUND_CATEGORIES[category].id
        };
      }

      // TODO: Custom & Favorite
      return null;
    },
    /**
     * Event fire when choose background type
     *
     * @param {Object}  data  data of chosen background type
     */
    onChangeBackgroundType(data) {
      this.chosenBackgroundType = {
        ...data.item,
        sub: data.sub
      };
    },
    /**
     * Event fire when choose background page type
     *
     * @param {Object}  data  data of chosen background page type
     */
    onChangeBackgroundPageType(data) {
      this.chosenBackgroundPageType = data;
    },
    /**
     * Event fire when choose background
     *
     * @param {Object}  data  data of chosen background
     */
    onSelectBackground(data) {
      this.chosenBackground = data;
    },
    /**
     * Trigger hooks to set tool name is empty and then close popover when click Cancel button
     */
    onClose() {
      this.setToolNameSelected('');
    },
    /**
     * Base on section id and sheet id to get page number of sheet
     * @param   {Number}  sectionId Current section id of sheet
     * @param   {Number}  sheetId   Current sheet id
     * @returns {Object}            Page number left and right of sheet
     */
    numberPage(sectionId, sheetId) {
      const sectionIndex = this.book.sections.findIndex(
        item => item.id === sectionId
      );

      if (sectionIndex === 0) {
        return {
          numberPageLeft: 'Back Cover',
          numberPageRight: 'Front Cover'
        };
      }

      const indexSheet = this.book.sections[sectionIndex].sheets.findIndex(
        item => item.id === sheetId
      );

      let indexInSections = 0;

      for (let i = 0; i < sectionIndex; i++) {
        indexInSections += this.book.sections[i].sheets.length;
      }

      indexInSections += indexSheet + 1;

      const pageLeftNumber = indexInSections * 2 - 4;
      const pageRightNumber = indexInSections * 2 - 3;

      return {
        numberPageLeft: `${pageLeftNumber < 10 ? '0' : ''}${pageLeftNumber}`,
        numberPageRight: `${pageRightNumber < 10 ? '0' : ''}${pageRightNumber}`
      };
    },
    /**
     * Trigger mutation to set Background
     */
    applyChosenBackground() {
      const { pageType: selectedPageType } = this.selectedBackground.property;

      const isSinglePageType =
        selectedPageType === BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id;

      if (!this.isHalfSheet && isSinglePageType) {
        const { numberPageLeft, numberPageRight } = this.numberPage(
          this.sectionId,
          this.currentSheet.id
        );

        this.toggleModal({
          isOpenModal: true,
          modalData: {
            type: MODAL_TYPES.BACKGROUND_SELECT_PAGE,
            props: {
              numberPageLeft,
              numberPageRight,
              background: cloneDeep(this.selectedBackground)
            }
          }
        });

        this.onClose();

        return;
      }

      const isAppliedBackground = !isEmpty(this.alreadyAppliedBackground);

      if (isAppliedBackground && isEmpty(this.chosenBackground)) {
        this.onClose();

        return;
      }

      if (isAppliedBackground) {
        const {
          categoryId,
          type,
          pageType
        } = this.alreadyAppliedBackground.property;

        const {
          categoryId: chosenCategoryId,
          type: chosenType,
          pageType: chosenPageType
        } = this.chosenBackground.property;

        if (
          categoryId === chosenCategoryId &&
          type === chosenType &&
          pageType === chosenPageType &&
          this.alreadyAppliedBackground.id === this.chosenBackground.id
        ) {
          this.onClose();

          return;
        }
      }

      this.$root.$emit('printAddBackground', {
        background: cloneDeep(this.selectedBackground),
        isLeft: true
      });

      this.onClose();
    }
  }
};
