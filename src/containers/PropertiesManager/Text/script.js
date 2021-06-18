import { mapGetters, mapMutations } from 'vuex';

import Properties from '@/components/Properties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import StyleContent from './Style';
import ArrangeContent from '@/components/Arrange';

import { MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { DEFAULT_TEXT } from '@/common/constants';

export default {
  components: {
    Properties,
    GeneralContent,
    StyleContent,
    ArrangeContent,
    TabMenu
  },
  computed: {
    ...mapGetters({
      selectedColor: BOOK_GETTERS.PROP_OBJECT_BY_ID,
      selectedId: BOOK_GETTERS.SELECTED_OBJECT_ID
    })
  },
  watch: {
    selectedId() {
      this.setSelectedBorder();
    }
  },
  data() {
    return {
      borderOptions: [
        {
          name: 'No border',
          value: 'noBorder'
        },
        {
          name: 'Line',
          value: 'line'
        }
      ],
      selectedBorder: {
        name: 'No border',
        value: 'noBorder'
      }
    };
  },
  methods: {
    ...mapMutations({
      setColorPicker: MUTATES.SET_COLOR_PICKER_COLOR
    }),
    /**
     * Close color picker (if opening) when change tab
     */
    onChangeTabMenu(data) {
      if (data === 'style') {
        this.setSelectedBorder();
      }
      this.setColorPicker({
        tabActive: data
      });
    },
    /**
     * Set default selected border
     */
    setSelectedBorder() {
      const border = this.selectedColor({
        id: this.selectedId,
        prop: 'border'
      });
      this.selectedBorder = this.borderOptions[border?.isBorder ? 1 : 0];
    },
    /**
     * Get border option selected and emit to text properties
     * @param {Object} data Border option selected
     */
    changeBorderOption(data) {
      const border = {
        isBorder: data.value !== 'noBorder',
        stroke: DEFAULT_TEXT.BORDER.STROKE,
        strokeDashArray: DEFAULT_TEXT.BORDER.STROKE_DASH_ARRAY,
        strokeLineCap: DEFAULT_TEXT.BORDER.STROKE_LINE_CAP,
        strokeWidth:
          data.value === 'noBorder' ? DEFAULT_TEXT.BORDER.STROKE_WIDTH : 1
      };
      this.$root.$emit('printChangeTextProperties', {
        border
      });
      this.selectedBorder = data;
    }
  }
};
