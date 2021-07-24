import { useImageStyle } from '@/hooks/style';
import SavedImageStylePopover from './SavedImageStylePopover';

export default {
  components: {
    SavedImageStylePopover
  },
  setup() {
    const { savedImageStyles, getSavedImageStyles } = useImageStyle();
    return { savedImageStyles, getSavedImageStyles };
  },
  data() {
    return {
      isShowDropdown: false,
      showSavedStylePopup: false
    };
  },
  props: {
    options: {
      type: Array,
      require: true
    },
    styleSelected: {
      type: Number,
      default: null
    }
  },
  computed: {
    imageStyleOptions() {
      return this.options.slice(0, 4);
    },
    customOptions() {
      return [...this.options, ...this.savedImageStyles];
    }
  },
  methods: {
    /**
     * Open dropdown image style
     */
    onOpenDropdown() {
      if (this.savedImageStyles?.length) {
        this.showSavedStylePopup = true;
        return;
      }
      this.isShowDropdown = true;
    },
    /**
     * Close dropdown image style
     */
    onCloseDropdown() {
      this.showSavedStylePopup = false;
      this.isShowDropdown = false;
    },
    /**
     * Emit change image style to parent component
     * @param {Number} item - image style
     */
    onSelect(item) {
      if (item?.id !== this.styleSelected) {
        this.$emit('onSelectImageStyle', item);
      }
      this.onCloseDropdown();
    }
  },
  created() {
    this.getSavedImageStyles();
  }
};
