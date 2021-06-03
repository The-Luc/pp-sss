import PropertiesManager from '@/containers/PropertiesManager';
import ToolPopoverManager from '@/containers/ToolPopoverManager';

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
