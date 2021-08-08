import AlbumItem from '../AlbumItem';
import PopupSelected from '../PopupSelected';
import { searchPhotos } from '@/api/photo';

export default {
  components: {
    AlbumItem,
    PopupSelected
  },
  props: {
    selectedImages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      input: '',
      photos: [],
      firstTime: true
    };
  },
  computed: {
    isShowPopupSelected() {
      return this.selectedImages.length !== 0;
    },
    numberResult() {
      return this.photos.length + ' matches';
    }
  },
  methods: {
    /**
     * To search image base on value input
     * @param {Object}  event event fire when press enter button
     */
    async onSearch(event) {
      this.firstTime = false;

      this.input = event.target.value;
      this.photos = await searchPhotos(this.input);

      this.onBlur(event);
    },
    /**
     * Selected a image and emit parent component
     * @param   {Object}  image image seleted
     */
    onSelectedImage(image) {
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
