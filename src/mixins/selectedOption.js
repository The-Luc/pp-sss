export const SelectedOption = {
  methods: {
    /**
     * Get the selected option object standard
     * @param {Object | Number | String} data the selected payload
     * @param {String} unit the unit suffix (pt, px)
     * @returns the selected object { name, value }
     */
    getSelectedOption: function(data, unit) {
      if (typeof data === 'object') {
        return { name: data.name, value: data.value };
      }

      return { name: `${data} ${unit}`, value: data };
    }
  }
};
