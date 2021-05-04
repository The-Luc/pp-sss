export default {
  methods: {
    toogleSummary: () => {
      const targetClassList = document.getElementById('manager-summary')
        .classList;
      const sectionListClassList = document.getElementById(
        'manager-section-list'
      ).classList;

      if (targetClassList.contains('collapse')) {
        targetClassList.remove('collapse');
        sectionListClassList.remove('collapse');
      } else {
        targetClassList.add('collapse');
        sectionListClassList.add('collapse');
      }
    }
  }
};
