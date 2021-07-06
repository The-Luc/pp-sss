import PpSelect from '@/components/Selectors/Select';
import { PAGE_NUMBER_POSITION } from '@/common/constants';
export default {
  components: {
    PpSelect
  },
  props: {
    titleName: {
      type: String,
      default: ''
    },
    isCover: {
      type: Boolean,
      default: true
    },
    isSiglePage: {
      type: Boolean,
      default: true
    },
    isLeftNumberOn: {
      type: Boolean,
      required: true
    },
    isRightNumberOn: {
      type: Boolean,
      required: false
    },
    position: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      statusPageNumber: [
        { name: 'On', value: true },
        { name: 'Off', value: false }
      ],
      positionPageNumber: [
        { name: 'Bottom Center', value: PAGE_NUMBER_POSITION.BOTTOM_CENTER },
        {
          name: 'Bottom Outside Corners',
          value: PAGE_NUMBER_POSITION.BOTTOM_OUTSIDE_CORNERS
        }
      ]
    };
  },
  computed: {
    selectedPosition() {
      if (this.position === PAGE_NUMBER_POSITION.BOTTOM_CENTER) {
        return {
          name: 'Bottom Center',
          value: PAGE_NUMBER_POSITION.BOTTOM_CENTER
        };
      } else {
        return {
          name: 'Bottom Outside Corners',
          value: PAGE_NUMBER_POSITION.BOTTOM_OUTSIDE_CORNERS
        };
      }
    },
    selectedLeftNumber() {
      if (this.isLeftNumberOn) {
        return { name: 'On', value: true };
      } else {
        return { name: 'Off', value: false };
      }
    },
    selectedRightNumber() {
      if (this.isRightNumberOn) {
        return { name: 'On', value: true };
      } else {
        return { name: 'Off', value: false };
      }
    }
  },
  methods: {
    onChangeStatusLeft(val) {
      console.log(val);
    },
    onChangeStatusRight(val) {
      console.log(val);
    },
    onChangePosition(val) {
      console.log(val);
    }
  }
};
