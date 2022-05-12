import Playback from '@/components/Playback';

import { Transition } from '@/common/models';
import { BaseAnimation } from '@/common/models/element';

import { ANIMATION_DIR, OBJECT_TYPE, PLAY_IN_STYLES } from '@/common/constants';
import { isEmpty } from '@/common/utils';

import { useGetDigitalLayouts } from '@/hooks';

export default {
  components: {
    Playback
  },
  props: {
    layout: {
      type: Object,
      default: () => ({})
    },
    selectedLayoutId: {
      type: String,
      default: ''
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    isFavorites: {
      type: Boolean,
      default: false
    },
    isFavoritesDisabled: {
      type: Boolean,
      default: false
    },
    isPreviewDisabled: {
      type: Boolean,
      default: false
    },
    isMappingMode: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { getDigitalLayoutElements } = useGetDigitalLayouts();
    return { getDigitalLayoutElements };
  },
  data() {
    return {
      previewData: [],
      isOnPreview: false
    };
  },
  computed: {
    favoriteData() {
      return {
        iconName: this.isFavorites ? 'favorite' : 'favorite_border',
        cssClass: this.isFavorites ? 'favorites' : ''
      };
    },
    isMappedLayout() {
      return this.isMappingMode && this.layout.mappings;
    }
  },
  methods: {
    /**
     * Emit layout selected to parent
     */
    onClick() {
      this.$emit('click', this.layout);
    },
    /**
     * Emit layout favorite to parent
     *
     * @param {Object}  event fired event
     */
    onSaveToFavorites(event) {
      event.stopPropagation();

      this.$emit('saveToFavorites', {
        id: this.layout.id,
        isFavorites: !this.isFavorites
      });
    },
    /**
     * Preview event
     *
     * @param {Object}  event fired event
     */
    async onPreview(event) {
      event.stopPropagation();

      this.$emit('togglePreview');

      this.previewData = await this.getPreviewData();

      this.isOnPreview = true;
    },
    /**
     * Finish preview event
     */
    onFinishPreview() {
      this.isOnPreview = false;

      this.previewData = [];

      this.$emit('togglePreview');

      this.onClick();
    },
    /**
     * Get preview data
     *
     * @returns Promise<Array> review data
     */
    async getPreviewData() {
      const transition = new Transition({ duration: 1 });

      const layout = await this.getDigitalLayoutElements(this.layout.id);

      return layout.frames.map(({ objects }, index) => {
        if (!isEmpty(layout.frames[index].playInIds))
          return layout.frames[index];

        return {
          id: `${index}`,
          objects: this.getObjectAnimation(objects),
          playInIds: [this.getPlayIn(objects)],
          playOutIds: [],
          delay: 3,
          transition: index < layout.frames.length - 1 ? transition : {}
        };
      });
    },
    /**
     * Get object list with animation
     *
     * @param   {Array} objects element object list
     * @returns {Array}         element object list with animation
     */
    getObjectAnimation(objects) {
      const animationIn = new BaseAnimation({
        style: PLAY_IN_STYLES.FADE_SLIDE_IN,
        direction: ANIMATION_DIR.LEFT_RIGHT
      });

      const animation = { animationIn, animationOut: new BaseAnimation() };

      return objects.map(obj => {
        return obj.type === OBJECT_TYPE.BACKGROUND
          ? obj
          : { ...obj, ...animation };
      });
    },
    /**
     * Get play in order list
     *
     * @param   {Array} objects element object list
     * @returns {Array}         play in order list
     */
    getPlayIn(objects) {
      return objects.map(({ id }) => id);
    }
  }
};
