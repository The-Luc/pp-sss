import CommonModal from '@/components/Modals/CommonModal';

export default {
  components: { CommonModal },
  props: {
    printLayout: {
      type: Object,
      default: () => ({})
    },
    digitalLayout: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    return {};
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    onCancel() {
      this.$emit('onCancel');
    },
    onSave() {
      console.log('onsave');
    }
  }
};
