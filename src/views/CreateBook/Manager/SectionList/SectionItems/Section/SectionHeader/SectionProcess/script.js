import { mapMutations, mapGetters } from 'vuex';

import ProcessBar from '@/components/BarProcesses/ProcessBar';
import Action from './Action';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

import { ICON_LOCAL, PROCESS_STATUS } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  props: {
    section: {
      type: Object,
      require: true
    }
  },
  components: {
    ProcessBar,
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
      currentMenuHeight: 0,
      menuClass: 'pp-menu section-menu',
      processStatus,
      summaryEl: null,
      menuItems: [
        {
          title: 'Status',
          value: this.getStatusName(this.section.status),
          name: 'status'
        },
        { title: 'Due Date', value: this.section.dueDate, name: 'dueDate' },
        { title: 'Assigned To', value: 'Unassigned', name: 'assignee' }
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
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED,
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    getStatusName(status) {
      const process = Object.values(PROCESS_STATUS).find(
        ({ value }) => status === value
      );

      return process?.name;
    },
    convertTextCap(string) {
      return string.replace(/\b\w/g, l => l.toUpperCase());
    },
    setIsOpenMenu() {
      if (!this.sectionSelected || this.sectionSelected !== this.section.id) {
        this.setSectionSelected({ sectionSelected: this.section.id });

        return;
      }

      if (this.sectionSelected && this.sectionSelected === this.section.id) {
        this.setSectionSelected({ sectionSelected: '' });

        return;
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
    },
    /**
     * Update menu item value when status is changed
     *
     * @param {Number}  status  selected status
     */
    onStatusUpdate({ status }) {
      const statusName = this.getStatusName(status);

      this.menuItems[0].value = this.convertTextCap(statusName);
    },
    /**
     * Update menu item value when due date is changed
     *
     * @param {String}  dueDate selected due date
     */
    onDueDateUpdate({ dueDate }) {
      this.menuItems[1].value = dueDate;
    },
    /**
     * Update menu item value when assignee is changed
     *
     * @param {String}  assignee  selected assignee
     */
    onAssigneeUpdate({ assignee }) {
      const name = isEmpty(assignee) ? 'Unassigned' : assignee;

      this.menuItems[2].value = name;
    }
  }
};
