import { fabric } from 'fabric';

import { createBackgroundFabricObject } from '@/common/fabricObjects';
import { isEmpty } from '@/common/utils';

import { OBJECT_TYPE, PLAY_IN_STYLES, TRANSITION } from '@/common/constants';

export default {
  components: {},
  props: {
    playbackData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mainCanvas: null,
      secondaryCanvas: null,
      transitionCss: ''
    };
  },
  async mounted() {
    window.addEventListener('resize', this.onResized);

    await this.initCanvases();

    await this.drawInitialObject(this.playbackData[0].objects, this.mainCanvas);

    await this.playbackAll();

    setTimeout(this.onFinish, 1000);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResized);
  },
  methods: {
    /**
     * Emit finish event to parent
     */
    onFinish() {
      this.$emit('finish');
    },
    /**
     * Fire when resize
     */
    onResized() {
      const width = this.mainCanvas.wrapperEl.clientWidth;
      const height = this.mainCanvas.wrapperEl.clientHeight;
      const zoom = width / 1920;

      this.resizeCanvas(width, height, zoom, this.mainCanvas);
      this.resizeCanvas(width, height, zoom, this.secondaryCanvas);
    },
    /**
     *
     * @param {Number}  width   width of canvas
     * @param {Number}  height  height of canvas
     * @param {Number}  zoom    zoom of canvas
     * @param {Object}  canvas  using canvas
     */
    resizeCanvas(width, height, zoom, canvas) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.setZoom(zoom);
    },
    /**
     * Init canvas
     *
     * @returns {Promise}
     */
    initCanvases() {
      return new Promise(resolve => {
        this.mainCanvas = this.initCanvas(this.$refs.playbackCanvas1);
        this.secondaryCanvas = this.initCanvas(this.$refs.playbackCanvas2);

        this.$nextTick(() => {
          this.onResized();

          resolve();
        });
      });
    },
    /**
     * Init canvas
     *
     * @param   {Object}  canvasElement canvas html element
     * @returns {Object}                fabric canvas
     */
    initCanvas(canvasElement) {
      return new fabric.Canvas(canvasElement, {
        backgroundColor: '#fff',
        preserveObjectStacking: true,
        selectable: false,
        evented: false
      });
    },
    /**
     * Playback all frames
     */
    async playbackAll() {
      if (this.playbackData.length < 2) return;

      for (let i = 0; i < this.playbackData.length; i++) {
        await this.playback(i);
      }
    },
    /**
     * Playback frame
     *
     * @param   {Number}  index index of selected frame
     * @returns {Promise}
     */
    async playback(index) {
      const hasNext = index < this.playbackData.length - 1;
      const nextObjects = hasNext ? this.playbackData[index + 1].objects : null;

      if (isEmpty(nextObjects)) {
        await this.playAnimation(this.playbackData[index]);

        return;
      }

      await Promise.all([
        this.playAnimation(this.playbackData[index]),
        this.drawInitialObject(nextObjects, this.secondaryCanvas)
      ]);

      if (isEmpty(this.playbackData[index].transition)) return;

      await this.playTransition(this.playbackData[index].transition);
    },
    /**
     * Play transition between frames
     *
     * @param   {Object}  transitionData  data of transition
     * @returns {Promise}
     */
    async playTransition(transitionData) {
      const { transition, direction, duration } = transitionData;

      const cssClass = this.getTransitionCssClass(transition, direction);

      const mainContainer = this.mainCanvas.wrapperEl.parentNode;
      const secondaryContainer = this.secondaryCanvas.wrapperEl.parentNode;

      await this.beginTransition(
        mainContainer,
        secondaryContainer,
        cssClass,
        duration
      );

      return new Promise(resolve => {
        setTimeout(() => {
          this.endTransition(mainContainer, secondaryContainer, cssClass);

          resolve();
        }, duration * 1000);
      });
    },
    /**
     * Play animation of objects
     *
     * @param   {Object}  frameData  data of current frame
     * @returns {Promise}
     */
    playAnimation(frameData) {
      frameData; // TODO: use for animation

      return new Promise(resolve => setTimeout(resolve, 2000));
    },
    /**
     * Draw background and "None Play In Animation" object
     *
     * @param {Array}   objects list of object of current frame
     * @param {Object}  canvas  canvas is used to draw objects into
     */
    async drawInitialObject(objects, canvas) {
      const inititalObjects = objects.filter(({ animationIn }) => {
        return isEmpty(PLAY_IN_STYLES[animationIn?.style]);
      });

      const drawObjectMethods = {
        [OBJECT_TYPE.BACKGROUND]: this.drawBackground,
        [OBJECT_TYPE.TEXT]: this.fakeDrawingMethod,
        [OBJECT_TYPE.SHAPE]: this.fakeDrawingMethod,
        [OBJECT_TYPE.CLIP_ART]: this.fakeDrawingMethod,
        [OBJECT_TYPE.IMAGE]: this.fakeDrawingMethod,
        [OBJECT_TYPE.VIDEO]: this.fakeDrawingMethod,
        [OBJECT_TYPE.PORTRAIT_IMAGE]: this.fakeDrawingMethod
      };

      const drawObjectPromises = inititalObjects.map(obj => {
        return drawObjectMethods[obj.type](obj, canvas);
      });

      const fabricObjects = await Promise.all(drawObjectPromises);

      canvas.add(...fabricObjects.filter(fb => !isEmpty(fb)));

      canvas.requestRenderAll();
    },
    /**
     * Draw background and "None Play In Animation" object
     *
     * @param {Object}  background  background of current frame
     * @param {Object}  canvas      canvas is used to draw background into
     */
    async drawBackground(background, canvas) {
      return await createBackgroundFabricObject(background, canvas);
    },
    /**
     * Fake drawing method, will be removed after implement real method
     */
    fakeDrawingMethod() {
      return new Promise(resolve => resolve());
    },
    /**
     * Get transition css class
     *
     * @param   {String}  transition  transition
     * @param   {String}  direction   direction
     * @returns {Object}              css class
     */
    getTransitionCssClass(transition, direction) {
      const directionValue =
        transition === TRANSITION.NONE || transition === TRANSITION.DISSOLVE
          ? ''
          : direction;

      const cssClass = `transition-${transition}-${directionValue}`;

      return {
        enterActive: `${cssClass}-enter-active`,
        enterTo: `${cssClass}-enter-to`,
        leaveActive: `${cssClass}-leave-active`,
        leaveTo: `${cssClass}-leave-to`
      };
    },
    /**
     * Begin transition process
     *
     * @param   {Object}  mainContainer       container of main canvas
     * @param   {Object}  secondaryContainer  container of secondary canvas
     * @param   {Object}  cssClass            css class for trainsition
     * @param   {Number}  duration            transition duration
     * @returns {Promise}
     */
    beginTransition(mainContainer, secondaryContainer, cssClass, duration) {
      return new Promise(resolve => {
        secondaryContainer.classList.remove('preparation');
        secondaryContainer.classList.add(cssClass.enterActive);

        mainContainer.classList.add(cssClass.leaveActive);

        setTimeout(() => {
          this.transitionCss = isEmpty(duration) ? '' : `all ${duration}s`;

          setTimeout(() => {
            secondaryContainer.classList.add(cssClass.enterTo);

            mainContainer.classList.add(cssClass.leaveTo);

            resolve();
          }, 10);
        }, 10);
      });
    },
    /**
     * End transition process
     *
     * @param {Object}  mainContainer       container of main canvas
     * @param {Object}  secondaryContainer  container of secondary canvas
     * @param {Object}  cssClass            css class for trainsition
     */
    endTransition(mainContainer, secondaryContainer, cssClass) {
      this.transitionCss = '';

      mainContainer.classList.remove(cssClass.leaveActive);
      mainContainer.classList.remove(cssClass.leaveTo);

      secondaryContainer.classList.remove(cssClass.enterActive);
      secondaryContainer.classList.remove(cssClass.enterTo);

      const mainCanvas = this.mainCanvas;
      const secondaryCanvas = this.secondaryCanvas;

      const tempCanvas = mainCanvas;

      this.mainCanvas = secondaryCanvas;
      this.secondaryCanvas = tempCanvas;

      mainContainer.classList.add('preparation');
    }
  }
};
