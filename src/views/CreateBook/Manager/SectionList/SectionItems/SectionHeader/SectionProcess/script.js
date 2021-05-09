import { mapGetters, mapMutations } from 'vuex';

import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import Action from './Action';
import { GETTERS, MUTATES } from '@/store/modules/app/const';

export default {
  props: ['color', 'releaseDate', 'sectionId'],
  components: {
    Menu,
    Action
  },
  data() {
    return {
      isOpen: false,
      menuX: 0,
      menuY: 0,
      items: [
        { title: 'Status', value: 'Not Started', name: 'status' },
        { title: 'Due Date', value: '05/21/21', name: 'dueDate' },
        { title: 'Assigned To', value: 'Unassigned', name: 'assigned' }
      ]
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    })
  },
  created() {
    this.moreIcon = ICON_LOCAL.MORE_ICON;
  },
  methods: {
    ...mapMutations({
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED
    }),
    setIsOpenMenu() {
      if (!this.sectionSelected || this.sectionSelected !== this.sectionId) {
        this.setSectionSelected({
          sectionSelected: this.sectionId
        });
      } else if (
        this.sectionSelected &&
        this.sectionSelected === this.sectionId
      ) {
        this.setSectionSelected({
          sectionSelected: ''
        });
      }
    },
    toggleMenu(event) {
      event.stopPropagation();
      const element = event.target;
      const { x, y } = element.getBoundingClientRect();
      this.menuX = x - 70;
      this.menuY = y;
      this.setIsOpenMenu();
    }
  }
};
