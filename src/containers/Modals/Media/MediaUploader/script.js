import PpButton from '@/components/Buttons/Button';
import Title from './Title';
import AlbumAutocomplete from '@/components/AlbumAutocomplete';
import {
  ICON_LOCAL,
  UPLOADING_PROCESS_STATUS,
  UPLOAD_STATUS_DISPLAY_TIME
} from '@/common/constants';
import { usePhotos, useUploadAssets } from '@/views/CreateBook/composables';
import { waitMiliseconds } from '@/common/utils';

export default {
  components: {
    PpButton,
    AlbumAutocomplete,
    Title
  },
  setup() {
    const { uploadAssetToAlbum } = useUploadAssets();
    const { getUserAvailableAlbums } = usePhotos();

    return {
      uploadAssetToAlbum,
      getUserAvailableAlbums
    };
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    files: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedIdOfAlbum: null,
      albums: [],
      numberOfFilesUploaded: 0,
      iconSuccess: ICON_LOCAL.SUCCESS,
      uploadingStatus: UPLOADING_PROCESS_STATUS.SELECT_ALBUM,
      newAlbumName: null
    };
  },
  computed: {
    isAlbumSelectionProcess() {
      return this.uploadingStatus === UPLOADING_PROCESS_STATUS.SELECT_ALBUM;
    },
    isUploadingStartProcess() {
      return this.uploadingStatus === UPLOADING_PROCESS_STATUS.STARTING_UPLOAD;
    },
    isUploadingProcess() {
      return this.uploadingStatus === UPLOADING_PROCESS_STATUS.UPLOADING;
    },
    isUploadCompleteProcess() {
      return this.uploadingStatus === UPLOADING_PROCESS_STATUS.UPLOADED_SUCCESS;
    },
    modalHeader() {
      return this.isAlbumSelectionProcess ? 'Add Media' : 'Adding Media';
    },
    isAddMediaButtonDisabled() {
      return !this.newAlbumName && !this.selectedIdOfAlbum;
    }
  },
  watch: {
    isOpenModal(val) {
      if (!val) return;

      this.initData();
    }
  },
  methods: {
    /**
     * Close modal add media
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Select album and add media to it
     * @param   {Number}  id  id of selected album
     */
    onChangeSelect(id) {
      this.selectedIdOfAlbum = id;
    },
    /**
     * Create new album and add media to it
     * @param   {String}  albumName  name of new album
     */
    async onCreateNewAlbum(albumName) {
      this.newAlbumName = albumName;
      this.selectedIdOfAlbum = null;
    },
    /**
     * Flow add media add media to selected album
     */
    async onAddMedia() {
      if (this.isAddMediaButtonDisabled) return;

      this.uploadingStatus = UPLOADING_PROCESS_STATUS.STARTING_UPLOAD;

      await waitMiliseconds(1000);

      this.uploadingStatus = UPLOADING_PROCESS_STATUS.UPLOADING;

      this.numberOfFilesUploaded = 0;

      const numOfFiles = this.files.length;

      const handler = setInterval(() => {
        if (this.numberOfFilesUploaded < numOfFiles - 1) {
          this.numberOfFilesUploaded++;
        }
      }, 1000);

      const updatedAlbum = await this.uploadAssetToAlbum(
        this.selectedIdOfAlbum,
        this.files,
        this.newAlbumName || 'Untitled'
      );

      clearInterval(handler);
      this.numberOfFilesUploaded = numOfFiles;

      this.selectedIdOfAlbum = updatedAlbum.id;

      await this.finisingUpload();

      this.hideUploadMediaModal();
    },
    /**
     * Finish upload process
     */
    finisingUpload() {
      return new Promise(resolve =>
        setTimeout(() => {
          this.uploadingStatus = UPLOADING_PROCESS_STATUS.UPLOADED_SUCCESS;
          resolve();
        }, UPLOAD_STATUS_DISPLAY_TIME)
      );
    },
    /**
     * Hide upload media modal
     */
    hideUploadMediaModal() {
      return new Promise(resolve =>
        setTimeout(() => {
          this.$emit('onDoneUpload', this.selectedIdOfAlbum);

          resolve();
        }, UPLOAD_STATUS_DISPLAY_TIME)
      );
    },
    async initData() {
      this.selectedIdOfAlbum = null;
      this.albums = [];
      this.numberOfFilesUploaded = 0;
      this.iconSuccess = ICON_LOCAL.SUCCESS;
      this.uploadingStatus = UPLOADING_PROCESS_STATUS.SELECT_ALBUM;
      this.newAlbumName = null;

      this.albums = await this.getUserAvailableAlbums();
    }
  }
};
