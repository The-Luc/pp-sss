import { mapGetters } from 'vuex';
import MoveSheet from './MoveSheet';

export default {
  components: {
    MoveSheet
  },
  data() {
    return {
      isShow: false
    }
  },
  props: {
    sectionId: String
  },
  computed: {
    ...mapGetters('book', [
      'getSections',
    ]),
    sections() {
      return this.getSections.filter(item => {
        return item.order !== 0 && item.id != this.sectionId;
      })
    }
  },
  methods: {
    onChangeMenuMove() {
      this.isShow = !this.isShow
    }
  }
};
