import { mapGetters, mapMutations } from 'vuex';

import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import Action from './Action';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { SECTION_STATUS } from '@/common/constants/status';

export default {
  props: [
    'sectionColor',
    'releaseDate',
    'sectionId',
    'color',
    'dueDate',
    'status'
  ],
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
        {
          title: 'Status',
          value: this.convertTextCap(this.status),
          name: 'status'
        },
        { title: 'Due Date', value: this.dueDate, name: 'dueDate' },
        { title: 'Assigned To', value: 'Unassigned', name: 'assigned' }
      ]
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED
    })
  },
  watch: {
    dueDate(val) {
      this.items[1].value = val;
    },
    status(val) {
      this.items[0].value = this.convertTextCap(val);
      this.mapStatusNumberic(val);
    }
  },
  created() {
    this.moreIcon = ICON_LOCAL.MORE_ICON;
  },
  methods: {
    ...mapMutations({
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED
    }),
    convertTextCap(string) {
      return string.replace(/\b\w/g, l => l.toUpperCase());
    },
    mapStatusNumberic(statusText) {
      switch (statusText) {
        case SECTION_STATUS.NOT_STARTED.text:
          this.sectionStatus = SECTION_STATUS.NOT_STARTED.number;
          break;
        case SECTION_STATUS.IN_PROGRESS.text:
          this.sectionStatus = SECTION_STATUS.IN_PROGRESS.number;
          break;
        case SECTION_STATUS.COMPLETED.text:
          this.sectionStatus = SECTION_STATUS.COMPLETED.number;
          break;
        case SECTION_STATUS.APPROVED.text:
          this.sectionStatus = SECTION_STATUS.APPROVED.number;
          break;
        default:
          break;
      }
    },
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
