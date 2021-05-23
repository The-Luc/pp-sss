import { mapGetters, mapMutations } from 'vuex';

import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';

const COLLAPSE = 'collapse';
const EXPAND = 'expand';

export default {
  data() {
    return {
      isCollapse: true
    };
  },
  computed: {
    ...mapGetters({
      getTotalSections: 'book/getTotalSections'
    }),
    isDisableAdd() {
      return this.getTotalSections >= 50;
    }
  },
  mounted: function() {
    this.$root.$on('toggleSection', () => {
      this.toggleEcButton();
    });
  },
  methods: {
    ...mapMutations({
      addSection: BOOK_MUTATES.ADD_SECTION
    }),
    toggleDetail: function(ev) {
      const button = ev.target.closest('#btn-ec-all');
      const collapse = button.getAttribute('data-toggle');

      const sectionHeaders = document.getElementsByClassName('section-header');

      sectionHeaders.forEach(sh => {
        if (sh.getAttribute('data-toggle') === collapse) sh.click();
      });

      this.isCollapse = collapse !== COLLAPSE;
    },
    toggleEcButton: function() {
      const sectionCollaps = document.querySelectorAll(
        '.section-header:not([data-toggle="' + EXPAND + '"])'
      );

      this.isCollapse = sectionCollaps.length > 0;

      document
        .getElementById('btn-ec-all')
        .setAttribute('data-toggle', this.isCollapse ? COLLAPSE : EXPAND);
    },
    onAddSection() {
      if (!this.isDisableAdd) {
        this.addSection();
      }
    }
  }
};
