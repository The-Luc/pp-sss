import emptyAvatar from '@/assets/image/empty.png';

import { isEmpty } from '@/common/utils';

export default {
  props: {
    portraits: {
      type: Array,
      default: () => []
    },
    layout: {
      type: Object,
      default: () => ({})
    },
    backgroundUrl: {
      type: String
    }
  },
  data() {
    return {
      portraitData: [[]]
    };
  },
  watch: {
    layout(value) {
      if (isEmpty(value)) return;

      this.updatePortraitData();
    },
    portraits(value) {
      if (isEmpty(value)) return;

      this.updatePortraitData();
    }
  },
  created() {
    this.updatePortraitData();
  },
  methods: {
    /**
     * Update portrait data
     */
    updatePortraitData() {
      const rowData = [...Array(this.layout.rowCount).keys()];

      this.portraitData = rowData.map(rowInd => {
        return [...Array(this.layout.colCount).keys()].map(colInd => {
          const index = rowInd * this.layout.colCount + colInd;

          if (index >= this.portraits.length) {
            return { imageUrl: emptyAvatar };
          }

          return this.portraits[index];
        });
      });
    }
  }
};
