const DATA_TOGGLE = 'data-toggle';

export default {
  methods: {
    toogleSummary: function() {
      const COLLPAPSE = 'collapse';
      const EXPAND = 'expand';

      const target = document.getElementById('manager-summary');

      if (target.getAttribute(DATA_TOGGLE) === COLLPAPSE) {
        this.setToggleData(EXPAND);
      }
      else {
        this.setToggleData(COLLPAPSE);
      }
    },
    setToggleData: function(toggleData) {
      const target = document.getElementById('manager-summary');
      const sectionList = document.getElementById('manager-section-list');
  
      target.setAttribute(DATA_TOGGLE, toggleData);
      sectionList.setAttribute(DATA_TOGGLE, toggleData);
    }
  }
};
