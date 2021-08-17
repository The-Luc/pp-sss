import Footer from '@/components/ModalMediaSelection/Footer';

import { usePhotos } from '@/views/CreateBook/composables';

export default {
  components: {
    Footer
  },
  setup() {
    const { isPhotoVisited } = usePhotos();

    return {
      isPhotoVisited
    };
  },
  data() {
    return {
      currentTab: '',
      defaultTab: 'smart-box'
    };
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShowFooter() {
      return this.currentTab !== 'add';
    }
  },
  methods: {
    /**
     * Emit select event to parent
     */
    onSelect() {
      console.log('select');
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
      this.defaultTab = null;
    },
    /**
     * Event change tab of modal photo
     * @param   {String}  tab  current tab
     */
    onChangeTab(tab) {
      this.currentTab = tab;
    }
  }
};
