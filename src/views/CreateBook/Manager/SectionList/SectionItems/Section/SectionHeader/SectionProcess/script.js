import { mapMutations, mapGetters } from 'vuex';

import ProcessBar from '@/components/BarProcesses/ProcessBar';
import Action from './Action';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

import { ICON_LOCAL } from '@/common/constants';

export default {
  components: {
    ProcessBar,
    Action
  },
  props: {
    section: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      menuX: 0,
      menuY: 0,
      currentMenuHeight: 0,
      menuClass: 'pp-menu section-menu',
      summaryEl: null,
      componentKey: true,
      isOpenMenu: false
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    })
  },
  watch: {
    sectionSelected(id) {
      this.isOpenMenu = id === this.section.id;
    }
  },
  created() {
    this.moreIcon = ICON_LOCAL.MORE_ICON;
  },
  mounted() {
    this.$root.$on('summary', data => {
      this.summaryEl = data;
    });
    this.$root.$on('menu', data => {
      const that = this;
      setTimeout(() => {
        that.currentMenuHeight = data.$el.clientHeight;
      }, 10);
    });
  },
  methods: {
    ...mapMutations({
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED
    }),
    /**
     * Set open menu by mutate selected section id
     */
    setIsOpenMenu() {
      if (!this.sectionSelected || this.sectionSelected !== this.section.id) {
        this.setSectionSelected({ sectionSelected: this.section.id });

        this.componentKey = !this.componentKey;

        return;
      }

      if (this.sectionSelected && this.sectionSelected === this.section.id) {
        this.setSectionSelected({ sectionSelected: '' });
      }
    },
    toggleMenu(event) {
      const element = event.target;
      const windowHeight = window.innerHeight;
      const elementY = event.y;

      const { x, y } = element.getBoundingClientRect();
      this.menuX = x - 80;

      const dataToggle = this.summaryEl?.getAttribute('data-toggle');
      if (dataToggle && dataToggle === 'collapse') {
        this.menuClass = `${this.menuClass} collapsed-summary`;
      } else {
        this.menuClass = 'pp-menu section-menu';
      }
      this.menuY = y;
      setTimeout(() => {
        if (windowHeight - elementY < this.currentMenuHeight) {
          this.menuY = y - this.currentMenuHeight - 50;
          this.menuClass = `${this.menuClass} section-menu-top`;
        } else {
          this.menuClass = `${this.menuClass} section-menu-bottom`;
          this.menuY = y;
        }
      }, 100);
      this.setIsOpenMenu();
    }
  }
};
