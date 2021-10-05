import { SHEET_TYPE } from '@/common/constants';
import CommonModal from '@/components/Modals/CommonModal';
import MoveControl from '@/components/Icon/MoveControl';
import PpSelect from '@/components/Selectors/Select';

export default {
  components: { CommonModal, MoveControl, PpSelect },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    sections: {
      type: Array
    },
    previewedSheetId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      sheetIndex: 0
    };
  },
  computed: {
    isPosibleToNext() {
      return this.sheetIndex < this.sheetOptions.length - 1;
    },
    isPosibleToBack() {
      return this.sheetIndex > 0;
    },
    sheets() {
      return this.sections.reduce((rs, item) => {
        return rs.concat(item.sheets);
      }, []);
    },
    sheetOptions() {
      return this.sheets.map(item => {
        const name = this.getNameOptions(
          item.type,
          item.pageLeftName,
          item.pageRightName
        );
        return {
          value: item.id,
          name
        };
      });
    },
    selectedVal() {
      return this.sheetOptions[this.sheetIndex];
    },
    currentSheet() {
      return this.sheets[this.sheetIndex];
    },
    isHaftRight() {
      return this.currentSheet.type === SHEET_TYPE.FRONT_COVER;
    },
    isHaftLeft() {
      return this.currentSheet.type === SHEET_TYPE.BACK_COVER;
    }
  },
  methods: {
    /**
     * Close print preview modal
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Back selected page
     */
    onBack() {
      this.sheetIndex -= 1;
    },
    /**
     * Next selected page
     */
    onNext() {
      this.sheetIndex += 1;
    },
    /**
     * Change selected page
     * @param  {Number} value selected page id
     */
    onChange({ value }) {
      this.sheetIndex = this.sheetOptions.findIndex(
        item => item.value === value
      );
    },
    /**
     * Get name option of page
     * @param  {String} type page's type selected
     * @param  {String} pageLeftName page left name
     * @param  {String} pageRightName page left name
     */
    getNameOptions(type, pageLeftName, pageRightName) {
      const leftName = Number(pageLeftName);
      const rightName = Number(pageRightName);

      const name = {
        [SHEET_TYPE.COVER]: 'Cover',
        [SHEET_TYPE.BACK_COVER]: leftName,
        [SHEET_TYPE.FRONT_COVER]: rightName,
        [SHEET_TYPE.NORMAL]: `${leftName} / ${rightName}`
      };

      return name[type];
    }
  },
  created() {
    this.onChange({ value: this.previewedSheetId });
  }
};
