import PpCombobox from '@/components/Selectors/Combobox';
import Properties from '@/components/Properties/BoxProperties';
import InputTitle from '@/components/Properties/Features/InputTitle';

import { DELAY_OPTION } from '@/common/constants';
import { ICON_LOCAL } from '@/common/constants';
import { useFrame, useFrameTitle, useFrameDelay, useAnimation } from '@/hooks';
import { getValueInput, validateInputOption } from '@/common/utils';
import { useVideo } from '@/views/CreateBook/DigitalEdition/EditScreen/composables';

export default {
  components: {
    PpCombobox,
    Properties,
    InputTitle
  },
  setup() {
    const { currentFrame } = useFrame();
    const { setFrameTitle } = useFrameTitle();
    const { setFrameDelay } = useFrameDelay();
    const { framePlayInDuration, framePlayOutDuration } = useAnimation();
    const { totalVideoDuration } = useVideo();

    return {
      currentFrame,
      setFrameTitle,
      setFrameDelay,
      framePlayInDuration,
      framePlayOutDuration,
      totalVideoDuration
    };
  },
  data() {
    return {
      delayOpts: DELAY_OPTION,
      componentKey: true,
      maxDelay: 3600,
      appendedIcon: ICON_LOCAL.APPENDED_ICON
    };
  },
  computed: {
    frameTitle() {
      return this.currentFrame?.title || '';
    },
    selectedDelay() {
      const delay = this.currentFrame?.delay ?? this.defaultDelay;
      return this.getSelectedOption(delay);
    },
    playInValue() {
      return Math.round(this.framePlayInDuration * 10) / 10 + ' s';
    },
    playOutValue() {
      return Math.round(this.framePlayOutDuration * 10) / 10 + ' s';
    },
    minDelay() {
      return this.totalVideoDuration || 0;
    },
    defaultDelay() {
      return this.totalVideoDuration || 3;
    },
    isVideoExisted() {
      return this.totalVideoDuration > 0;
    }
  },
  watch: {
    totalVideoDuration() {
      this.updateDelayDuration();
    }
  },
  methods: {
    /**
     * Fire when delay is changed
     */
    onChangeDelay(val) {
      const { isValid, value } = validateInputOption(
        getValueInput(val),
        this.minDelay,
        this.maxDelay,
        1,
        [],
        's'
      );

      if (!isValid || this.selectedDelay.value === value) {
        this.forceRenderComponent();
        return;
      }

      this.setFrameDelay({ value });
    },
    /**
     * set value title change
     * @param   {String}  value Value user input
     */
    onChangeTitle(value) {
      this.setFrameTitle({ value });
    },

    /**
     * Get an option from a value
     * @param {Number} value value of a option
     * @returns option object
     */
    getSelectedOption(value) {
      return { name: `${value} s`, value };
    },
    /**
     * Update delay duration if it's less than total video duration
     */
    updateDelayDuration() {
      if (this.selectedDelay.value >= this.totalVideoDuration) return;

      this.setFrameDelay({ value: this.totalVideoDuration });
    },
    /**
     * Trigger render component by changing component key
     */
    forceRenderComponent() {
      this.componentKey = !this.componentKey;
    }
  },
  created() {
    this.updateDelayDuration();
  }
};
