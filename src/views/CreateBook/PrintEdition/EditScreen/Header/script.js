import PpButton from '@/components/Button';
export default {
  components: {
    PpButton
  },
  props: {
    nameEditor: {
      type: String,
      required: true
    }
  },
  methods: {
    onChangeView() {
      this.$router.go(-1);
    }
  }
};
