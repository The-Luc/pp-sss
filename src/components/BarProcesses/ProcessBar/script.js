import BlockBar from '@/components/BarProcesses/BlockBar';

import { PROCESS_STATUS, PROCESS_STATUS_OPTIONS } from '@/common/constants';

export default {
  components: {
    BlockBar
  },
  props: {
    color: {
      type: String,
      require: true
    },
    status: {
      type: Number,
      require: true
    }
  },
  computed: {
    isShowDot: function() {
      return this.status === PROCESS_STATUS.NOT_STARTED;
    },
    processItems: function() {
      const showProcessItems = PROCESS_STATUS_OPTIONS.filter(
        ({ value }) => value !== PROCESS_STATUS.NOT_STARTED
      );

      return showProcessItems.map(({ name }, index) => {
        return {
          color: this.getColor(PROCESS_STATUS_OPTIONS[index]?.value),
          dataAttributes: [this.getDataAttribute(name)]
        };
      });
    }
  },
  methods: {
    /**
     * Get Color for this process or null if current status is not pass this process
     * @param   {Object} validStatus the process status need to pass to validate
     * @returns {String}
     */
    getColor: function(validStatus) {
      return this.status > validStatus ? this.color : null;
    },
    /**
     * Get value of data attribute base on process name
     * @param   {Object} processStatus process status use to get name to get attribute value
     * @returns {String}
     */
    getAttrDataValue: function(processStatus) {
      const lowerCaseName = processStatus.toLowerCase();

      return lowerCaseName.replace(' ', '-');
    },
    /**
     * Get data attribute
     * @param   {Object} processStatus process status use to get data attribute value
     * @returns {Object}
     */
    getDataAttribute: function(processStatus) {
      return {
        name: 'data-process',
        value: this.getAttrDataValue(processStatus)
      };
    }
  }
};
