import PpSelect from '@/components/Selectors/Select';
import PpToolPopover from '../ToolPopover';
import SelectLayout from './SelectLayout';
import SelectTheme from './SelectTheme';
import GotIt from '@/components/GotIt';
import Item from './Item';
import { isEmpty, scrollToElement } from '@/common/utils';

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
    }
  },
  data() {
    return {
      layoutEmptyLength: 4,
      selectedLayout: {},
      isOnPreview: false
    };
  },
  watch: {
    layouts(val) {
      this.setLayoutActive();

      if (val.length > 0) this.autoScroll(this.layoutId);
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
    }
  },
  mounted() {
    this.initData();
    this.setLayoutActive();
  }
};
