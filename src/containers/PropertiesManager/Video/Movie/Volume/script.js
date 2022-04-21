import Slider from '@/components/Slider/Slider';

import { useElementProperties } from '@/hooks';

import { isEmpty } from '@/common/utils';

import { DEFAULT_VIDEO, EVENT_TYPE } from '@/common/constants';

export default {
  components: {
    Slider
  },
  setup() {
    const { getProperty } = useElementProperties();

    return { getProperty };
  },
  computed: {
    volume() {
      const volume = this.getProperty('volume');

      return isEmpty(volume) ? DEFAULT_VIDEO.VOLUME : volume;
    }
  },
  methods: {
    /**
     * Handle change value
     *
     * @param {Number} volume - the value returned from slider
     */
    onChange(volume) {
      this.$root.$emit(EVENT_TYPE.CHANGE_VIDEO_PROPERTIES, { volume });
    }
  }
};
