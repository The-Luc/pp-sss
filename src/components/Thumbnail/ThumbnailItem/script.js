import Header from '../ThumbnailHeader';
import Content from './ThumbnailContent';
import Footer from './ThumbnailFooter';
import Action from '@/containers/Menu/Action';

import { LINK_STATUS, SHEET_TYPE } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Header,
    Content,
    Footer,
    Action
  },
  props: {
    section: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    sheetType: {
      type: [String, Number],
      default: SHEET_TYPE.NORMAL
    },
    linkType: {
      type: String,
      default: LINK_STATUS.NONE
    },
    thumbnailUrl: {
      type: String
    },
    toLink: {
      type: String,
      default: ''
    },
    pageNames: {
      type: Object,
      default: () => ({})
    },
    isActive: {
      type: Boolean,
      default: false
    },
    totalItem: {
      type: Number,
      default: 0
    },
    isEnable: {
      type: Boolean,
      default: false
    },
    isEditor: {
      type: Boolean,
      default: false
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    sheetId: {
      type: Number,
      default: null
    },
    selectedSheet: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      displayCssClass: '',
      customCssClass: [],
      menuX: 0,
      menuY: 0,
      isOpenMenu: false,
      menuClass: 'pp-menu section-menu',
      currentMenuHeight: 1
    };
  },
  mounted() {
    if (!this.isEditor) this.displayCssClass = 'col-3';

    const editorCssClass = this.isEditor ? 'editor' : '';
    const digitalCssClass = this.isDigital ? 'digital' : '';
    const disabledCssClass = this.isEnable ? '' : 'disabled';

    this.customCssClass = [
      editorCssClass,
      digitalCssClass,
      disabledCssClass
    ].filter(c => !isEmpty(c));

    this.$root.$on('menu', data => {
      setTimeout(() => {
        this.currentMenuHeight = data.$el.clientHeight;
        console.log(this.currentMenuHeight);
      }, 10);
    });
  },
  watch: {
    selectedSheet(id) {
      this.isOpenMenu = id === this.sheetId;
    }
  },
  methods: {
    /**
     * Emit event change link status
     */
    onUpdateLink() {
      this.$emit('updateLink');
    },
    /**
     * Select this sheet by emit to parent
     */
    onSelect() {
      this.$emit('select');
    },
    /**
     * Event fire when click more action
     * @param {Object} event fired event
     */
    toggleMenu(event) {
      const element = event.target;
      const windowHeight = window.innerHeight;
      const elementY = event.y;

      const { x, y } = element.getBoundingClientRect();
      this.menuX = x - 82;
      this.menuY = y;
      setTimeout(() => {
        if (windowHeight - elementY < this.currentMenuHeight) {
          this.menuY = y - this.currentMenuHeight - 45;
          this.menuClass = `${this.menuClass} section-menu-top`;
        } else {
          this.menuClass = `${this.menuClass} section-menu-bottom`;
          this.menuY = y;
        }
      }, 100);

      this.$emit('toggleMenu');
    },
    /**
     * Event fire when click outside menu or scroll
     */
    onCloseMenu() {
      this.$emit('closeMenu');
    },
    /**
     * Event fire when click preview button
     */
    onPreview() {
      this.$emit('preview');
    },
    /**
     * Event fire when click PDF button
     */
    onExportPDF() {
      this.$emit('export');
    }
  }
};
