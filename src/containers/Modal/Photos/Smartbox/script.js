import Tags from '@/components/Tags';
import GotIt from '@/components/GotIt';
import AlbumItem from '../AlbumItem';

import { usePhoto } from '@/views/CreateBook/composables';
import { useGetterPrintSheet, useSheet } from '@/hooks';
import { getPhotos } from '@/api/photo';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Tags,
    GotIt,
    AlbumItem
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
    const { isPhotoVisited, setPhotoVisited } = usePhoto();

    return {
      isPhotoVisited,
      setPhotoVisited,
      currentSection,
      currentSheet
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
    if (isEmpty(this.photos)) {
      this.getListkeywords();
      this.photos = await getPhotos(this.keywords);
    }
  },
  computed: {
    numberResult() {
      return this.photos.length + ' results';
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
      const activeKeywords = this.keywords.filter(keyword => keyword.active);
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
    getListkeywords() {
      const { leftTitle, rightTitle } = this.currentSheet.spreadInfo;
      this.keywords = [leftTitle, rightTitle, this.currentSection.name]
        .join(' ')
        .split(' ')
        .filter(Boolean)
        .map(keyword => ({
          value: keyword,
          active: true
        }));
    }
  },
  watch: {
    currentSheet() {
      this.getListkeywords();
    }
  }
};
