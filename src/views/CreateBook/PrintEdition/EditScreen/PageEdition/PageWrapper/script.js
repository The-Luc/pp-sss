import AddBoxInstruction from '@/components/AddBoxInstruction';
const ELEMENTS = {
  TEXT: 'a text box',
  IMAGE: 'an image box'
};

export default {
  components: {
    AddBoxInstruction
  },
  data() {
    return {
      element: '',
      x: 0,
      y: 0,
      visible: false
    };
  },
  methods: {
    positionWithinCanvas: function(clientX, clientY, top, left, width, height) {
      const x = clientX - left;
      const y = clientY - top;
      const visible = x > 0 && y > 0 && width - x > 0 && height - y > 0;
      return {
        x,
        y,
        visible
      };
    }
  },
  mounted() {
    const handleBodyMouseMove = ({ clientX, clientY }) => {
      const canvas = window.printCanvas || window.digitalCanvas;
      if (canvas) {
        const {
          top,
          left,
          width,
          height
        } = canvas.lowerCanvasEl.getBoundingClientRect();
        const { x, y, visible } = this.positionWithinCanvas(
          clientX,
          clientY,
          top,
          left,
          width,
          height
        );
        this.x = x;
        this.y = y;
        this.visible = visible;
      }
    };

    const handleKeyPress = event => {
      const key = event.keyCode || event.charCode;
      if (key === 27) {
        this.$root.$emit('enscapeInstruction');
      }
    };

    this.$root.$on('printInstructionStart', ({ element }) => {
      if (ELEMENTS[element] !== this.element) {
        this.element = ELEMENTS[element] || 'box';
      }
      document.body.addEventListener('mousemove', handleBodyMouseMove);
      document.body.addEventListener('keyup', handleKeyPress);
    });
    this.$root.$on('printInstructionEnd', () => {
      this.element = '';
      this.visible = false;
      this.x = 0;
      this.y = 0;
      document.body.removeEventListener('mousemove', handleBodyMouseMove);
      document.body.removeEventListener('keyup', handleKeyPress);
    });
  }
};
