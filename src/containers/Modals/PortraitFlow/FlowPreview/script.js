import PreviewSlide from './PreviewSlide';

import { useBackgroundAction, useFrame, useSheet } from '@/hooks';
import {
  getCurrentSheetBackground,
  getFrameBackgroundUtil,
  getFrameIdFromFrameNo,
  getPageIdFromPageNo,
  getScreenInfoFromScreenNo,
  isEmpty,
  isFullBackground
} from '@/common/utils';

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
    const {
      backgrounds,
      getPageBackground,
      getFrameBackground
    } = useBackgroundAction();
    const { currentSheet, getSheets } = useSheet();
    const { frameIds, frames, currentFrameId } = useFrame();

    return {
      backgrounds,
      getPageBackground,
      getFrameBackground,
      currentSheet,
      getSheets,
      frameIds,
      frames,
      currentFrameId
    };
  },
  async created() {
    this.previewItems = this.isDigital
      ? await this.getDigitalPreviewItems()
      : await this.getPrintPreviewItems();
  },
  methods: {
    async getPrintPreviewItems() {
      if (isEmpty(this.flowSettings)) return [];

      const promises = this.requiredPages.map(async p => {
        const pageId = getPageIdFromPageNo(p, this.getSheets);

        const isCurrentSheet = this.currentSheet.pageIds.includes(pageId);

        if (isCurrentSheet) {
          return getCurrentSheetBackground(
            pageId,
            this.currentSheet,
            this.backgrounds
          );
        }

        const background = await this.getPageBackground(pageId);

        if (!isEmpty(background)) return background;

        if (p === 1 || p % 2 === 0) return background;

        const prevPageId = getPageIdFromPageNo(p - 1, this.getSheets);

        const prevBackground = await this.getPageBackground(prevPageId);

        return isFullBackground(prevBackground) ? prevBackground : {};
      });

      const backgrounds = await Promise.all(promises);

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
          background: backgrounds[index],
          isFullBackground: isFullBackground(backgrounds[index]),
          pageNo: p
        };
      });
    },
    async getDigitalPreviewItems() {
      if (isEmpty(this.flowSettings)) return [];

      const promises = this.requiredPages.map(async rp => {
        const screenInfo = getScreenInfoFromScreenNo(rp.screen, this.getSheets);

        if (isEmpty(screenInfo)) return {};

        const isCurrentScreen =
          `${this.currentSheet.id}` === `${screenInfo.id}`;

        if (isCurrentScreen && rp.frame === this.currentFrameId)
          return this.backgrounds;

        if (isCurrentScreen)
          return getFrameBackgroundUtil(rp.frame, this.frames);

        const frameId = getFrameIdFromFrameNo(
          rp.frame,
          isCurrentScreen ? this.frameIds : screenInfo.frameIds
        );

        if (isEmpty(frameId)) return {};

        return await this.getFrameBackground(frameId);
      });

      const backgrounds = await Promise.all(promises);

      const { folders } = this.flowSettings;

      const totalPortraits = folders.map(f => f.assets);

      return this.requiredPages.map((p, index) => {
        const { min, max, folderIdx } = this.previewPortraitsRange[index];
        const portraits = totalPortraits[folderIdx].slice(min, max + 1);

        return {
          portraits,
          layout: this.flowSettings.layoutSettings,
          background: backgrounds[index],
          pageNo: p.frame,
          screenNo: p.screen
        };
      });
    }
  }
};
