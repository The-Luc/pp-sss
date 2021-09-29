import Control from './Control';
import Volume from './Volume';
import Trim from './Trim';
import PosterFrame from './PosterFrame';
import Playback from './Playback';
import Animation from '@/components/Properties/Features/Animation';
import {
  useAnimation,
  useElementProperties,
  useObjectProperties
} from '@/hooks';
import {
  EVENT_TYPE,
  OBJECT_TYPE,
  VIDEO_APPLY_OPTIONS
} from '@/common/constants';
import { getOrdeOptions, isEmpty } from '@/common/utils';

export default {
  components: {
    Control,
    Volume,
    Trim,
    PosterFrame,
    Playback,
    Animation
  },
  setup() {
    const { getProperty } = useElementProperties();
    const { playInOrder, playOutOrder } = useAnimation();
    const { listObjects } = useObjectProperties();

    return {
      getProperty,
      playInOrder,
      playOutOrder,
      listObjects
    };
  },
  data() {
    return {
      applyOptions: VIDEO_APPLY_OPTIONS
    };
  },
  computed: {
    playInConfig() {
      return this.getProperty('animationIn') || {};
    },
    playOutConfig() {
      return this.getProperty('animationOut') || {};
    },
    orderOptions() {
      return getOrdeOptions(this.listObjects);
    },
    isPlaying() {
      const isPlaying = this.getProperty('isPlaying');

      return isEmpty(isPlaying) ? false : isPlaying;
    }
  },
  methods: {
    /**
     * Change text property for text box selected
     * @param  {String} color Receive value information to change
     */
    onChange(val) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, val);
    },

    /**
     * Handle apply animation configuration
     * @param {Object} val animation config will be applied to objects
     */
    onApply(val) {
      this.$root.$emit(EVENT_TYPE.APPLY_ANIMATION, {
        objectType: OBJECT_TYPE.VIDEO,
        ...val
      });
    },

    /**
     * Handle change object's animation order
     * @param {Number} order animation order
     */
    onChangeOrder(order) {
      this.$root.$emit(EVENT_TYPE.CHANGE_ANIMATION_ORDER, order);
    },
    /**
     * Emit preview option selected object
     * @param {Object} config preview option
     */
    onClickPreview({ config }) {
      if (this.isPlaying) {
        this.$root.$emit(EVENT_TYPE.VIDEO_TOGGLE_PLAY);
      }

      setTimeout(() => {
        this.$root.$emit(EVENT_TYPE.PREVIEW_ANIMATION, { config });
      });
    }
  }
};
