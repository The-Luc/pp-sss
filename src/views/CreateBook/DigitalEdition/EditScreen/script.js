import ToolBar from './ToolBar';
import Header from '@/components/HeaderEdition/Header';
import FeedbackBar from '@/components/HeaderEdition/FeedbackBar';
import PageEdition from './PageEdition';
import SidebarSection from './SidebarSection';

export default {
  components: {
    ToolBar,
    Header,
    FeedbackBar,
    PageEdition,
    SidebarSection
  },
  methods: {
    /**
     * Save digital canvas and change view
     */
    onClickSaveDigitalCanvas() {
      this.$router.go(-1);
    }
  }
};
