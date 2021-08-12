import PhotoContent from './PhotoContent';

export default {
  components: {
    PhotoContent
  },
  props: {
    isShowAutoflow: {
      type: Boolean,
      default: false
    },
    typeName: {
      type: String,
      default: 'Photos'
    }
  },
  methods: {
    /**
     * Close photo content in sidebar
     */
    closePhotoContent() {
      this.$emit('closePhotoSidebar');
    },
    /**
     * Use to open modal add photos
     */
    openModalAddPhoto() {
      this.$emit('click');
    },
    /**
     * Add photos to canvas by autoflow
     */
    autoflowPhotos() {
      this.$emit('autoflow');
    }
  }
};
