import PpSelect from '@/components/Select';

export default {
  components: {
    PpSelect
  },
  data() {
    return {
      items: [
        {
          label: 'Cover Heading',
          value: 'coverHeading'
        },
        {
          label: 'Body Text',
          value: 'bodyText'
        }
      ]
    };
  },
  methods: {
    onChange(data) {
      console.log('data', data);
    }
  }
};
