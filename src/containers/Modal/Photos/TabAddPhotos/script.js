import { IMAGE_TYPES } from '@/common/constants';

export default {
  data() {
    return {
      imageTypes: IMAGE_TYPES,
      showNotification: false
    };
  },
  methods: {
    /**
     * Get file from entries
     * @param   {Object}  item  id of current book
     * @returns {Object}  File object
     */
    getFile(item) {
      return new Promise(resolve => item.file(resolve));
    },
    /**
     * Get entries form data transfer
     * @param   {Object}  dirReader  id of current book
     * @returns {Object}  Entries object
     */
    getEntries(dirReader) {
      return new Promise(resolve => dirReader.readEntries(resolve));
    },
    /**
     * Traverse file tree
     * @param   {Object}  item  data transfer item
     * @returns {Array} list files data transfer
     */
    async traverseFileTree(item) {
      if (item?.isFile) {
        const file = await this.getFile(item);
        return [file];
      }

      const dirReader = item.createReader();
      const entries = await this.getEntries(dirReader);
      const files = await Promise.all(
        entries.map(async el => {
          if (el?.isFile) {
            const file = await this.getFile(el);
            if (this.checkFileType(file)) {
              return file;
            }
            return null;
          }
        })
      );

      return files.filter(item => {
        return item;
      });
    },
    /**
     * Handle event drop files and folder to div
     */
    async onDrop(e) {
      this.$refs.dropzone.classList.remove('is-dragover');
      const dataTransfer = Object.values(e.dataTransfer.items);
      const readFiles = await Promise.all(
        dataTransfer.map(
          async el => await this.traverseFileTree(el.webkitGetAsEntry())
        )
      );
      const files = readFiles.flat(1);
      this.showNotification = files.some(el => {
        return !this.checkFileType(el);
      });
      if (this.showNotification) return;

      this.handleUploadFiles(files);
    },
    /**
     * Check file type for correct format
     * @param   {Object}  file  file droped
     * @returns {Boolean} file in correct format
     */
    checkFileType(file) {
      const splitName = file.name.split('.');
      const type = `.${splitName[splitName.length - 1].toLowerCase()}`;
      return this.imageTypes.includes(type);
    },
    /**
     * Handle event selected files
     */
    onChangeFile(e) {
      const inputValue = e.target.files || this.$refs.uploadPhoto.files;
      const files = Object.values(inputValue);
      this.handleUploadFiles(files);
    },
    /**
     * Emit constrain value to parent
     *  @param   {Object}  file  selected file
     */
    handleUploadFiles(files) {
      this.$emit('change', files.reverse());
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
