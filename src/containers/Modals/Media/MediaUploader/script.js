import PpButton from '@/components/Buttons/Button';
import Title from './Title';
import AlbumAutocomplete from '@/components/AlbumAutocomplete';
import { usePhoto } from '@/hooks';
import {
  ICON_LOCAL,
  UPLOADING_PROCESS_STATUS,
  UPLOAD_STATUS_DISPLAY_TIME
} from '@/common/constants';

export default {
  components: {
    PpButton,
    AlbumAutocomplete,
    Title
  },
  setup() {
    const {
      addMediaToAlbum,
      createNewAlbum,
      getAlbums,
      getMyAlbums,
      prepareUpload
    } = usePhoto();

    return {
      addMediaToAlbum,
      createNewAlbum,
      getAlbums,
      getMyAlbums,
      prepareUpload
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
      newAlbumName: 'Untitled'
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
      if (!this.selectedIdOfAlbum) {
        const newAlbum = await this.createNewAlbum(this.newAlbumName);
        this.selectedIdOfAlbum = newAlbum.id;
      }

      this.uploadingStatus = UPLOADING_PROCESS_STATUS.STARTING_UPLOAD;

      await this.prepareUpload();

      this.uploadingStatus = UPLOADING_PROCESS_STATUS.UPLOADING;

      this.numberOfFilesUploaded = 0;

      await this.addMediaToAlbum(this.selectedIdOfAlbum, this.files, () => {
        this.numberOfFilesUploaded++;
      });

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
      this.newAlbumName = 'Untitled';

      const getAlbums = this.getAlbums();
      const getMyAlbums = this.getMyAlbums();

      const [albums, myAlbums] = await Promise.all([getAlbums, getMyAlbums]);

      const myAlbumIds = myAlbums.map(item => item.id);
      this.albums = albums.filter(item => myAlbumIds.includes(item.id));
    }
  }
};
