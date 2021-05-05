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
    releaseDate: String
  },
  methods: {
    toggleDetail: function(ev) {
      const sectionHeader = ev.target.closest('.section-header');

      const isCollapse = !(
        sectionHeader.getAttribute('data-toggle') === COLLAPSE
      );

      sectionHeader.setAttribute(
        'data-toggle',
        isCollapse ? COLLAPSE : EXPAND
      );

      const img = sectionHeader.querySelector('.section-name').querySelector('img');

      img.setAttribute('data-toggle', isCollapse ? COLLAPSE : EXPAND);

      const targetId = sectionHeader.getAttribute('data-target');
      const target = document.querySelector('[data-id="' + targetId + '"]');

      target.setAttribute('data-toggle', isCollapse ? COLLAPSE : EXPAND);

      this.$root.$emit('tooglesection');
    }
  }
};
