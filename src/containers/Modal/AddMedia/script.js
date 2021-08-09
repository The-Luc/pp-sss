import PpButton from '@/components/Buttons/Button';
import AlbumAutocomplete from '@/components/AlbumAutocomplete';
import { getAlbums, getMyAlbums } from '@/api/photo';

export default {
  components: {
    PpButton,
    AlbumAutocomplete
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
      albums: []
    };
  },
  methods: {
    /**
     * Close modal add media
     */
    onCancel() {
      this.$emit('cancel');
    }
  },
  async created() {
    const albums = await getAlbums();
    const myAlbums = await getMyAlbums();
    const myAlbumIds = myAlbums.map(item => item.id);
    this.albums = albums.filter(item => myAlbumIds.includes(item.id));
  }
};
