import ButtonProperty from '@/components/ButtonProperty';
export default {
  components: {
    ButtonProperty
  },
  methods: {
    onClick(event) {
      this.$emit('click', event);
    }
  }
};
