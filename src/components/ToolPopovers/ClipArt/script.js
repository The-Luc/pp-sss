import PpSelect from '@/components/Selectors/Select';
import PpToolPopover from '../ToolPopover';
import Item from './Item';
import ClipArtType from './ClipArtType';
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
      this.$emit('onChangeClipArtType', clipArtType);
    }
  }
};
