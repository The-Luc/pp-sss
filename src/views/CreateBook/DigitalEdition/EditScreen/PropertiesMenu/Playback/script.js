import BoxProperties from '@/components/Properties/BoxProperties';

import Item from './Item';

import { useFrame, useSheet } from '@/hooks';

import { mergeArrayNonEmpty } from '@/common/utils';

import {
  EVENT_TYPE,
  PLAYBACK_DEFAULT_OPTIONS,
  PLAYBACK_FRAME_OPTION
} from '@/common/constants';

export default {
  components: {
    BoxProperties,
    Item
  },
  setup() {
    const { currentSheet } = useSheet();
    const { frames } = useFrame();

    return {
      currentSheet,
      frames
    };
  },
  data() {
    return {
      //
    };
  },
  computed: {
    items() {
      const frameOptions = this.frames.map(({ id }, index) => {
        return {
          ...PLAYBACK_FRAME_OPTION,
          name: `${PLAYBACK_FRAME_OPTION.name}${index + 1}`,
          frameId: id
        };
      });

      return mergeArrayNonEmpty(PLAYBACK_DEFAULT_OPTIONS, frameOptions);
    }
  },
  methods: {
    /**
     * Select playback type
     *
     * @param {Number}          value   playback type
     * @param {Number | String} frameId id of selected frame to play
     */
    onSelect({ value, frameId }) {
      this.$root.$emit(EVENT_TYPE.PLAYBACK, { playType: value, frameId });
    }
  }
};
