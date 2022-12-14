import Menu from '@/components/Menu';
import Calendar from './Calendar';
import SectionStatus from './SectionStatus';
import Assignee from './Assignee';

import moment from 'moment';

import {
  ICON_LOCAL,
  DATE_FORMAT,
  PROCESS_STATUS_OPTIONS
} from '@/common/constants';

import { useAppCommon } from '@/hooks';
import {
  useSectionActionMenu,
  useAssigneeMenu
} from '@/views/CreateBook/Manager/composables';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    Menu,
    Calendar,
    SectionStatus,
    Assignee
  },
  props: {
    menuX: {
      type: Number,
      default: 0
    },
    menuY: {
      type: Number,
      default: 0
    },
    sectionId: {
      type: [String, Number],
      default: ''
    },
    status: {
      type: [String, Number],
      default: 0
    },
    sectionName: {
      type: String
    },
    dueDate: {
      type: String
    },
    menuClass: {
      type: String
    },
    assigneeId: {
      type: [String, Number],
      default: ''
    },
    isOpenMenu: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { updateSection } = useSectionActionMenu();
    const { getUsers } = useAssigneeMenu();
    const { activeEdition } = useAppCommon();

    return {
      updateSection,
      getUsers,
      activeEdition
    };
  },
  data() {
    return {
      isOpenCalendar: false,
      isOpenStatus: false,
      isOpenAssignee: false,
      calendarWidth: 550,
      statusWidth: 180,
      assigneeWidth: 267,
      subMenuPos: { x: 0, y: 0 },
      minDate: new Date().toISOString().slice(0, 10),
      users: []
    };
  },
  computed: {
    menuItems() {
      const user = this.users.find(({ id }) => id === this.assigneeId);
      const assignee = isEmpty(user) ? 'Unassigned' : user?.name;
      return [
        { title: 'Status', value: this.getStatusName(), name: 'status' },
        { title: 'Due Date', value: this.dueDate, name: 'dueDate' },
        { title: 'Assigned To', value: assignee, name: 'assignee' }
      ];
    }
  },
  watch: {
    dateSelected(val) {
      if (val) {
        const [year, month] = moment(val)
          .format('YYYY-MM')
          .split('-');
        this.setDateSelect(year, month);
      }
    }
  },
  async mounted() {
    this.moreIcon = ICON_LOCAL.MORE_ICON;

    this.users = await this.getUsers();
  },
  methods: {
    /**
     * Close sub menu calendar when click outside it
     */
    onClickOutsideCalendar() {
      this.isOpenCalendar = false;
    },
    /**
     * Close sub menu status when click outside it
     */
    onClickOutsideStatus() {
      this.isOpenStatus = false;
    },
    /**
     * Close sub menu assignee when click outside it
     */
    onClickOutsideAssignee() {
      this.isOpenAssignee = false;
    },
    /**
     * Close sub menu when click outside it
     */
    onClickOutsideMenu() {
      const isSubMenuOpen =
        this.isOpenStatus || this.isOpenCalendar || this.isOpenAssignee;

      if (this.isOpenMenu && !isSubMenuOpen) this.$emit('closeMenu');
    },
    /**
     * Open calendar sub menu
     *
     * @param {Object}  event the event fire when click
     */
    openCalendar(event) {
      this.isOpenCalendar = this.toggleSubMenu(
        event.target,
        this.isOpenCalendar,
        this.calendarWidth
      );
    },
    /**
     * Open status sub menu
     *
     * @param {Object}  event the event fire when click
     */
    openSectionStatus(event) {
      this.isOpenStatus = this.toggleSubMenu(
        event.target,
        this.isOpenStatus,
        this.statusWidth
      );
    },
    /**
     * Open assignee sub menu
     *
     * @param {Object}  event the event fire when click
     */
    openAssignee(event) {
      this.isOpenAssignee = this.toggleSubMenu(
        event.target,
        this.isOpenAssignee,
        this.assigneeWidth
      );
    },
    /**
     * Menu item click event
     *
     * @param {Object}  event the event fire when click
     * @param {Object}  item  clicked item
     */
    onItemClick({ event, item }) {
      switch (item.name) {
        case 'dueDate':
          this.openCalendar(event);
          break;
        case 'status':
          this.openSectionStatus(event);
          break;
        case 'assignee':
          this.openAssignee(event);
          break;
        default:
          break;
      }
    },
    /**
     * Fire when user click to select due date
     *
     * @param {String}  date  selected date
     */
    async onChangeDueDate({ date }) {
      const dueDate = moment(date).format(DATE_FORMAT.BASE);

      await this.updateSection(
        { id: this.sectionId, dueDate },
        this.activeEdition
      );

      this.isOpenCalendar = false;
    },
    /**
     * Fire when user click to select a status
     *
     * @param {Number}  status selected status
     */
    async onChangeStatus({ status }) {
      await this.updateSection(
        { id: this.sectionId, status: status.value },
        this.activeEdition
      );

      this.isOpenStatus = false;
    },
    /**
     * Fire when user click to select a community member to assign
     *
     * @param {String | Number} id    selected community member id
     */
    async onChangeAssignee({ id }) {
      const assigneeId = this.assigneeId === id ? -1 : id;

      await this.updateSection(
        { id: this.sectionId, assigneeId },
        this.activeEdition
      );

      setTimeout(() => {
        this.isOpenAssignee = false;
      }, 0);
    },
    onScroll() {
      if (this.isOpenMenu) this.$emit('closeMenu');
    },
    /**
     * Toggle sub menu
     *
     * @param   {Object}  element the target element when click
     * @param   {Boolean} isOpen  is sub menu open or not
     * @param   {Number}  width   width of sub menu
     * @returns {Boolean}         sub menu should be open or not
     */
    toggleSubMenu(element, isOpen, width) {
      if (isOpen) return false;

      this.setSubMenuPosition(element, width);

      return true;
    },
    /**
     * Set sub menu position
     *
     * @param {Object}  element the target element when click
     * @param {Number}  width   width of sub menu
     */
    setSubMenuPosition(element, width) {
      const parentElement = element.parentElement;

      const { x, y } = parentElement.getBoundingClientRect();

      this.subMenuPos.x = x - width;
      this.subMenuPos.y = y;
    },
    /**
     * Get status name from current status value
     *
     * @returns {String}  status name
     */
    getStatusName() {
      const process = PROCESS_STATUS_OPTIONS.find(
        ({ value }) => this.status === value
      );

      return process?.name;
    },
    /**
     * Emit  event to parent
     */
    onMenuLoaded(event) {
      this.$emit('loaded', event);
    }
  }
};
