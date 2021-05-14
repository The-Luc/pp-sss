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
    getSections: Array
  },
  computed: {
    sections() {
      return this.getSections.filter(item => {
        return item.order !== 0 && item.id != this.sectionId;
      });
    }
  },
  methods: {
    onChangeMenuMove() {
      this.isShow = !this.isShow;
    }
  }
};
