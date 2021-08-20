import {
  IMAGE_TYPES,
  MEDIA_TYPES,
  IMAGE_NOTIFICATION,
  MEDIA_NOTIFICATION
} from '@/common/constants';

export default {
  data() {
    return {
      isShowNotify: false,
      isDragover: false
    };
  },
  props: {
    isModalMedia: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    mediaTypes() {
      return this.isModalMedia ? MEDIA_TYPES : IMAGE_TYPES;
    },
    notification() {
      return this.isModalMedia ? MEDIA_NOTIFICATION : IMAGE_NOTIFICATION;
    }
  },
  methods: {
    /**
     * Get file from directories
     * @param   {Object}  item  id of current book
     * @returns {Object}  File object
     */
    getFileSyncFromEntry(item) {
      return new Promise(resolve => item.file(resolve));
    },
    /**
     * Get directories from data transfer
     * @param   {Object}  reader  id of current book
     * @returns {Object}  Directories object
     */
    getEntriesSyncFromDir(reader) {
      return new Promise(resolve => reader.readEntries(resolve));
    },
    /**
     * Traverse file tree
     * @param   {Object}  item  data transfer item
     * @returns {Array} list files data transfer
     */
    async getFilesFromDroppedItem(item) {
      const webkitAsEntry = item.webkitGetAsEntry();

      if (webkitAsEntry?.isFile) {
        const file = await this.getFileSyncFromEntry(webkitAsEntry);
        return this.checkValidFile(file) ? [file] : [];
      }

      const entryReader = webkitAsEntry.createReader();

      const entries = await this.getEntriesSyncFromDir(entryReader);

      const validEntries = entries.filter(this.checkValidFile);

      const promises = validEntries.map(this.getFileSyncFromEntry);

      return await Promise.all(promises);
    },
    /**
     * Handle event drop files and folder to div
     */
    async onDrop(e) {
      this.isDragover = false;

      const droppedItems = Object.values(e.dataTransfer.items);

      const promises = droppedItems.map(this.getFilesFromDroppedItem);

      const files = await Promise.all(promises);

      const flattenFiles = [].concat(...files);

      if (!flattenFiles?.length) {
        this.isShowNotify = true;
        return;
      }

      this.handleUploadFiles(flattenFiles);
    },
    /**
     * Check file type for correct format
     * @param   {Object}  file  file droped
     * @returns {Boolean} file in correct format
     */
    checkValidFile(file) {
      const splitName = file.name.split('.');
      const type = `.${splitName[splitName.length - 1].toLowerCase()}`;
      return this.mediaTypes.includes(type);
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
      this.isDragover = true;
    },
    /**
     * Handle event drag leave to div
     */
    onDragLeave() {
      this.isDragover = false;
    }
  }
};
