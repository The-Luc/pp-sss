import { mapGetters } from 'vuex';

import Opacity from './Opacity';
import Border from './Border';
import Shadow from './Shadow';
import { GETTERS } from '@/store/modules/book/const';
import { DEFAULT_TEXT } from '@/common/constants';

export default {
  components: {
    Opacity,
    Border,
    Shadow
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
      shadowOptions: [
        {
          name: 'No Shadow',
          value: 'noShadow'
        },
        {
          name: 'Drop Shadow',
          value: 'dropShadow'
        }
      ],
      selectedBorder: {
        name: 'No border',
        value: 'noBorder'
      },
      selectedShadow: {
        name: 'No Shadow',
        value: 'noShadow'
      }
    };
  },
  computed: {
    ...mapGetters({
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedOpacity: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_TEXT_CHANGE
    }),
    opacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const res = this.selectedOpacity({
        id: this.selectedId,
        prop: 'opacity'
      });
      return !res ? 0 : res * 100;
    }
  },
  methods: {
    /**
     * Receive value opacity from children
     * @param   {Number}  value Value user input
     */
    onChangeOpacity(value) {
      this.$root.$emit('printChangeTextProperties', {
        opacity: value / 100
      });
    },
    /**
     * Receive value border from children
     * @param   {Object}  data Value user selecte
     */
    onChangeBorder(data) {
      if (data.value === 'noBorder') {
        this.$root.$emit('printChangeTextProperties', {
          border: {
            stroke: DEFAULT_TEXT.BORDER.STROKE,
            strokeDashArray: DEFAULT_TEXT.BORDER.STROKE_DASH_ARRAY,
            strokeLineCap: DEFAULT_TEXT.BORDER.STROKE_LINE_CAP,
            strokeWidth: DEFAULT_TEXT.BORDER.STROKE_WIDTH
          }
        });
      }
      this.selectedBorder = data;
    },
    /**
     * Receive value shadow from children
     * @param   {Object}  value Value user selecte
     */
    onChangeShadow(value) {
      this.selectedShadow = value;
    }
  }
};
