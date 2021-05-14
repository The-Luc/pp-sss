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
    section: Object,
    sectionId: {
      type: Number,
      require: true
    },
    sectionName: {
      type: String,
      require: true
    },
    sectionStatus: {
      type: String,
      require: true
    },
    dueDate: {
      type: String,
      require: true
    },
    sectionColor: {
      type: String,
      require: true
    },
    sectionDraggable: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      isOpenMenu: false
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
      if (!sectionSelected || sectionSelected !== this.sectionId) {
        this.isOpenMenu = true;
      } else if (sectionSelected && sectionSelected === this.sectionId) {
        this.isOpenMenu = false;
      }
    },
    toggleDetail: function(ev) {
      const sectionHeader = ev.target.closest('.section-header');

      const isCollapse = !(
        sectionHeader.getAttribute('data-toggle') === COLLAPSE
      );

      sectionHeader.setAttribute('data-toggle', isCollapse ? COLLAPSE : EXPAND);

      const img = sectionHeader
        .querySelector('.section-name')
        .querySelector('img');

      img.setAttribute('data-toggle', isCollapse ? COLLAPSE : EXPAND);

      const targetId = sectionHeader.getAttribute('data-target');
      const target = document.querySelector('[data-id="' + targetId + '"]');

      target.setAttribute('data-toggle', isCollapse ? COLLAPSE : EXPAND);

      this.$root.$emit('toggleSection');
    },
    showDragControl: function(evt) {
      const sectionHeader = evt.target.closest('.section-header');

      if (sectionHeader.getAttribute('data-draggable') !== 'true') {
        return;
      }

      this.$root.$emit('showDragControl', 'section' + this.sectionId);
    },
    hideDragControl: function() {
      this.$root.$emit('hideDragControl');
    }
  }
};
