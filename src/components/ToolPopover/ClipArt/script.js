import { mapMutations } from 'vuex';
import PpSelect from '@/components/Selectors/Select';
import PpToolPopover from '@/components/ToolPopover';
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
      type: Number,
      required: true
    },
    clipArts: {
      type: Array,
      required: true
    },
    selectedClipArtId: {
      type: Number,
      required: true
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
     * @param {Number} data - the current clip art type to emit via event payload
     */
    onChangeClipArtType(data) {
      this.$emit('onChangeClipArtType', data);
    }
  }
};
