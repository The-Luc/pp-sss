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
      searchInput: '',
      firstTime: true,
      clipArtEmptyLength: 6
    };
  },
  computed: {
    isShowSearchInput() {
      return this.chosenClipArtType.value === CLIP_ART_TYPE.SEARCH.id;
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
      this.firstTime = true;
      this.$emit('onChangeClipArtType', clipArtType);
    },
    /**
     * Trigger emit event when input value to search clip art
     * @param {Object}  event event fire when press enter button
     */
    onSearch(event) {
      this.firstTime = false;

      this.searchInput = event.target.value;
      this.$emit('search', this.searchInput);

      event.target.value = ' ';
      event.target.blur();
    }
  }
};
