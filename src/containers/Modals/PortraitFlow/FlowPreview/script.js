import PreviewSlide from './PreviewSlide';

import { useBackgroundAction, useSheet } from '@/hooks';
import { getPageIdFromPageNo, isEmpty } from '@/common/utils';

import { PORTRAIT_FLOW_OPTION_MULTI } from '@/common/constants';

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
    },
    previewPortraitsRange: {
      type: Array,
      required: true
    },
    isDigital: {
      type: Boolean
    }
  },
  data() {
    return {
      previewItems: []
    };
  },
  setup() {
    const { getPageBackgrounds, getFrameBackgrounds } = useBackgroundAction();
    const { getSheets } = useSheet();

    return { getPageBackgrounds, getFrameBackgrounds, getSheets };
  },
  async created() {
    this.previewItems = this.isDigital
      ? this.getDigitalPreviewItems()
      : await this.getPrintPreviewItems();
  },
  methods: {
    async getPrintPreviewItems() {
      if (isEmpty(this.flowSettings)) return [];

      const pageIds = this.requiredPages.map(p =>
        getPageIdFromPageNo(p, this.getSheets)
      );
      const backgrounds = await this.getPageBackgrounds(pageIds);

      const { flowMultiSettings, folders } = this.flowSettings;
      const isContinuousFlow =
        flowMultiSettings.flowOption === PORTRAIT_FLOW_OPTION_MULTI.CONTINUE.id;
      const isSingle = folders.length === 1;

      const totalPortraits =
        isSingle || !isContinuousFlow
          ? folders.map(f => f.assets)
          : [folders.reduce((acc, p) => acc.concat(p.assets), [])];

      return this.requiredPages.map((p, index) => {
        const { min, max, folderIdx } = this.previewPortraitsRange[index];
        const portraits = totalPortraits[folderIdx].slice(min, max + 1);

        return {
          portraits,
          layout: this.flowSettings.layoutSettings,
          backgroundUrl: backgrounds[index].imageUrl,
          pageNo: p
        };
      });
    },
    getDigitalPreviewItems() {
      if (isEmpty(this.flowSettings)) return [];

      const backgrounds = this.getFrameBackgrounds(
        this.requiredPages.map(item => item.frame)
      );

      const { folders } = this.flowSettings;

      const totalPortraits = folders.map(f => f.assets);

      return this.requiredPages.map((p, index) => {
        const { min, max, folderIdx } = this.previewPortraitsRange[index];
        const portraits = totalPortraits[folderIdx].slice(min, max + 1);

        return {
          portraits,
          layout: this.flowSettings.layoutSettings,
          backgroundUrl: backgrounds[p.frame],
          pageNo: p.frame,
          screenNo: p.screen
        };
      });
    }
  }
};
