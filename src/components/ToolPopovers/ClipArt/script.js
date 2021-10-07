import PpSelect from '@/components/Selectors/Select';
import PpToolPopover from '../ToolPopover';
import Item from './Item';
import ClipArtType from './ClipArtType';

import { CLIP_ART_TYPE } from '@/common/constants';

export default {
  components: {
    PpToolPopover,
    PpSelect,
    Item,
    ClipArtType
  },
  props: {
    clipArtTypes: {
      type: Array,
      required: true
    },
    chosenClipArtType: {
      type: Object,
      required: true
    },
    clipArts: {
      type: Array,
      required: true
    },
    selectedClipArtId: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      searchInput: null,
      clipArtEmptyLength: 6
    };
  },
  computed: {
    isShowSearchInput() {
      return this.chosenClipArtType.value === CLIP_ART_TYPE.SEARCH.id;
    }
  },
  watch: {
    chosenClipArtType(newVal, oldVal) {
      if (newVal !== oldVal) this.scrollToTop();
    }
  },
  methods: {
    /**
     * Emit change event to parent component
     * @param {Number} clipArt - the current clip art id to emit via event payload
     */
    selectClipArt(clipArt) {
      this.$emit('selectClipArt', clipArt);
    },
    /**
     * Emit change event to parent component
     */
    onCancel() {
      this.$emit('onCancel');
    },
    /**
     * Emit change event to parent component
     */
    addClipArts() {
      this.$emit('addClipArts');
    },
    /**
     * Emit change event to parent component
     * @param {Number} clipArtType - the current clip art type to emit via event payload
     */
    onChangeClipArtType(clipArtType) {
      this.searchInput = null;
      this.$emit('onChangeClipArtType', clipArtType);
    },
    /**
     * Trigger emit event when input value to search clip art
     * @param {Object}  event event fire when press enter button
     */
    onSearch(event) {
      this.searchInput = event.target.value;
      this.$emit('search', this.searchInput);

      this.scrollToTop();
      event.target.value = ' ';
      event.target.blur();
    },
    /**
     * Auto scroll to top
     */
    scrollToTop() {
      this.$refs?.clipArtContainer?.scrollTo({
        behavior: 'smooth',
        block: 'nearest',
        top: 0
      });
    }
  }
};
