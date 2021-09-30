import { cloneDeep } from 'lodash';

import ClipArtToolPopover from '@/components/ToolPopovers/ClipArt';
import { loadClipArtCategories } from '@/api/clipArt';
import { CLIP_ART_TYPE, EVENT_TYPE } from '@/common/constants';

import { useClipArt } from '@/views/CreateBook/composables';
import { usePopoverCreationTool } from '@/hooks';

export default {
  components: {
    ClipArtToolPopover
  },
  data() {
    return {
      category: 0,
      clipArtList: [],
      selectedClipArtId: [],
      displayClipArtTypes: [],
      chosenClipArtType: { value: '', sub: '' }
    };
  },
  setup() {
    const { getClipArtSearch, getClipArtList } = useClipArt();
    const { setToolNameSelected } = usePopoverCreationTool();

    return {
      getClipArtSearch,
      getClipArtList,
      setToolNameSelected
    };
  },
  methods: {
    /**
     * Add clip art id to array clip art selected
     */
    selectClipArt(clipArt) {
      if (this.selectedClipArtId.includes(clipArt.id)) {
        this.selectedClipArtId = this.selectedClipArtId.filter(
          item => item !== clipArt.id
        );
      } else {
        this.selectedClipArtId = [...this.selectedClipArtId, clipArt.id];
      }
    },
    /**
     * Set tool name selected is empty to close popover after click Cancel button
     */
    onCancel() {
      this.setToolNameSelected('');
      this.selectedClipArtId = [];
    },
    /**
     * Add clip art on Canvas and close popover after click Select button
     */
    addClipArts() {
      const addClipArts = this.clipArtList.filter(item => {
        return this.selectedClipArtId.includes(item.id);
      });
      this.$root.$emit(EVENT_TYPE.ADD_CLIPARTS, cloneDeep(addClipArts));
      this.onCancel();
    },
    /**
     * Change clip art type when selected
     * @param {Object} clipArtType - Clip art type and category selected
     */
    async onChangeClipArtType(clipArtType) {
      this.clipArtList = await this.getClipArtList(clipArtType.sub.value);

      this.chosenClipArtType = {
        value: clipArtType.value,
        sub: clipArtType.sub.value
      };

      this.selectedClipArtId = [];
    },
    /**
     * Get clip art type from api
     */
    async clipArtTypes() {
      const CLIP_ART_CATEGORIES = await loadClipArtCategories();
      return Object.keys(CLIP_ART_TYPE).map(k => {
        const clType = {
          ...CLIP_ART_TYPE[k],
          value: CLIP_ART_TYPE[k].id,
          subItems: []
        };
        if (CLIP_ART_TYPE[k].id === 0) {
          clType.subItems = Object.keys(CLIP_ART_CATEGORIES).map(key => {
            return {
              ...CLIP_ART_CATEGORIES[key],
              value: CLIP_ART_CATEGORIES[key].id
            };
          });
        }
        return clType;
      });
    },
    /**
     * To search base on value input
     * @param {String}  input value to search
     */
    async onSearch(input) {
      this.clipArtList = await this.getClipArtSearch(input);
    }
  },
  async created() {
    this.clipArtList = await this.getClipArtList(this.category);
    const clipArtTypes = await this.clipArtTypes();

    this.displayClipArtTypes = clipArtTypes.filter(
      b => b.id !== CLIP_ART_TYPE.FAVORITE.id
    );

    if (this.displayClipArtTypes.length === 0) return;

    this.chosenClipArtType = {
      value: this.displayClipArtTypes[0].id,
      sub: this.displayClipArtTypes[0].subItems[0].id
    };
  }
};
