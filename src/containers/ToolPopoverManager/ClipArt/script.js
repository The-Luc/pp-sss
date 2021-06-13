import { mapMutations } from 'vuex';
import PpSelect from '@/components/Select';
import PpToolPopover from '@/components/ToolPopover';
import { loadClipArts, loadClipArtCategories } from '@/api/clipArt';
import Item from './Item';
import ClipArtType from './ClipArtType';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { CLIP_ART_TYPE } from '@/common/constants';
export default {
  components: {
    PpToolPopover,
    PpSelect,
    Item,
    ClipArtType
  },
  data() {
    return {
      category: 0,
      clipArtList: [],
      selectedClipArtId: [],
      displayClipArtTypes: [],
      chosenClipArtType: {
        id: 0,
        name: 'Category',
        value: 0,
        sub: {
          id: 0,
          name: 'Aducation',
          value: 0
        }
      }
    };
  },
  computed: {
    clipArt() {
      return this.clipArtList.filter(
        item => item.property.category === this.category
      );
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
      this.$root.$emit('printAddClipArt', addClipArts);
      this.onCancel();
    },
    /**
     * Change clip art type when selected
     * @param {Object} data - Clip art type and category selected
     */
    onChangeClipArtType(data) {
      this.category = data.sub.id;
      this.chosenClipArtType = {
        ...data.item,
        sub: data.sub
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
          clType.subItems = Object.keys(CLIP_ART_CATEGORIES).map(k => {
            return {
              ...CLIP_ART_CATEGORIES[k],
              value: CLIP_ART_CATEGORIES[k].id
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
  }
};
