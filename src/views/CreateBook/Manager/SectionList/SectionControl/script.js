import { useSectionControl } from '@/views/CreateBook/Manager/composables';

import { ROLE, MAX_SECTION } from '@/common/constants';
import { uniqueId } from 'lodash';

const COLLAPSE = 'collapse';
const EXPAND = 'expand';

export default {
  setup() {
    const { currentUser, totalSection, addSection } = useSectionControl();

    return { currentUser, totalSection, addSection };
  },
  data() {
    return {
      isCollapse: true
    };
  },
  computed: {
    isDisableAdd() {
      return this.totalSection >= MAX_SECTION;
    },
    isEnable() {
      return this.currentUser?.role === ROLE.ADMIN;
    }
  },
  mounted: function() {
    this.$root.$on('toggleSection', () => {
      this.toggleEcButton();
    });
  },
  methods: {
    /**
     * Collapse / Expand all section
     *
     * @param {Object}  event event fire when click on Collapse / Expand All Section
     */
    toggleDetail(event) {
      const button = event.target.closest('#btn-ec-all');
      const collapse = button.getAttribute('data-toggle');

      const sectionHeaders = document.getElementsByClassName('section-header');

      sectionHeaders.forEach(sh => {
        if (sh.getAttribute('data-toggle') === collapse) sh.click();
      });

      this.isCollapse = collapse !== COLLAPSE;
    },
    /**
     * Set text / data toggle for Collapse / Expand All Section button
     */
    toggleEcButton() {
      const sectionCollaps = document.querySelectorAll(
        '.section-header:not([data-toggle="' + EXPAND + '"])'
      );

      this.isCollapse = sectionCollaps.length > 0;

      document
        .getElementById('btn-ec-all')
        .setAttribute('data-toggle', this.isCollapse ? COLLAPSE : EXPAND);
    },
    async onAddSection() {
      if (this.isDisableAdd) return;

      const sectionId = uniqueId();
      await this.addSection({ sectionId });

      const newSection = this.$parent.$refs.sections.$refs[
        `section-${sectionId}`
      ][0];
      const inputName =
        newSection.$refs.header.$refs.name.$refs['input-container'];
      inputName.click();

      // const newSection = document.querySelector(`#section-${sectionId}`);
      // const inputName = newSection.querySelector('.input-container');
    }
  }
};
