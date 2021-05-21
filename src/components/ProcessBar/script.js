import { PROCESS_STATUS } from '@/common/constants/processStatus';

import BlockBar from '@/components/BlockBar';

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
      return this.status === PROCESS_STATUS.NOT_STARTED.value;
    },
    processItems: function() {
      return [
        {
          color: this.getColor(PROCESS_STATUS.NOT_STARTED),
          dataAttributes: this.getDataAttribute(PROCESS_STATUS.IN_PROCESS)
        },
        {
          color: this.getColor(PROCESS_STATUS.IN_PROCESS),
          dataAttributes: this.getDataAttribute(PROCESS_STATUS.COMPLETED)
        },
        {
          color: this.getColor(PROCESS_STATUS.COMPLETED),
          dataAttributes: this.getDataAttribute(PROCESS_STATUS.APPROVED)
        }
      ];
    }
  },
  methods: {
    /**
     * Get Color for this process or null if current status is not pass this process
     * @param   {Object} validStatus the process status need to pass to validate
     * @returns {String}
     */
    getColor: function(validStatus) {
      return this.status > validStatus.value ? this.color : null;
    },
    /**
     * Get value of data attribute base on process name
     * @param   {Object} processStatus process status use to get name to get attribute value
     * @returns {String}
     */
    getAttrDataValue: function(processStatus) {
      const lowerCaseName = processStatus.name.toLowerCase();

      return lowerCaseName.replace(' ', '-');
    },
    /**
     * Get data attribute
     * @param   {Object} processStatus process status use to get data attribute value
     * @returns {Object}
     */
    getDataAttribute: function(processStatus) {
      return [
        {
          name: 'data-process',
          value: this.getAttrDataValue(processStatus)
        }
      ];
    }
  }
};
