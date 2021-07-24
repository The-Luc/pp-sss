import ButtonDelete from '@/components/Menu/ButtonDelete';
import ButtonAdd from '@/components/Menu/ButtonAdd';
import Menu from '@/components/Menu';
import Calendar from './Calendar';
import SectionStatus from './SectionStatus';
import Assignee from './Assignee';

import { mapGetters, mapMutations } from 'vuex';
import moment from 'moment';

import {
  MODAL_TYPES,
  ICON_LOCAL,
  DATE_FORMAT,
  PROCESS_STATUS
} from '@/common/constants';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';

import {
  useMutationSection,
  useSectionActionMenu,
  useAssigneeMenu
} from '@/hooks';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Menu,
    Calendar,
    SectionStatus,
    Assignee,
    ButtonDelete,
    ButtonAdd
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
    const { updateSection: updateSectionDb } = useMutationSection();
    const { updateSection, updateAssignee } = useSectionActionMenu();
    const { getUsers } = useAssigneeMenu();

    return {
      updateSectionDb,
      updateSection,
      updateAssignee,
      getUsers
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
      users: [],
      menuItems: [
        { title: 'Status', value: this.getStatusName(), name: 'status' },
        { title: 'Due Date', value: this.dueDate, name: 'dueDate' },
        { title: 'Assigned To', value: 'Unassigned', name: 'assignee' }
      ]
    };
  },
  computed: {
    ...mapGetters({
      sectionSelected: GETTERS.SECTION_SELECTED,
      sections: BOOK_GETTERS.SECTIONS_NO_SHEET,
      maxPage: BOOK_GETTERS.GET_MAX_PAGE,
      totalInfo: BOOK_GETTERS.TOTAL_INFO
    }),
    isShowAdd() {
      let index = this.sections.findIndex(item => item.id === this.sectionId);

      return !(this.totalInfo.totalPages >= this.maxPage || !index);
    },
    isShowDelete() {
      const index = this.sections.findIndex(item => item.id === this.sectionId);

      const isCover = index === 0;
      const isHalfSheet = index === 1 || index === this.sections.length - 1;

      return !isCover && !isHalfSheet;
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

    this.setAssigneeName();
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      addSheet: BOOK_MUTATES.ADD_SHEET,
      setSectionSelected: MUTATES.SET_SELECTION_SELECTED
    }),
    onOpenModal() {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.DELETE_SECTION,
          props: { sectionId: this.sectionId, sectionName: this.sectionName }
        }
      });
    },
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

      if (this.isOpenMenu && !isSubMenuOpen) this.setSectionSelected('');
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
    setIsOpenMenu(sectionSelected) {
      this.isOpenMenu = sectionSelected === this.sectionId;
    },
    /**
     * Fire when user click to select due date
     *
     * @param {String}  date  selected date
     */
    async onChangeDueDate({ date }) {
      const dueDate = moment(date).format(DATE_FORMAT.BASE);

      const { isSuccess } = await this.updateSectionDb(1719, this.sectionId, {
        dueDate
      });

      if (!isSuccess) return;

      this.updateSection({ id: this.sectionId, dueDate });

      this.menuItems[1].value = dueDate;

      setTimeout(() => {
        this.isOpenCalendar = false;
      }, 0);
    },
    /**
     * Fire when user click to select a status
     *
     * @param {Number}  status selected status
     */
    async onChangeStatus({ status }) {
      const { isSuccess } = await this.updateSectionDb(1719, this.sectionId, {
        status: status.value
      });

      if (!isSuccess) return;

      this.updateSection({ id: this.sectionId, status: status.value });

      this.menuItems[0].value = status.name;

      setTimeout(() => {
        this.isOpenStatus = false;
      }, 0);
    },
    /**
     * Fire when user click to select a community member to assign
     *
     * @param {String | Number} id    selected community member id
     * @param {String}          name  selected community member name
     */
    async onChangeAssignee({ id, name }) {
      const assigneeId = this.assigneeId === id ? -1 : id;
      const assignee = this.assigneeId === id ? 'Unassigned' : name;

      await this.updateAssignee({ id: this.sectionId, assigneeId });

      this.menuItems[2].value = assignee;

      setTimeout(() => {
        this.isOpenAssignee = false;
      }, 0);
    },
    onAddSheet() {
      this.setSectionSelected('');

      this.addSheet({ sectionId: this.sectionId });
    },
    onScroll() {
      if (this.isOpenMenu) this.setSectionSelected('');
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
      const process = Object.values(PROCESS_STATUS).find(
        ({ value }) => this.status === value
      );

      return isEmpty(process) ? PROCESS_STATUS.NOT_STARTED.name : process.name;
    },
    /**
     * Set assignee name to menu item
     */
    setAssigneeName() {
      const user = this.users.find(({ id }) => id === this.assigneeId);

      if (isEmpty(user)) return;

      this.menuItems[2].value = user.name;
    }
  }
};
