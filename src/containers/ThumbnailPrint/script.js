import { mapGetters } from 'vuex';

import { LINK_STATUS, SHEET_TYPE } from '@/common/constants';
import { useDrawLayout } from '@/hooks';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

export default {
  setup() {
    const { drawLayout } = useDrawLayout();
    return {
      drawLayout
    };
  },
  props: {
    numberPage: {
      type: Object,
      default: () => {
        return {
          numberLeft: 'Back Cover',
          numberRight: 'Front Cover'
        };
      }
    },
    sheet: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      default: true
    },
    isShowLink: {
      type: Boolean,
      default: true
    },
    toLink: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      default: '10px'
    },
    canvasHeight: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      objCanvas: null
    };
  },
  computed: {
    ...mapGetters({
      sheets: PRINT_GETTERS.GET_SHEETS
    }),
    thumbnailUrl() {
      if (this.sheet?.id && Object.keys(this.sheets).length > 0) {
        return this.sheets[this.sheet.id]?.thumbnailUrl || null;
      }
    }
  },
  created() {
    this.LINK_STATUS = LINK_STATUS;
    this.SHEET_TYPE = SHEET_TYPE;
  },
  methods: {
    /**
     * Emit event change link status
     */
    changeLinkStatus() {
      this.$emit('change');
    }
  }
};
