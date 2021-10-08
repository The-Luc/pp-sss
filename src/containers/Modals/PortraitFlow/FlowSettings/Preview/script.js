import FoldersInfo from './FoldersInfo';
import PreviewContainer from './PreviewContainer';
import StartPage from './StartPage';
import PreviewInfo from './PreviewInfo';

import { useBackgroundAction, useSheet, useFrame } from '@/hooks';

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
    const { getPageBackground, getFrameBackground } = useBackgroundAction();
    const { getSheets } = useSheet();
    const { frameIds } = useFrame();

    return { getPageBackground, getFrameBackground, getSheets, frameIds };
  },
  data() {
    return {
      pageNo: 1,
      backgroundUrl: '',
      portraits: [],
      containerName: this.isDigital ? 'Frame' : 'Page',
      index: 0,
      screenNumber: null
    };
  },
  computed: {
    selectedPages() {
      return this.requiredPages.map(p => {
        const screenNumber = this.isDigital ? p.screen : null;
        const pageNo = this.isDigital ? p.frame : p;
        const backgroundUrl = this.isDigital
          ? this.getFrameBackground(pageNo)
          : this.getPageBackground(pageNo);

        return { screenNumber, pageNo, backgroundUrl };
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
      const totalSheet = this.isDigital
        ? this.frameIds.length
        : Object.values(this.getSheets).length * 2 - 4;
      const pages = Array.from({ length: totalSheet }, (_, i) => i + 1);
      return isEmpty(pages)
        ? [{ name: 1, value: 1 }]
        : pages.map(p => ({ name: p, value: p }));
    }
  },
  watch: {
    displayedPageNo(value) {
      if (isEmpty(value)) return;
      this.index = this.selectedPages.findIndex(
        ({ pageNo }) => pageNo === value
      );
      this.updatePreviewData();
    },
    flowSettings: {
      deep: true,
      handler() {
        this.index = Math.max(
          this.selectedPages.findIndex(({ pageNo }) => pageNo === this.pageNo),
          0
        );
        this.updatePreviewData();
      }
    }
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
      const currentIndex = this.index;

      if (isEmpty(currentIndex)) return;

      if (nextMove < 0 && currentIndex < 1) return;

      if (nextMove > 0 && currentIndex > this.selectedPages.length - 2) return;

      this.index = currentIndex + nextMove;

      this.updatePreviewData();
    },
    /**
     * Update preview of selected page
     *
     * @param {Number}  selectedPageNo  selected page number
     */
    updatePreviewData() {
      if (isEmpty(this.selectedPages)) return;

      const page = isEmpty(this.index) ? {} : this.selectedPages[this.index];

      this.pageNo = page.pageNo;
      this.screenNumber = page.screenNumber;
      this.backgroundUrl = page.backgroundUrl;

      const { flowMultiSettings, folders } = this.flowSettings;
      const isContinuousFlow =
        flowMultiSettings.flowOption === PORTRAIT_FLOW_OPTION_MULTI.CONTINUE.id;
      const isSingle = folders.length === 1;

      const { min, max, folderIdx } = this.previewPortraitsRange[this.index];

      if (isSingle || !isContinuousFlow) {
        this.portraits = folders[folderIdx].assets.slice(min, max + 1);

        return;
      }

      // case of continuos multi-folders
      const totalPortraits = folders.reduce(
        (acc, p) => acc.concat(p.assets),
        []
      );
      this.portraits = totalPortraits.slice(min, max + 1);
    }
  },
  created() {
    this.updatePreviewData();
  }
};
