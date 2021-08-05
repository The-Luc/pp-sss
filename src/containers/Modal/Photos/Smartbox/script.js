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
        'As a short cut to help you select the most relevant media, we pre-populate a “Smartbox” tab with photos that match your page/spread and/or section title. We even organize those results into ‘good’, ‘better’, and ‘best’ categories that are based on algorithms that analyze factors such as image quality, ranking,\n \n \n and use.',
      keywords: [],
      keywordsActive: [],
      photos: []
    };
  },
  mounted() {
    this.createKeyword();
    this.keywordsActive = this.keywords;
  },
  async created() {
    if (isEmpty(this.albums)) {
      this.photos = await getPhotos();
    }
  },
  computed: {
    numberResult() {
      return this.photos.length + ' result';
    }
  },
  methods: {
    createKeyword() {
      const { leftTitle, rightTitle } = this.currentSheet.spreadInfo;
      this.keywords = this.currentSection.name
        .split(' ')
        .concat(leftTitle.split(' '), rightTitle.split(' '));
    },
    /**
     * Trigger mutation set photo visited true for current book
     */
    onClickGotIt() {
      this.setPhotoVisited({ isPhotoVisited: true });
    },
    onClickKeyword(val) {
      if (!val.active) this.keywordsActive.filter(item => item !== val.keyword);
      console.log(this.keywordsActive);
      console.log(val);
    },
    /**
     * Selected a image and emit parent component
     * @param   {Object}  image  id of current book
     */
    onSelectedImage(image) {
      this.$emit('change', image);
    }
  }
};
