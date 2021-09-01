import PreviewSlide from './PreviewSlide';

import { useBackgroundAction } from '@/hooks';

import { getPortraitForPage } from '@/common/utils';

export default {
  components: {
    PreviewSlide
  },
  props: {
    selectedFolders: {
      type: Array,
      default: () => []
    },
    flowSettings: {
      type: Object,
      default: () => ({ totalPortraitsCount: 0 })
    },
    requiredPages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      previewItems: this.getPreviewItems()
    };
  },
  setup() {
    const { getPageBackgrounds } = useBackgroundAction();

    return { getPageBackgrounds };
  },
  methods: {
    getPreviewItems() {
      const backgrounds = this.getPageBackgrounds(this.requiredPages);

      return this.requiredPages.map((p, index) => {
        const portraits = getPortraitForPage(
          index,
          this.flowSettings.layoutSettings.rowCount,
          this.flowSettings.layoutSettings.colCount,
          this.flowSettings.totalPortraitsCount,
          this.selectedFolders
        );

        return {
          portraits,
          layout: this.flowSettings.layoutSettings,
          backgroundUrl: backgrounds[p],
          pageNo: p
        };
      });
    }
  }
};
