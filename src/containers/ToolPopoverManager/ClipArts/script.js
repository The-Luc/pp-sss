import { mapMutations } from 'vuex';
import ClipArtToolPopover from '@/components/ToolPopovers/ClipArt';
import { loadClipArts, loadClipArtCategories } from '@/api/clipArt';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { CLIP_ART_TYPE } from '@/common/constants';
import { cloneDeep } from 'lodash';
import { EVENT_TYPE } from '@/common/constants/eventType';

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
  computed: {
    clipArts() {
      return this.clipArtList.filter(item => item.category === this.category);
    }
  },
  methods: {
    ...mapMutations({
      setToolNameSelected: APP_MUTATES.SET_TOOL_NAME_SELECTED
    }),
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
      this.setToolNameSelected({
        name: ''
      });
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
    onChangeClipArtType(clipArtType) {
      this.category = clipArtType.sub.value;

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
    }
  },
  async created() {
    this.clipArtList = await loadClipArts();
    const clipArtTypes = await this.clipArtTypes();
    this.displayClipArtTypes = clipArtTypes.filter(b => b.subItems.length > 0);

    if (this.displayClipArtTypes.length === 0) return;

    this.chosenClipArtType = {
      value: this.displayClipArtTypes[0].id,
      sub: this.displayClipArtTypes[0].subItems[0].id
    };
  }
};
