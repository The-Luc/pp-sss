import ToolButton from '@/components/ToolButton';
export default {
  components: {
    ToolButton
  },
  props: {
    items: Array
  },
  methods: {
    themes() {
      console.log(0);
    },
    /**
     * Emit event click when click on icon
     * @param  {[type]} arg1 [description]
     * @param  {[type]} arg2 [description]
     * @return {[type]}      [description]
     */
    onClick(item) {
      this.$emit('click', item);
    }
  }
};
