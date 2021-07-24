import Header from '../ThumbnailHeader';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    Header
  },
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    totalItem: {
      type: Number,
      default: 0
    },
    isToggleContentAvailable: {
      type: Boolean,
      default: false
    },
    isExpanded: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      customCssClass: []
    };
  },
  mounted() {
    const editorCssClass = 'editor';
    const digitalCssClass = this.isDigital ? 'digital' : '';
    const disabledCssClass = this.isEnable ? '' : 'disabled';

    this.customCssClass = [
      editorCssClass,
      digitalCssClass,
      disabledCssClass
    ].filter(c => !isEmpty(c));
  },
  methods: {
    /**
     * Toggle display content by emit to container
     */
    toggleContent() {
      this.$emit('toggleContent');
    }
  }
};
