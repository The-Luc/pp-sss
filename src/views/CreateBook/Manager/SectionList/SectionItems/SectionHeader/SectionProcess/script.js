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
      isOpenCalendar: false,
      isOpen: false,
      calendarWidth: 600,
      calendarPosition: {
        x: 0,
        y: 0
      },
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
    openCalendar(event) {
      this.isOpenCalendar = true;
      const parentElement = event.target.parentElement;
      const { x, y } = parentElement.getBoundingClientRect();
      this.calendarPosition.x = x - this.calendarWidth;
      this.calendarPosition.y = y;
    },
    onItemClick({ event, item }) {
      switch (item.name) {
        case 'dueDate':
          this.openCalendar(event);
          break;
        default:
          break;
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
