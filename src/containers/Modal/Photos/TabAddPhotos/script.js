import { IMAGE_TYPES } from '@/common/constants';

export default {
  data() {
    return {
      uploadedFiles: [],
      imageTypes: IMAGE_TYPES,
      isShowNotify: false
    };
  },
  methods: {
    /**
     * Handle event drop images
     */
    onChangeFile(e) {
      this.$refs.dropzone.classList.remove('is-dragover');
      const inputValue =
        e.target.files || e.dataTransfer.files || this.$refs.uploadPhoto.files;
      const files = Object.values(inputValue);

      this.isShowNotify = files.some(
        item => !this.imageTypes.includes(item.type)
      );

      if (this.isShowNotify) return;

      this.uploadedFiles = files.reverse();
    },
    /**
     * Handle event drag enter to div
     */
    onDragEnter() {
      this.$refs.dropzone.classList.add('is-dragover');
    },
    /**
     * Handle event drag leave to div
     */
    onDragLeave() {
      this.$refs.dropzone.classList.remove('is-dragover');
    }
  }
};
