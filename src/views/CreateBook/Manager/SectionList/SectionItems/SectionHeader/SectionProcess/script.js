import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';

export default {
  props: ['sectionColor', 'releaseDate', 'sectionId'],
  components: {
    Menu
  },
  data() {
    return {
      items: [
        { title: 'Status', value: 'Not Started' },
        { title: 'Due Date', value: 'Due Date' },
        { title: 'Assigned To', value: 'Unassigned' }
      ]
    };
  },
  created() {
    this.moreIcon = ICON_LOCAL.MORE_ICON;
  }
};
