import { useUpdateAlbum } from '@/views/CreateBook/composables';

const rootName = 'SMS Yearbook 2021';
export default {
  setup() {
    const { updateAlbum } = useUpdateAlbum();
    return {
      updateAlbum
    };
  },
  data() {
    return {
      albumName: rootName,
      isCancel: false
    };
  },
  methods: {
    onCancel() {
      this.albumName = rootName;
      this.isCancel = true;
      this.$refs.nameInput.blur();
    },
    onEnter() {
      this.$refs.nameInput.blur();
    },
    onSubmit() {
      if (this.isCancel) {
        this.isCancel = false;
        return;
      }
      this.updateAlbum({ bookId: 123, title: 'new' }, (res, error) => {
        console.log('res', res);
        console.log('error', error);
        // TODO later
      });
    }
  }
};
