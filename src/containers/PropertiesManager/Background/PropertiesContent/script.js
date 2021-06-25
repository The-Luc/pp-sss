import Properties from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import Opacity from '@/components/Properties/Features/Opacity';
import Flip from '@/components/Arrange/Flip';
import Remove from '../Remove';

export default {
  components: {
    Properties,
    TabMenu,
    Opacity,
    Flip,
    Remove
  },
  props: {
    opacity: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isLeft: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * Fire when opacity is changed from opacity component
     *
     * @param {Number}  opacity - the opacity data
     */
    onChangeOpacity(opacity) {
      this.$emit('opacityChange', { isLeft: this.isLeft, opacity });
    },
    /**
     * Fire when remove button is click from component
     */
    onClickRemove() {
      this.$emit('remove', this.isLeft);
    }
  }
};
