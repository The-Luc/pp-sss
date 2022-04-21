import { clipperFixed } from 'vuejs-clipper';

import Footer from '@/components/Modals/MediaSelection/Footer';
import Control from './Control';
import { modifyUrl } from '@/common/utils';

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
      scale: 1,
      rotate: 0
    };
  },
  computed: {
    src() {
      if (!this.selectedImage) return '';
      const { originalUrl, imageUrl } = this.selectedImage;
      return modifyUrl(originalUrl || imageUrl);
    },
    ratio() {
      if (!this.selectedImage) return 1;
      const { width, height, scaleX, scaleY } = this.selectedImage;
      return (width * scaleX) / (height * scaleY);
    },
    area() {
      return this.ratio < 1 ? 90 : 50;
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
    },
    /**
     * To calculate clipping dimenstion (white box area)
     *
     * @returns clipping area dimension
     */
    getClipDimension() {
      const { clientHeight, clientWidth } = this.$refs['body'];

      let clipWidth, clipHeight;

      if (this.ratio >= 1) {
        clipWidth = (this.area / 100) * clientWidth;
        clipHeight = clipWidth / this.ratio;
      } else {
        clipHeight = (this.area / 100) * clientHeight;
        clipWidth = clipHeight * this.ratio;
      }

      return { clipWidth, clipHeight };
    }
  },
  watch: {
    open(val) {
      if (!val) return;

      const { rotate = 0, scale, translate } =
        this.selectedImage?.cropInfo || {};
      this.rotate = rotate;

      setTimeout(() => {
        const { clientWidth } = this.$refs['body'];

        const imageRatio = this.$refs?.clipper?.imgRatio;

        const { clipWidth, clipHeight } = this.getClipDimension();
        const imageWidth = clientWidth;
        const imageHeight = imageWidth / imageRatio;

        const calScale = Math.max(
          clipWidth / imageWidth,
          clipHeight / imageHeight
        );

        this.scale = scale || calScale + 0.1; // 0.1 is padding for cropping area

        translate && this.$refs?.clipper?.setTL$?.next(translate);
        this.scale && this.$refs?.clipper?.setWH$?.next(this.scale);
      }, 250);
    }
  }
};
