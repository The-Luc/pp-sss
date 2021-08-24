import Footer from '../ModalMediaSelection/Footer';
import { clipperFixed } from 'vuejs-clipper';
import Control from './Control';

export default {
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
  components: {
    clipperFixed,
    Control,
    Footer
  },
  computed: {
    src() {
      if (!this.selectedImage) return '';
      const { originalUrl, imageUrl } = this.selectedImage;
      return originalUrl || imageUrl;
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
      return objectW < objectH ? 50 : 25;
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
      this.$emit('crop', url);
    },

    /**
     * Cancel crop image
     */
    onCancel() {
      this.$emit('cancel');
    }
  }
};
