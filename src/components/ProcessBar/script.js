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
  data() {
    const processAttrs = [
      this.getDataAttribute(PROCESS_STATUS.IN_PROCESS),
      this.getDataAttribute(PROCESS_STATUS.COMPLETED),
      this.getDataAttribute(PROCESS_STATUS.APPROVED)
    ];

    return {
      processAttrs: processAttrs
    };
  },
  computed: {
    isShowDot: function() {
      return this.status === PROCESS_STATUS.NOT_STARTED.value;
    },
    processItems: function() {
      return [
        {
          color: this.getColor(PROCESS_STATUS.NOT_STARTED),
          dataAttributes: this.processAttrs[0]
        },
        {
          color: this.getColor(PROCESS_STATUS.IN_PROCESS),
          dataAttributes: this.processAttrs[1]
        },
        {
          color: this.getColor(PROCESS_STATUS.COMPLETED),
          dataAttributes: this.processAttrs[2]
        }
      ];
    }
  },
  methods: {
    /**
     * Get Color for this process or null if current status is not pass this process
     * @param  {Object} validStatus
     */
    getColor: function(validStatus) {
      return this.status > validStatus.value ? this.color : null;
    },
    /**
     * Get value of data attribute base on process name
     * @param  {Object} processStatus
     */
    getAttrDataValue: function(processStatus) {
      const lowerCaseName = processStatus.name.toLowerCase();

      return lowerCaseName.replace(' ', '-');
    },
    /**
     * Get data attribute
     * @param  {Object} processStatus
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
