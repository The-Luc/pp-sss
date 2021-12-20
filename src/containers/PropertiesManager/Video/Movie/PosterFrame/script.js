import RangeSlider from '@/components/Slider/RangeSlider';
import MediaModal from '@/containers/Modals/Media';

import { EVENT_TYPE } from '@/common/constants';
import { isEmpty } from '@/common/utils';

import { useElementProperties } from '@/hooks';

export default {
  components: {
    RangeSlider,
    MediaModal
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty,
      isOpenModal: false
    };
  },

  computed: {
    thumbnailUrl() {
      return this.getProperty('customThumbnailUrl');
    },
    isSliderDisplayed() {
      return isEmpty(this.thumbnailUrl);
    }
  },

  methods: {
    /**
     * Fire when user change either ends of range slider
     * @param   {Array}  value of slider
     */
    onSliderChange(value) {
      console.log('slider change ' + value);
    },
    /**
     * To set thumbnail for the current video
     * @param {String} id id of asset that is used as video thumbnail
     */
    handleSelectedImage([{ id }]) {
      this.$root.$emit(EVENT_TYPE.CHANGE_VIDEO_PROPERTIES, {
        customThumbnailId: id
      });
    },
    /**
     * Fire when user click on Select Image button
     */
    onClickSelectImage() {
      this.isOpenModal = true;
    },
    /**
     * Remove thumbnail of the current video
     */
    onRemoveThumbnail() {
      const thumbnailUrl = this.getProperty('thumbnailUrl');

      this.$root.$emit(EVENT_TYPE.CHANGE_VIDEO_PROPERTIES, {
        customThumbnailUrl: '',
        thumbnailUrl
      });
    },
    /**
     * Fire when user close the media modal
     */
    onCloseModal() {
      this.isOpenModal = false;
    }
  }
};
