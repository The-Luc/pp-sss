import ToolButton from '@/components/ToolButton';

export default {
  components: {
    ToolButton
  },
  props: {
    items: Array
  },
  methods: {
    /**
     * Emit event click when click on icon
     * @param  {object} item Icon's object selected
     */
    onClick(item) {
      this.$emit('click', item);
    }
  }
};
