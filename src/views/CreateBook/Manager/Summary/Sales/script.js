import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('project', ['project']),
    price() {
      return this.project.price.toFixed(2);
    }
  }
};
