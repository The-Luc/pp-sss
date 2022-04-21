import MoveSheet from './MoveSheet';

export default {
  components: {
    MoveSheet
  },
  data() {
    return {
      isShow: false
    };
  },
  props: {
    sectionId: {
      type: [Number, String],
      default: ''
    },
    sheetId: {
      type: [Number, String],
      default: ''
    },
    sections: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onChangeMenuMove() {
      this.isShow = !this.isShow;
    },
    onCloseMenuMove() {
      this.isShow = false;
    }
  }
};
