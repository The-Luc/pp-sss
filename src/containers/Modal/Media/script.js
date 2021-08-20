import MediaViewer from './MediaViewer';
import MediaUploader from './MediaUploader';

export default {
  components: {
    MediaViewer,
    MediaUploader
  },
  props: {
    type: {
      type: String,
      required: true
    },
    isOpenModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpenUploadModal: false,
      isOpenMediaModal: false,
      files: [],
      selectedAlbumId: null
    };
  },
  watch: {
    isOpenModal(val) {
      if (!val) return;

      this.selectedAlbumId = null;
      this.showMediaModal();
    }
  },
  methods: {
    /**
     * Fire when select button on media modal is clicked
     * @param {Array} files list of files selected in media modal
     */
    handleSelectedImages(files) {
      this.$emit('select', files);
    },
    /**
     * Emit an event to close the modal
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * To open uploading modal
     * Fire when user drag or choose a file to upload
     */
    handleUploadingMedia(files) {
      this.files = files;
      this.showUploadModal();
    },
    /**
     *  To set current selected album
     * @param {Number | String} id id of the current selected Album
     */
    setSelectedAlbumId(id) {
      this.selectedAlbumId = id;
    },
    /**
     * To close the modal
     * Fire when cancel button on uploading modal is clicked
     */
    onCancelUploadModal() {
      this.onCancel();
    },
    /**
     * Fire when files are uploaded
     * @param {Number} selectedAlbumId id of the album which just has added media
     */
    onDoneUpload(selectedAlbumId) {
      this.setSelectedAlbumId(selectedAlbumId);
      this.showMediaModal();
    },
    /**
     * To open uploading modal and hide media modal
     */
    showUploadModal() {
      this.isOpenMediaModal = false;
      this.isOpenUploadModal = true;
    },
    /**
     * To open Media modal and hide uploading modal
     */
    showMediaModal() {
      this.isOpenUploadModal = false;
      this.isOpenMediaModal = true;
    }
  }
};
