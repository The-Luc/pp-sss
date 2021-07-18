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
    sectionId: Number,
    sheetId: Number,
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
