import Send from '@/components/Arrange/Send';
import Size from '@/components/Arrange/Size';
import Position from '@/components/Arrange/Position';
import Flip from '@/components/Arrange/Flip';
import Rotate from '@/components/Arrange/Rotate';

export default {
  components: {
    Send,
    Size,
    Position,
    Flip,
    Rotate
  },
  methods: {
    onClick(event) {
      console.log('event', event);
    }
  }
};
