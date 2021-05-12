import Item from './item';

export default {
  components: {
    Item
  },
  data() {
    return {
      isShow: false
    }
  },
  method: {
    onChangeMenuSheet() {
      console.log(1);
      // this.isShow = !this.isShow
    }
  }
};
