import PageTitle from './PageTitle';
import Properties from './Properties';
import TextMargin from './TextMargin';
import DisplayPosition from './DisplayPosition';

export default {
  components: {
    PageTitle,
    Properties,
    TextMargin,
    DisplayPosition
  },
  methods: {
    /**
     * Change text properties for page title or name text
     * @param  {Object} data Receive value information to change
     */
    onChange(data) {
      console.log(data);
    }
  }
};
