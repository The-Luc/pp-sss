import { mapMutations, mapGetters } from 'vuex';
import moment from 'moment';

import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import Action from './Action';
import { GETTERS, MUTATES } from '@/store/modules/app/const';

export default {
  props: ['sectionColor', 'releaseDate', 'sectionId', 'color', 'sectionName'],
  components: {
    Menu,
    Action
  },
  data() {
    return {
      isOpen: false,
      menuX: 0,
      menuY: 0,
      sectionStatus: 0,
      items: [
        { title: 'Status', value: 'Not Started', name: 'status' },
        { title: 'Due Date', value: this.releaseDate, name: 'dueDate' },
        { title: 'Assigned To', value: 'Unassigned', name: 'assigned' }
      ]
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED,
      sections: 'book/getSections'
    }),
    isShowDelete() {
      const index = this.sections.findIndex(item => item.id === this.sectionId);
      if (index !== 0 && index !== 1 && index !== this.sections.length - 1) {
        return true;
      }
      return false;
    }
  },
  created() {
    this.moreIcon = ICON_LOCAL.MORE_ICON;
  },
  methods: {
    ...mapMutations({
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED,
      toggleModal: MUTATES.TOGGLE_MODAL
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
    },
    onSelectedStatus(status) {
      this.items[0].value = status.label;
      this.sectionStatus = status.value;
    },
    onSelectedDate(date) {
      this.items[1].value = moment(date).format('MM/DD/YY');
    }
  }
};
