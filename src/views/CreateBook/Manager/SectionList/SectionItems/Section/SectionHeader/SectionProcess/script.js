import { mapMutations, mapGetters } from 'vuex';

import Action from './Action';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { SECTION_STATUS } from '@/common/constants/status';

import { ICON_LOCAL } from '@/common/constants';
import { PROCESS_STATUS } from '@/common/constants/processStatus';

export default {
  props: {
    section: {
      type: Object,
      require: true
    }
  },
  components: {
    Action
  },
  data() {
    const processStatus = {};

    Object.keys(PROCESS_STATUS).forEach(k => {
      processStatus[k] = PROCESS_STATUS[k].value;
    });

    return {
      menuX: 0,
      menuY: 0,
      processStatus: processStatus,
      items: [
        {
          title: 'Status',
          value: PROCESS_STATUS.NOT_STARTED.name,
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
  mounted() {
    this.mapStatusNumberic(this.status);
  },
  methods: {
    ...mapMutations({
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED,
      toggleModal: MUTATES.TOGGLE_MODAL
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
      if (!this.sectionSelected || this.sectionSelected !== this.section.id) {
        this.setSectionSelected({
          sectionSelected: this.section.id
        });
      } else if (
        this.sectionSelected &&
        this.sectionSelected === this.section.id
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
      this.menuX = x - 80;
      this.menuY = y;
      this.setIsOpenMenu();
    }
  }
};
