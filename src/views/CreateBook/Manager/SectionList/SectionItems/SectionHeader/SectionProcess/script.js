import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import Action from './Action';

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
      currentId: '',
      calendarPosition: {
        x: 0,
        y: 0
      },
      items: [
        { title: 'Status', value: 'Not Started', name: 'status' },
        { title: 'Due Date', value: '05/21/21', name: 'dueDate' },
        { title: 'Assigned To', value: 'Unassigned', name: 'assigned' }
      ]
    };
  },
  created() {
    this.moreIcon = ICON_LOCAL.MORE_ICON;
  },
  methods: {
    openCalendar(event) {
      this.isOpenCalendar = true;
      const parentElement = event.target.parentElement;
      const { x, y } = parentElement.getBoundingClientRect();
      this.calendarPosition.x = x - this.calendarWidth;
      this.calendarPosition.y = y;
    },
    onMenuToggle(isOpen) {
      this.isOpenCalendar = isOpen;
      console.log('isOpen', isOpen);
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
    onIconClick(id) {
      this.currentId = id;
    }
  }
};
