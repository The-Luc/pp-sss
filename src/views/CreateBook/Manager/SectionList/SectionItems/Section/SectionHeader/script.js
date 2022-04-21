import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import SectionName from './SectionName';
import SectionProcess from './SectionProcess';

const COLLAPSE = 'collapse';
const EXPAND = 'expand';

export default {
  components: {
    SectionName,
    SectionProcess
  },
  props: {
    section: {
      type: Object,
      require: true
    },
    isEnable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpenMenu: false,
      isDragControlDisplayed: false
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    })
  },
  watch: {
    sectionSelected(val) {
      this.setIsOpenMenu(val);
    }
  },
  methods: {
    setIsOpenMenu(sectionSelected) {
      if (!sectionSelected || sectionSelected !== this.section.id) {
        this.isOpenMenu = true;
      } else if (sectionSelected && sectionSelected === this.section.id) {
        this.isOpenMenu = false;
      }
    },
    /**
     * Toggle section detail
     *
     * @param {Object}  event event fire when click on section header
     */
    toggleDetail(event) {
      const sectionHeader = event.target.closest('.section-header');

      const isCollapse = sectionHeader.getAttribute('data-toggle') !== COLLAPSE;

      sectionHeader.setAttribute('data-toggle', isCollapse ? COLLAPSE : EXPAND);

      const img = sectionHeader
        .querySelector('.section-name')
        .querySelector('.v-icon');

      img.setAttribute('data-toggle', isCollapse ? COLLAPSE : EXPAND);

      const targetId = sectionHeader.getAttribute('data-target');
      const target = document.querySelector('[data-id="' + targetId + '"]');

      target.setAttribute('data-toggle', isCollapse ? COLLAPSE : EXPAND);

      this.$root.$emit('toggleSection');
    },
    /**
     * Show the drag control when hover & enable & draggable
     */
    showDragControl() {
      this.isDragControlDisplayed = this.section.draggable;
    },
    /**
     * Hide the drag control when mouse out
     */
    hideDragControl() {
      this.isDragControlDisplayed = false;
    }
  }
};
