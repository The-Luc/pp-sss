import PropertiesManager from '@/components/PropertiesManager';
import ToolPopoverManager from '@/components/ToolPopoverManager';

export default {
  components: {
    PropertiesManager,
    ToolPopoverManager
  },
  props: {
    isOpenMenuProperties: {
      type: Boolean,
      default: false
    },
    selectedToolName: {
      type: String,
      default: ''
    }
  }
};
