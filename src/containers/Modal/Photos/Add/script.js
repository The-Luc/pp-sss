export default {
  data() {
    return {
      uploadedFiles: [],
      acceptInput: [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/heic',
        'image/gif'
      ],
      notifyContent: ''
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
      const files = [];
      for (const item of inputValue) {
        if (!this.acceptInput.includes(item.type)) {
          this.notifyContent =
            'Invalid files. Only files with the following extensions are allowed: PNG, JPG/JPEG, HEIC and GIF.';
          return;
        }
        files.push(item);
      }
      this.notifyContent = '';
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
