import { mapState } from 'vuex';
import moment from 'moment';
export default {
  computed: {
    ...mapState('project', ['project']),
    dueDate() {
      let date = moment(new Date(this.project.releaseDate)).format('MM/DD/YY');
      return date;
    },
    deliveryDate() {
      let date = moment(new Date(this.project.releaseDate))
        .add(14, 'days')
        .format('MM/DD/YY');
      return date;
    },
    countdown(){
      let dueDate =  moment(this.project.releaseDate, 'MM/DD/YYYY');
      let currentDate = moment(new Date());
      return moment(dueDate).diff(currentDate, 'days');
    }
  }
};
