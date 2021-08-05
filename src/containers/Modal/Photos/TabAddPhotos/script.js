import { IMAGE_TYPE } from '@/common/constants';

export default {
  data() {
    return {
      uploadedFiles: [],
      imageType: IMAGE_TYPE,
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
        item => !this.imageType.includes(item.type)
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
