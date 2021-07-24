import { SHEET_TYPE } from '@/common/constants';

export default {
  props: {
    toLink: {
      type: String,
      default: ''
    },
    sheetType: {
      type: [String, Number],
      default: SHEET_TYPE.NORMAL
    },
    thumbnailUrl: {
      type: String
    },
    customCssClass: {
      type: Array,
      default: () => []
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isEditIconDisplayed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    contentCssClass() {
      return [
        this.getHalfSheetCssClass(),
        this.isActive && 'active',
        ...this.customCssClass
      ];
    }
  },
  methods: {
    /**
     * Get css class if current sheet is half sheet
     */
    getHalfSheetCssClass() {
      if (this.sheetType === SHEET_TYPE.FRONT_COVER) return 'half-right';

      if (this.sheetType === SHEET_TYPE.BACK_COVER) return 'half-left';

      return '';
    }
  }
};
