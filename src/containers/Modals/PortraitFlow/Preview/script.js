import FoldersInfo from './FoldersInfo';
import PreviewThumbnail from './PreviewThumbnail';
import StartPage from './StartPage';
import PreviewInfo from './PreviewInfo';

export default {
  components: {
    FoldersInfo,
    PreviewThumbnail,
    StartPage,
    PreviewInfo
  },
  props: {
    selectedFolders: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pages: [
        { name: 1, value: 1 },
        { name: 2, value: 2 }
      ],
      currentPage: { name: 2, value: 2 }
    };
  }
};
