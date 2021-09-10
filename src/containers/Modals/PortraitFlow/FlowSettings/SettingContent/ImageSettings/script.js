import Shadow from '@/components/Properties/Features/Shadow';
import Border from '@/components/Properties/Features/Border';

export default {
  components: { Shadow, Border },
  props: {
    imageSettings: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {}
};
