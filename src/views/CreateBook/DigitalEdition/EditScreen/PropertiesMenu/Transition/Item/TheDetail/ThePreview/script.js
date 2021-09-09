import GroupItem from '../GroupItem';

import { useFrameAction } from '@/hooks';

import { isEmpty } from '@/common/utils';

import { EVENT_TYPE, IMAGE_LOCAL } from '@/common/constants';

export default {
  components: {
    GroupItem
  },
  props: {
    transitionIndex: {
      type: Number
    },
    transition: {
      type: Number
    },
    direction: {
      type: [Number, String]
    },
    duration: {
      type: [Number, String]
    }
  },
  setup() {
    const { getPreviewUrlByIndex } = useFrameAction();

    return {
      getPreviewUrlByIndex
    };
  },
  methods: {
    /**
     * Preview transition by emit event
     */
    onPreview() {
      this.$root.$emit(EVENT_TYPE.TRANSITION_PREVIEW, {
        transition: this.transition,
        direction: this.direction,
        duration: this.duration,
        previewUrl1: this.getUrl(this.transitionIndex),
        previewUrl2: this.getUrl(this.transitionIndex + 1)
      });
    },
    /**
     * Get the url of preview image
     *
     * @param   {Number}  index index of frame
     * @returns {String}        preview image ulr
     */
    getUrl(index) {
      const url = this.getPreviewUrlByIndex(index);

      return isEmpty(url) ? IMAGE_LOCAL.EMPTY_PREVIEW_FRAME : url;
    }
  }
};
