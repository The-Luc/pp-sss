import Opactiy from './Opacity';

export default {
  components: {
    Opactiy
  },
  data() {
    return {
      textStyles: {
        opacity: 50
      }
    };
  },
  methods: {
    /**
     * Revice value opacity from chilren
     * @param   {Number}  value Value user input
     */
    onChange(value) {
      this.textStyles.opacity = value;
    }
  }
};
