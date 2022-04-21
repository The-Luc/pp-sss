import {
  calcAngle,
  numberToAngle,
  numberToPositiveAngle,
  toSnapAngle
} from '@/common/utils';
import { debounce } from 'lodash';

export default {
  props: {
    angle: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      active: false,
      shouldSnap: false,
      currentAngle: 0,
      rotation: 0,
      startAngle: 0,
      center: { x: 0, y: 0 },
      angleStyle: { transform: 'none' }
    };
  },
  watch: {
    angle(val) {
      if (!this.active) {
        this.currentAngle = val;
        this.updateStyle(val);
      }
    }
  },
  mounted() {
    this.currentAngle = this.angle;
    this.updateStyle(this.angle);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('keydown', this.onKeyPress);
    document.addEventListener('keyup', this.onKeyPress);
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('keydown', this.onKeyPress);
    document.removeEventListener('keyup', this.onKeyPress);
  },
  methods: {
    /**
     * Update element rotation
     * @param {Number} angle - the current rotate angle deg
     */
    updateStyle(angle) {
      this.angleStyle = { transform: `rotate(${angle}deg)` };
    },
    /**
     * Get bounding rect of a dom element
     * @returns {Object} - the Bounding Client Rect object
     */
    getBoundingClientRect() {
      return this.$refs.circle.getBoundingClientRect();
    },
    onKeyPress(e) {
      const timer = e.shiftKey ? 0 : 100;
      setTimeout(() => {
        this.shouldSnap = e.shiftKey;
      }, timer);
    },
    /**
     * Handle mouse down event
     * @param {MouseEvent} e - the mouse event from user
     */
    onMouseDown(e) {
      e.preventDefault();
      const rect = this.getBoundingClientRect(),
        t = rect.top,
        l = rect.left,
        h = rect.height,
        w = rect.width;
      this.center = {
        x: l + w / 2,
        y: t + h / 2
      };
      const x = e.clientX - this.center.x,
        y = e.clientY - this.center.y;
      this.startAngle = calcAngle(x, y);
      this.active = true;
    },
    /**
     * Handle mouse mouse event
     * @param {MouseEvent} e - the mouse event from user
     */
    onMouseMove(e) {
      if (this.active) {
        e.preventDefault();
        this.rotate(e);
      }
    },
    /**
     * Handle mouse up event
     * @param {MouseEvent} e - the mouse event from user
     */
    onMouseUp(e) {
      if (this.active) {
        e.preventDefault();
        this.stop();
      }
    },
    /**
     * Handle rotation
     * @param {MouseEvent} e - the mouse event from user
     */
    rotate(e) {
      e.preventDefault();
      const x = e.clientX - this.center.x,
        y = e.clientY - this.center.y,
        d = calcAngle(x, y);

      this.rotation = d - this.startAngle;
      let angle = numberToAngle(this.currentAngle + this.rotation);
      if (this.shouldSnap) {
        angle = toSnapAngle(angle);
        this.rotation = angle - this.currentAngle;
      }
      this.updateStyle(angle);
      this.triggerChange(numberToPositiveAngle(angle));
    },
    /**
     * Handle stop rotation
     */
    stop() {
      this.currentAngle += this.rotation;
      this.currentAngle = numberToPositiveAngle(this.currentAngle);

      this.emitChange(this.currentAngle);
      this.active = false;
    },
    /**
     * Timer function to trigger change while user dragging the mouse
     * @param {Number} angle - the current angle to emit via event payload
     */
    triggerChange: debounce(function(angle) {
      this.emitChange(angle);
    }, 50),
    /**
     * Emit change event to parent component
     * @param {Number} angle - the current angle to emit via event payload
     */
    emitChange(angle) {
      this.$emit('change', Math.round(angle));
    }
  }
};
