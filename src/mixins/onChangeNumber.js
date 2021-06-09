import { isEmpty } from '@/common/utils';

export const OnChangeNumber = {
  methods: {
    /**
     * 
     * @param {Object | Number | String} data the input value
     * @param {String} attribute the properties is being editted
     * @param {Number} min the smallest value accepted
     * @param {Number} max the biggest value accepted
     * @param {String} eventName the name of the event to be triggered
     * @returns void
     */
    onChangeNumber: function(data, attribute, min, max, eventName) {
      if (isEmpty(data)) {
        this.$root.$emit(eventName, {});
        return;
      }
      const isString = typeof data === 'string';
      const digitRegex = new RegExp(/^[\d]{1,}$/g);
      if (isString && !digitRegex.test(data)) {
        this.$root.$emit(eventName, {});
        return;
      }
      const value = isString ? parseInt(data, 10) : data.value;
      const acceptValue = value > max ? max : value < min ? min : value;
      this.$root.$emit(eventName, { [attribute]: acceptValue });
    }
  }
};
