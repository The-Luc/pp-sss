import Tags from '@/components/Tags';
import GotIt from '@/components/GotIt';
import AlbumItem from '../AlbumItem';
import PopupSelected from '../PopupSelected';

export default {
  components: {
    Tags,
    GotIt,
    AlbumItem,
    PopupSelected
  },
  props: {
    selectedMedia: {
      type: Array,
      default: () => []
    },
    keywords: {
      type: Array,
      default: () => []
    },
    photos: {
      type: Array,
      default: () => []
    },
    isPhotoVisited: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      promptTitle: 'This is your Smartbox',
      promptMsg:
        'As a short cut to help you select the most relevant media, we pre-populate a “Smartbox” tab with photos that match your page/spread and/or section title. We even organize those results into ‘good’, ‘better’, and ‘best’ categories that are based on algorithms that analyze factors such as image quality, ranking, and use.',
      promptMsg2:
        'But don’t worry. If you don’t see what you’re looking for in the Smartbox, you can search for, find, and/or add other media using the additional tabs along the top.'
    };
  },
  computed: {
    numberResult() {
      return this.photos.length + ' results';
    },
    isShowPopupSelected() {
      return this.selectedMedia.length !== 0;
    }
  },
  methods: {
    /**
     * Trigger emit event when click got it
     */
    onClickGotIt() {
      this.$emit('clickGotIt');
    },
    /**
     * Trigger emit event when click keyword
     * @param   {Object}  val  value of keyword
     */
    onClickKeyword(val) {
      this.$emit('clickKeyword', val);
    },
    /**
     * Selected a image and emit parent component
     * @param   {Object}  image  id of current book
     */
    onSelectedMedia(image) {
      this.$emit('change', image);
    }
  }
};
