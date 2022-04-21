import AlbumItem from '../AlbumItem';
import PopupSelected from '../PopupSelected';

export default {
  components: {
    AlbumItem,
    PopupSelected
  },
  props: {
    selectedMedia: {
      type: Array,
      default: () => []
    },
    photos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      input: '',
      firstTime: true
    };
  },
  computed: {
    isShowPopupSelected() {
      return this.selectedMedia.length !== 0;
    },
    numberResult() {
      return this.photos.length + ' matches';
    }
  },
  methods: {
    /**
     * Trigger emit event when input value to search image
     * @param {Object}  event event fire when press enter button
     */
    onSearch(event) {
      this.firstTime = false;

      this.input = event.target.value;
      this.$emit('search', this.input);

      this.onBlur(event);
    },
    /**
     * Selected a image and emit parent component
     * @param   {Object}  image image seleted
     */
    onSelectedMedia(image) {
      this.$emit('change', image);
    },
    /**
     * To blur an input and set empty value
     * @param {Object}  event event fire when press enter button
     */
    onBlur(event) {
      event.target.value = ' ';
      event.target.blur();
    }
  }
};
