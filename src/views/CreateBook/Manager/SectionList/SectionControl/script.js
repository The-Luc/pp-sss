import { mapMutations } from 'vuex';

const COLLAPSE = 'collapse';
const EXPAND = 'expand';

export default {
  data() {
    return {
      isCollapse: true
    };
  },
  mounted: function () {
    this.$root.$on('tooglesection', () => {
      this.toggleEcButton();
    });
  },
  methods: {
    ...mapMutations('project', ['addSection']),
    toggleDetail: function (ev) {
      const button = ev.target.closest('#btn-ec-all');
      const collapse = button.getAttribute('data-toggle');

      const sectionHeaders = document.getElementsByClassName('section-header');

      sectionHeaders.forEach(sh => {
        if (sh.getAttribute('data-toggle') === collapse) sh.click();
      });

      this.isCollapse = collapse !== COLLAPSE;
    },
    toggleEcButton: function () {
      const sectionCollaps = document.querySelectorAll(
        '.section-header:not([data-toggle="' + EXPAND + '"])'
      );

      this.isCollapse = sectionCollaps.length > 0;

      document
        .getElementById('btn-ec-all')
        .setAttribute('data-toggle', this.isCollapse ? COLLAPSE : EXPAND);
    },
    onAddSection() {
      this.addSection();
    }
  }
};
