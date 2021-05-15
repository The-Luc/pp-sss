import { mapMutations, mapGetters } from 'vuex';

import Action from './Action';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

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
      processStatus,
      items: [
        {
          title: 'Status',
          value: this.getStatusName(this.section.status),
          name: 'status'
        },
        { title: 'Due Date', value: this.section.dueDate, name: 'dueDate' },
        { title: 'Assigned To', value: 'Unassigned', name: 'assigned' }
      ]
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED,
      sections: 'book/getSections',
      MaxPage: 'book/getMaxPage',
      TotalInfo: 'book/getTotalInfo'
    })
  },
  watch: {
    'section.dueDate': function(val) {
      this.items[1].value = val;
    },
    'section.status': function(val) {
      const statusName = this.getStatusName(val);
      this.items[0].value = this.convertTextCap(statusName);
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
    getStatusName(status) {
      let res = '';
      Object.keys(PROCESS_STATUS).forEach(k => {
        if (status === PROCESS_STATUS[k].value) {
          res = PROCESS_STATUS[k].name;
        }
      });
      return res;
    },
    convertTextCap(string) {
      return string.replace(/\b\w/g, l => l.toUpperCase());
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
