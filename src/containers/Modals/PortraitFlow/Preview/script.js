import FoldersInfo from './FoldersInfo';
import PreviewThumbnail from './PreviewThumbnail';
import StartPage from './StartPage';
import PreviewInfo from './PreviewInfo';

import BG_SINGLE_PAGE_1 from '@/assets/image/layouts/background/bg-single-page-01.jpg';

import { getPortraitForPage, isEmpty } from '@/common/utils';

export default {
  components: {
    FoldersInfo,
    PreviewThumbnail,
    StartPage,
    PreviewInfo
  },
  props: {
    selectedFolders: {
      type: Array
    },
    requiredPages: {
      type: Array
    },
    displayedPageNo: {
      type: Number
    },
    flowSettings: {
      type: Object
    }
  },
  data() {
    return {
      pages: [1, 2, 3], // TODO: get from current sheet list (implement in another ticket)
      pageNo: '',
      backgroundUrl: '',
      portraits: []
    };
  },
  computed: {
    selectedPages() {
      return this.requiredPages.map(p => {
        // TODO: will get background from API
        return { pageNo: p, backgroundUrl: BG_SINGLE_PAGE_1 };
      });
    },
    startPage() {
      const settingPage = this.flowSettings.startOnPageNumber;

      const startPage = this.pages.find(p => p === settingPage);

      return isEmpty(startPage) ? 1 : startPage;
    },
    layoutSettings() {
      return this.flowSettings.layoutSettings;
    }
  },
  watch: {
    displayedPageNo(value) {
      if (isEmpty(value)) return;

      this.updatePreviewData(value);
    }
  },
  created() {
    this.updatePreviewData(this.displayedPageNo);
  },
  methods: {
    /**
     * Emit new start page to parent
     *
     * @param {Number}  pageNo  selected page
     */
    onStartPageChange({ pageNo }) {
      this.$emit('startPageChange', { pageNo });
    },
    /**
     * Select last page
     *
     * @param {Number}  selectedPage current page number
     */
    onMoveToPreviousPage({ selectedPage }) {
      this.changePage(selectedPage, -1);
    },
    /**
     * Select next page
     *
     * @param {Number}  selectedPage current page number
     */
    onMoveToNextPage({ selectedPage }) {
      this.changePage(selectedPage, 1);
    },
    /**
     * Show preview
     */
    onShowPreview() {
      this.$emit('showPreview');
    },
    /**
     * Select next page
     *
     * @param {Number}  currentPage current page number
     * @param {Number}  nextMove    1 or -1
     */
    changePage(currentPage, nextMove) {
      const currentIndex = this.selectedPages.findIndex(
        ({ pageNo }) => pageNo === currentPage
      );

      if (isEmpty(currentIndex)) return;

      if (nextMove < 0 && currentIndex < 1) return;

      if (nextMove > 0 && currentIndex > this.selectedPages.length - 2) return;

      const nextIndex = currentIndex + nextMove;

      this.updatePreviewData(this.selectedPages[nextIndex].pageNo);
    },
    /**
     * Update preview of selected page
     *
     * @param {Number}  selectedPageNo  selected page number
     */
    updatePreviewData(selectedPageNo) {
      const index = this.selectedPages.findIndex(
        ({ pageNo }) => pageNo === selectedPageNo
      );

      const page = isEmpty(index) ? {} : this.selectedPages[index];

      this.pageNo = page.pageNo;
      this.backgroundUrl = page.backgroundUrl;

      this.portraits = getPortraitForPage(
        index,
        this.flowSettings.layoutSettings.rowCount,
        this.flowSettings.layoutSettings.colCount,
        this.flowSettings.totalPortraitsCount,
        this.selectedFolders
      );
    }
  }
};
