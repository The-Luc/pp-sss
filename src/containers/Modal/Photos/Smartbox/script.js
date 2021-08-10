import Tags from '@/components/Tags';
import GotIt from '@/components/GotIt';
import AlbumItem from '../AlbumItem';
import PopupSelected from '../PopupSelected';

import { usePhotos } from '@/views/CreateBook/composables';
import { useGetterPrintSheet, useSheet, useBookName } from '@/hooks';
import { getPhotos } from '@/api/photo';

export default {
  components: {
    Tags,
    GotIt,
    AlbumItem,
    PopupSelected
  },
  props: {
    selectedImages: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const { currentSection } = useGetterPrintSheet();
    const { currentSheet } = useSheet();
    const { isPhotoVisited, setPhotoVisited } = usePhotos();
    const { generalInfo } = useBookName();

    return {
      isPhotoVisited,
      setPhotoVisited,
      currentSection,
      currentSheet,
      generalInfo
    };
  },
  data() {
    return {
      promptTitle: 'This is your Smartbox',
      promptMsg:
        'As a short cut to help you select the most relevant media, we pre-populate a “Smartbox” tab with photos that match your page/spread and/or section title. We even organize those results into ‘good’, ‘better’, and ‘best’ categories that are based on algorithms that analyze factors such as image quality, ranking, and use.',
      promptMsg2:
        'But don’t worry. If you don’t see what you’re looking for in the Smartbox, you can search for, find, and/or add other media using the additional tabs along the top.',
      keywords: [],
      photos: []
    };
  },
  async created() {
    this.getListKeywords();
    const keywords = this.keywords.map(keyword => keyword.value);
    this.photos = await getPhotos(keywords);
  },
  computed: {
    numberResult() {
      return this.photos.length + ' results';
    },
    isShowPopupSelected() {
      return this.selectedImages.length !== 0;
    }
  },
  methods: {
    /**
     * Trigger mutation set photo visited true for current book
     */
    onClickGotIt() {
      this.setPhotoVisited({ isPhotoVisited: true });
    },
    /**
     * Set status active of keyword when click
     */
    async onClickKeyword(val) {
      val.active = !val.active;
      const activeKeywords = this.keywords.reduce((arr, keyword) => {
        if (keyword.active) {
          arr.push(keyword.value);
        }
        return arr;
      }, []);
      this.photos = await getPhotos(activeKeywords);
    },
    /**
     * Selected a image and emit parent component
     * @param   {Object}  image  id of current book
     */
    onSelectedImage(image) {
      this.$emit('change', image);
    },
    /**
     * Get list keyword from section name, left, right, spread title
     */
    getListKeywords() {
      const { leftTitle, rightTitle } = this.currentSheet.spreadInfo;
      const projectTitle =
        this.currentSection.name === 'Cover' ? this.generalInfo.title : '';

      this.keywords = [
        leftTitle,
        rightTitle,
        this.currentSection.name,
        projectTitle
      ]
        .join(' ')
        .split(' ')
        .filter(Boolean)
        .map(keyword => ({
          value: keyword,
          active: true
        }));
    }
  }
};
