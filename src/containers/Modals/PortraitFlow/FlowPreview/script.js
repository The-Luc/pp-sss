import PreviewSlide from './PreviewSlide';

import { useBackgroundAction } from '@/hooks';
import { isEmpty } from '@/common/utils';

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
      previewItems: this.getPreviewItems()
    };
  },
  setup() {
    const { getPageBackgrounds, getFrameBackgrounds } = useBackgroundAction();

    return { getPageBackgrounds, getFrameBackgrounds };
  },
  methods: {
    getPreviewItems() {
      return this.isDigital
        ? this.getDigitalPreviewItems()
        : this.getPrintPreviewItems();
    },
    getPrintPreviewItems() {
      if (isEmpty(this.flowSettings)) return [];

      const backgrounds = this.getPageBackgrounds(this.requiredPages);

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
          backgroundUrl: backgrounds[p],
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
