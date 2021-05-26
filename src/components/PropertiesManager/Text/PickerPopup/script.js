import { Photoshop } from 'vue-color';

let defaultProps = {
  hex: '#194d33e6',
  hsl: {
    h: 150,
    s: 0.5,
    l: 0.2,
    a: 0.9
  },
  hsv: {
    h: 150,
    s: 0.66,
    v: 0.3,
    a: 0.9
  },
  rgba: {
    r: 159,
    g: 96,
    b: 43,
    a: 0.9
  },
  a: 0.9
};

export default {
  components: {
    'photoshop-picker': Photoshop
  },
  data() {
    return {
      colors: defaultProps
    };
  },
  computed: {
    bgc() {
      return this.colors.hex;
    }
  },
  methods: {
    onOk() {
      console.log('ok');
    },
    onCancel() {
      console.log('cancel');
    },
    updateValue(value) {
      this.colors = value;
    }
  }
};
