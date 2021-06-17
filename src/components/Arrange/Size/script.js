import { pxToIn } from '@/common/utils';
import TextFieldProperty from '@/components/TextFieldProperty';
export default {
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    isConstrain: {
      type: Boolean,
      default: false
    }
  },
  components: {
    TextFieldProperty
  },
  computed: {
    widthPt() {
      return pxToIn(this.width);
    },
    heightPt() {
      return pxToIn(this.height);
    }
  }
};
