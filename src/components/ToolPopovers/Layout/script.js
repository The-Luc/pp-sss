import { differenceBy } from 'lodash';

import PpSelect from '@/components/Selectors/Select';
import PpToolPopover from '../ToolPopover';
import SelectLayout from './SelectLayout';
import SelectTheme from './SelectTheme';
import GotIt from '@/components/GotIt';
import Item from './Item';
import {
  isEmpty,
  isFullLayout,
  isSingleLayout,
  scrollToElement
} from '@/common/utils';
import {
  ASSORTED_TYPE_VALUE,
  CUSTOM_LAYOUT_TYPE,
  LAYOUT_TYPES,
  SUPPLEMENTAL_TYPE_VALUE
} from '@/common/constants';

export default {
  components: {
    PpToolPopover,
    PpSelect,
    Item,
    SelectTheme,
    SelectLayout,
    GotIt
  },
  props: {
    isVisited: {
      type: Boolean,
      default: false
    },
    layouts: {
      type: Array,
      default: () => []
    },
    extraLayouts: {
      type: Array,
      default: () => []
    },
    isPrompt: {
      type: Boolean,
      default: false
    },
    textDisplay: {
      type: Object,
      default: () => ({})
    },
    themesOptions: {
      type: Array,
      default: () => []
    },
    layoutTypes: {
      type: Array,
      default: () => []
    },
    themeSelected: {
      type: Object,
      default: () => ({})
    },
    disabledThemeOpts: {
      type: Boolean,
      default: false
    },
    disabledLayoutOpts: {
      type: Boolean,
      default: false
    },
    layoutTypeSelected: {
      type: Object,
      default: () => ({})
    },
    favoriteLayouts: {
      type: Array,
      default: () => []
    },
    layoutId: {
      type: String,
      default: ''
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    isTranslucentContent: {
      type: Boolean,
      default: false
    },
    isFooterHidden: {
      type: Boolean,
      default: false
    },
    tabIndex: {
      // order of tabs: 0 - double, 1 - single
      type: Number,
      default: 0
    },
    isMappingMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const tabs = [
      {
        label: 'Spread Layouts',
        value: 'spreadLayouts',
        items: []
      },
      {
        label: 'Single Page Layouts',
        value: 'singlePageLayouts',
        items: []
      }
    ];
    return {
      selectedLayout: {},
      isOnPreview: false,
      tabs,
      tabActive: 0, // order of tabs: 0 - double, 1 - single,
      isJustLoadMore: false
    };
  },
  computed: {
    layoutTypeName() {
      return Object.values(LAYOUT_TYPES).find(
        type => type.value === this.layoutTypeSelected.value
      )?.name;
    },
    layoutEmptyLength() {
      if (this.isEmptyTab) return 4;

      if (this.isEmptyLayouts) return 2;

      return 0;
    },
    // true if there is no original layout data
    isEmptyLayouts() {
      return isEmpty(this.tabs[this.tabActive].items);
    },
    // true if there is no original layout and extra layouts (layout of the other themes)
    isEmptyTab() {
      return (
        isEmpty(this.tabs[this.tabActive].items) && !this.shouldShowLoadMore
      );
    },
    shouldShowLoadMore() {
      // only show up if not saved/favorite, assorted, supplemental
      const type = this.layoutTypeSelected.value;
      return (
        type !== ASSORTED_TYPE_VALUE &&
        type !== CUSTOM_LAYOUT_TYPE &&
        type !== SUPPLEMENTAL_TYPE_VALUE &&
        !isEmpty(this.otherLayouts)
      );
    },
    otherLayouts() {
      if (this.isDigital) {
        return differenceBy(this.extraLayouts, this.layouts, 'id');
      }

      const singleLayouts = this.extraLayouts.filter(isSingleLayout);

      const fullLayouts = this.extraLayouts.filter(isFullLayout);

      return differenceBy(
        [fullLayouts, singleLayouts][this.tabActive],
        this.layouts,
        'id'
      );
    }
  },
  watch: {
    layouts: {
      deep: true,
      handler(val) {
        this.setLayoutActive();
        this.updateTabs();

        if (this.isJustLoadMore && val.length > 0)
          this.autoScroll(this.layoutId);
        this.isJustLoadMore = false;
      }
    },
    tabIndex: {
      immediate: true,
      handler(val) {
        this.tabActive = val;
      }
    }
  },
  methods: {
    initData() {
      this.selectedLayout = {};
    },
    /**
     * Fired when GotIt prompt is clicked
     */
    onClickGotIt() {
      this.$emit('onClickGotIt');
    },
    /**
     * Close Layout Popup
     */
    onCancel() {
      this.$emit('onClose');
    },
    /**
     * Toggle preview
     */
    onTogglePreview() {
      this.isOnPreview = !this.isOnPreview;
    },
    /**
     * Fired when select btn clicked
     */
    setThemeLayoutForSheet() {
      this.$emit('setThemeLayoutForSheet', this.selectedLayout);
    },

    /**
     * Fired when theme type changed
     * @param {Object} theme Theme object
     */
    onChangeTheme(theme) {
      this.$emit('onChangeTheme', theme);
    },
    /**
     * Fired when layout type changed
     * @param {Object} layout Layout object
     */
    onChangeLayoutType(layout) {
      this.$emit('onChangeLayoutType', layout);
    },

    /**
     * Event fired when user selecte a layout
     * @param {Object} layout data of layout selected
     */
    onSelectLayout(layout) {
      this.selectedLayout = layout;
    },

    /**
     * Event fired when user click on favorite icon
     * @param {Number} Id Id of the layout wish to save
     */
    onSaveToFavorites({ id, isFavorites }) {
      this.$emit('onSaveToFavorites', { id, isFavorites });
    },
    /**
     * Check if selected layout is in favorite list
     *
     * @param   {String | Number} id  id of selected layout
     * @returns {Boolean}             is selected layout in favorite list
     */
    isInFavorites({ id }) {
      return this.favoriteLayouts.includes(id);
    },
    /**
     * When open layout from creation tool, check sheet has exist layout before or not
     * if any, selected sheet's layout, otherwise selecte the first layout
     */
    setLayoutActive() {
      if (this.layouts.length === 0) return;

      this.selectedLayout = this.layouts[0];

      if (!this.layoutId) return;

      const layout = this.layouts.find(l => l.id === this.layoutId);

      if (layout) this.selectedLayout = layout;
    },
    /**
     * Get layout refs by Id and handle auto scroll
     *
     * @param {Number} layoutId selected layout id
     */
    autoScroll(layoutId) {
      setTimeout(() => {
        const currentLayout = this.$refs[`layout${layoutId}`];

        if (isEmpty(currentLayout)) return;

        scrollToElement(currentLayout[0]?.$el, { block: 'center' });
      }, 20);
    },
    /**
     * To update items array for each tab
     * So that tab content can be loaded correctly corresponding to selected tab.
     */
    updateTabs() {
      if (this.isDigital) {
        this.tabs[0].items = this.layouts;
        return;
      }

      const singleLayouts = this.layouts.filter(isSingleLayout);

      const fullLayouts = this.layouts.filter(isFullLayout);

      this.tabs[0].items = fullLayouts;
      this.tabs[1].items = singleLayouts;
    }
  },
  mounted() {
    this.initData();
    this.setLayoutActive();
    this.updateTabs();
  }
};
