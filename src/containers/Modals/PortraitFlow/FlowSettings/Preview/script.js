import FoldersInfo from './FoldersInfo';
import PreviewContainer from './PreviewContainer';
import StartPage from './StartPage';
import PreviewInfo from './PreviewInfo';

import { useBackgroundAction, useSheet } from '@/hooks';

import { isEmpty } from '@/common/utils';
import { PORTRAIT_FLOW_OPTION_MULTI } from '@/common/constants';

export default {
  components: {
    FoldersInfo,
    PreviewContainer,
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
    },
    previewPortraitsRange: {
      type: Array,
      required: true
    },
    isDigital: {
      type: Boolean
    }
  },
  setup() {
    const { getPageBackground } = useBackgroundAction();
    const { getSheets } = useSheet();

    return { getPageBackground, getSheets };
  },
  data() {
    return {
      pageNo: 1,
      backgroundUrl: '',
      portraits: [],
      containerName: this.isDigital ? 'Frame' : 'Page'
    };
  },
  computed: {
    selectedPages() {
      return this.requiredPages.map(p => {
        return {
          pageNo: p,
          backgroundUrl: this.getPageBackground(p)
        };
      });
    },
    startPage() {
      const settingPage = this.flowSettings.startOnPageNumber;

      const startPage = this.pages.find(p => p.value === settingPage);

      return isEmpty(startPage) ? { name: 1, value: 1 } : { ...startPage };
    },
    layoutSettings() {
      return this.flowSettings.layoutSettings;
    },
    pages() {
      const totalSheet = Object.values(this.getSheets).length * 2 - 4;
      const pages = Array.from({ length: totalSheet }, (_, i) => i + 1);
      return isEmpty(pages)
        ? [{ name: 1, value: 1 }]
        : pages.map(p => ({ name: p, value: p }));
    }
  },
  watch: {
    displayedPageNo(value) {
      if (isEmpty(value)) return;

      this.updatePreviewData(value);
    },
    flowSettings: {
      deep: true,
      handler() {
        const lastPage = this.requiredPages[this.requiredPages.length - 1];
        const pageNumber = this.pageNo > lastPage ? 1 : this.pageNo;
        this.updatePreviewData(pageNumber);
      }
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
      if (isEmpty(this.selectedPages)) return;

      const index = this.selectedPages.findIndex(
        ({ pageNo }) => pageNo === selectedPageNo
      );

      const page = isEmpty(index) ? {} : this.selectedPages[index];

      this.pageNo = page.pageNo;
      this.backgroundUrl = page.backgroundUrl;

      const { flowMultiSettings, folders } = this.flowSettings;
      const isContinuousFlow =
        flowMultiSettings.flowOption === PORTRAIT_FLOW_OPTION_MULTI.CONTINUE.id;
      const isSingle = folders.length === 1;

      const { min, max, folderIdx } = this.previewPortraitsRange[index];

      if (isSingle || !isContinuousFlow) {
        this.portraits = folders[folderIdx].assets.slice(min, max + 1);
      }

      // case of continuos multi-folders
      const totalPortraits = folders.reduce(
        (acc, p) => acc.concat(p.assets),
        []
      );
      this.portraits = totalPortraits.slice(min, max + 1);
    }
  }
};
