import { clipperFixed } from 'vuejs-clipper';

import Footer from '@/components/Modals/MediaSelection/Footer';
import Control from './Control';
import { getUniqueUrl } from '@/common/utils';

export default {
  components: {
    clipperFixed,
    Control,
    Footer
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    selectedImage: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      scale: 2,
      rotate: 0
    };
  },
  computed: {
    src() {
      if (!this.selectedImage) return '';
      const { originalUrl, imageUrl } = this.selectedImage;
      return getUniqueUrl(originalUrl || imageUrl);
    },
    ratio() {
      if (!this.selectedImage) return 1;
      const { width, height, scaleX, scaleY } = this.selectedImage;
      return (width * scaleX) / (height * scaleY);
    },
    area() {
      if (!this.selectedImage) return 1;
      const { width, height, scaleX, scaleY } = this.selectedImage;
      const objectW = width * scaleX;
      const objectH = height * scaleY;
      const ratio = objectW / objectH;

      if (ratio < 0.5 || ratio > 3) return 70;

      if (ratio < 1 || ratio > 2.5) return 60;

      return ratio > 1.5 ? 50 : 30;
    }
  },
  methods: {
    /**
     * Disable wheel event native
     * @param {Number} scale value of image element
     * @returns new scale value
     */
    handleZoomEvent(scale) {
      return !this.scaleFromSlider ? this.scale : scale;
    },

    /**
     * Handle when zoom image
     * @param {Number} value zoom value of image element
     */
    onZoom(value) {
      this.scaleFromSlider = true;
      this.scale = value / 100;
      this.$refs.clipper.setWH$.next(this.scale);
      this.scaleFromSlider = false;
    },

    /**
     * Handle when rotate image
     * @param {Number} value rotate value of image element
     */
    onRotate(value) {
      this.rotate = value;
    },

    /**
     * Handle after crop image
     */
    onCrop() {
      const canvas = this.$refs.clipper.clip();
      const url = canvas.toDataURL();
      const translate = this.$refs.clipper.bgTL$;
      const cropInfo = {
        rotate: this.rotate,
        scale: this.scale,
        translate
      };
      this.$emit('crop', url, cropInfo);
    },

    /**
     * Cancel crop image
     */
    onCancel() {
      this.$emit('cancel');
    }
  },
  watch: {
    open(val) {
      if (!val) return;

      const { rotate = 0, scale = 2, translate } =
        this.selectedImage?.cropInfo || {};
      this.rotate = rotate;
      this.scale = scale;

      if (!translate) return;

      setTimeout(() => {
        this.$refs?.clipper?.setTL$?.next(translate);
      }, 250);
    }
  }
};
