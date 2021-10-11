import {
  EVENT_TYPE,
  OBJECT_TYPE,
  PLAY_IN_OPTIONS,
  PLAY_OUT_OPTIONS
} from '@/common/constants';
import PropertiesContainer from '@/components/Properties/BoxProperties';
import { useAnimation, useObjectProperties } from '@/hooks';
import AnimationBox from './AnimationBox';
import { last } from 'lodash';

export default {
  components: {
    PropertiesContainer,
    AnimationBox
  },
  setup() {
    const { playInIds, playOutIds, triggerChange } = useAnimation();
    const { listObjects } = useObjectProperties();

    return {
      playInIds,
      playOutIds,
      listObjects,
      triggerChange
    };
  },

  data() {
    const objectTypeMapping = {
      [OBJECT_TYPE.BACKGROUND]: 'Background',
      [OBJECT_TYPE.TEXT]: '',
      [OBJECT_TYPE.IMAGE]: 'Image',
      [OBJECT_TYPE.VIDEO]: 'Video',
      [OBJECT_TYPE.PORTRAIT_IMAGE]: 'Image',
      [OBJECT_TYPE.SHAPE]: 'Shape',
      [OBJECT_TYPE.CLIP_ART]: 'Clip Art'
    };
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
      objectTypeMapping,
      selectedItem: null
    };
  },

  computed: {
    playInItems() {
      const items = [];

      this.playInIds.forEach((ids, index) => {
        items.push(...this.getAnimaitonData(ids, index, true));
      });

      return items;
    },
    playOutItems() {
      const items = [];

      this.playOutIds.forEach((ids, index) => {
        items.push(...this.getAnimaitonData(ids, index));
      });

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
        const { animationIn, animationOut, type } = this.listObjects[id] || {};

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
          type: this.objectTypeMapping[type],
          order: index + 1
        };
      });
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
  },
  watch: {
    triggerChange() {
      this.selectedItem = null;
    }
  }
};
