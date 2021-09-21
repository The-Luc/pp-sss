import {
  EVENT_TYPE,
  PLAY_IN_OPTIONS,
  PLAY_OUT_OPTIONS
} from '@/common/constants';
import PropertiesContainer from '@/components/Properties/BoxProperties';
import {
  useAnimation,
  useBackgroundProperties,
  useObjectProperties
} from '@/hooks';
import { isEmpty } from '@/common/utils';
import AnimationBox from './AnimationBox';
import { last } from 'lodash';

export default {
  components: {
    PropertiesContainer,
    AnimationBox
  },
  setup() {
    const { playInIds, playOutIds } = useAnimation();
    const { listObjects } = useObjectProperties();
    const { backgroundsProps, triggerChange } = useBackgroundProperties();

    return {
      playInIds,
      playOutIds,
      listObjects,
      backgroundsProps,
      triggerChange
    };
  },

  data() {
    const playInStyleMapping = PLAY_IN_OPTIONS.reduce(
      (obj, { name, value }) => {
        obj[value] = name;
        return obj;
      },
      {}
    );

    const playOutStyleMapping = PLAY_OUT_OPTIONS.reduce(
      (obj, { name, value }) => {
        obj[value] = name;
        return obj;
      },
      {}
    );

    return {
      playInStyleMapping,
      playOutStyleMapping,
      selectedItem: null
    };
  },

  computed: {
    playInItems() {
      const items = [];

      this.playInIds.forEach((ids, index) => {
        items.push(...this.getAnimaitonData(ids, index, true));
      });

      const background = this.getBackgroundConfig(true);

      if (background) items.unshift(background);

      return items;
    },
    playOutItems() {
      const items = [];

      this.playOutIds.forEach((ids, index) => {
        items.push(...this.getAnimaitonData(ids, index));
      });

      const background = this.getBackgroundConfig();

      if (background) items.push(background);

      return items;
    }
  },

  methods: {
    /**
     * Get animation data from object
     * @param {Object} object parallel object
     * @param {String | Number} order animation order
     * @param {Boolean} isPlayIn play in/out flag
     */
    getAnimaitonData(ids, index, isPlayIn) {
      return ids.map(id => {
        const { animationIn, animationOut } = this.listObjects[id] || {};

        const config = isPlayIn ? animationIn : animationOut;

        const styleMapping = isPlayIn
          ? this.playInStyleMapping
          : this.playOutStyleMapping;

        const style = styleMapping[config?.style] || 'None';

        const name = this.getObjectName(this.listObjects[id]);

        return {
          id,
          name,
          style,
          order: index + 1
        };
      });
    },

    /**
     * Get backgound's animation configuration
     * @param {Boolean} isPlayIn animation play in/out flag
     * @returns background config
     */
    getBackgroundConfig(isPlayIn) {
      const background = this.backgroundsProps?.background;

      if (isEmpty(background)) return null;

      const { animationIn, animationOut, name, id } = background;

      const config = isPlayIn ? animationIn : animationOut;

      const styleMapping = isPlayIn
        ? this.playInStyleMapping
        : this.playOutStyleMapping;

      const style = styleMapping[config?.style] || 'None';

      const order = isPlayIn ? 0 : this.playOutIds.length + 1;

      return { id, name, style, order };
    },

    /**
     * Get name from object data
     * @param {Objec} object Parallel object data
     * @returns
     */
    getObjectName(object) {
      const { name, text, imageUrl } = object || {};

      return name || text || last(imageUrl?.split('/')) || '';
    },

    /**
     * Handle when select animation item
     * @param {String} id parallel object's id
     */
    onSelectObject(id) {
      this.selectedItem = id;
      this.$root.$emit(EVENT_TYPE.ANIMATION_SELECT, id);
    }
  }
};
