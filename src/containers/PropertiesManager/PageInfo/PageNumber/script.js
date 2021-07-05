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
    statusPageLeft: {
      type: String,
      default: 'On/Off:'
    },
    statusPageRight: {
      type: String,
      default: 'On/Off:'
    },
    isCover: {
      type: Boolean,
      default: true
    },
    isSiglePage: {
      type: Boolean,
      default: true
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
