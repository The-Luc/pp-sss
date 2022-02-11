import { fabric } from 'fabric';

import {
  createBackgroundFabricObject,
  createClipartObject,
  createMediaObject,
  createPortraitImageObject,
  createSvgObject,
  createTextBoxObject
} from '@/common/fabricObjects';
import {
  isEmpty,
  multiObjectsAnimation,
  waitMiliseconds,
  getRefElement,
  setActiveEdition
} from '@/common/utils';

import {
  EDITION,
  OBJECT_TYPE,
  THUMBNAIL_IMAGE_CONFIG,
  TRANSITION
} from '@/common/constants';
import { useAppCommon } from '@/hooks';

export default {
  props: {
    playbackData: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const { setLoadingState } = useAppCommon();
    return {
      mainCanvas: null,
      secondaryCanvas: null,
      mask: null,
      transitionCss: '',
      maskUrl: '',
      isDestroyed: false,
      setLoadingState
    };
  },
  async mounted() {
    window.addEventListener('resize', this.onResized);

    this.setLoadingState({ value: true });
    await this.preloadMedia(this.playbackData);
    this.setLoadingState({ value: false });

    await this.initCanvases();

    await this.drawInitialObjects(
      this.playbackData[0].objects,
      this.mainCanvas
    );

    // prevent blank canvas appear at beginning of the playback
    this.$emit('showCanvas');

    await this.playbackAll();

    setTimeout(this.onFinish, 1000);
  },
  beforeDestroy() {
    setActiveEdition(window.digitalCanvas, EDITION.DIGITAL);

    this.isDestroyed = true;

    window.removeEventListener('resize', this.onResized);

    this.getVideoOnCanvas().forEach(v => v.pause());
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
        this.mainCanvas = this.initCanvas('playbackCanvas1');
        this.secondaryCanvas = this.initCanvas('playbackCanvas2');
        this.mask = getRefElement(this.$refs, 'mask');

        this.$nextTick(() => {
          this.onResized();

          resolve();
        });
      });
    },
    /**
     * Init canvas
     *
     * @param   {String}  canvasRefName canvas ref name
     * @returns {Object}                fabric canvas
     */
    initCanvas(canvasRefName) {
      return new fabric.Canvas(getRefElement(this.$refs, canvasRefName), {
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
      for (let i = 0; i < this.playbackData.length; i++) {
        if (this.isDestroyed) break;

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

      // case nextObject = [] should not fall into this if, only for null check
      if (!nextObjects) {
        await this.playAnimation(this.playbackData[index]);

        return;
      }

      this.secondaryCanvas.remove(...this.secondaryCanvas.getObjects());

      await this.drawInitialObjects(nextObjects, this.secondaryCanvas);

      await this.playAnimation(this.playbackData[index]);

      if (this.isDestroyed || isEmpty(this.playbackData[index].transition)) {
        return;
      }

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
        duration,
        transition === TRANSITION.WIPE
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
    async playAnimation(frameData) {
      setActiveEdition(this.mainCanvas, EDITION.DIGITAL);

      const { delay, objects, playInIds, playOutIds } = frameData;

      const delayDuration = delay ?? 3;

      // Handle play in animation
      await multiObjectsAnimation(objects, this.mainCanvas, playInIds, true);

      // play video if existed
      this.playVideo();

      await waitMiliseconds(delayDuration * 1000);

      // Handle play out animation
      await multiObjectsAnimation(objects, this.mainCanvas, playOutIds);
    },
    /**
     * Draw objects on canvas
     *
     * @param {Array}   objects list of object of current frame
     * @param {Object}  canvas  canvas is used to draw objects into
     */
    async drawInitialObjects(objects, canvas) {
      const drawObjectMethods = {
        [OBJECT_TYPE.BACKGROUND]: this.drawBackground,
        [OBJECT_TYPE.TEXT]: this.drawText,
        [OBJECT_TYPE.SHAPE]: this.drawSvg,
        [OBJECT_TYPE.CLIP_ART]: this.drawClipart,
        [OBJECT_TYPE.IMAGE]: this.drawMedia,
        [OBJECT_TYPE.VIDEO]: this.drawMedia,
        [OBJECT_TYPE.PORTRAIT_IMAGE]: this.drawPortraitImage
      };

      const drawObjectPromises = objects.map(obj => {
        return drawObjectMethods[obj.type](obj, canvas);
      });

      const fabricObjects = await Promise.all(drawObjectPromises);

      this.preprocessingObjects(objects, fabricObjects);

      canvas.add(...fabricObjects);

      canvas.requestRenderAll();
    },
    /**
     * Draw background
     *
     * @param {Object}  background  background of current frame
     * @param {Object}  canvas      canvas is used to draw background into
     */
    async drawBackground(background, canvas) {
      return createBackgroundFabricObject(background, canvas);
    },
    /**
     *  Draw text
     *
     * @param {Object} objectData data of textbox
     * @returns a fabric object
     */
    async drawText(text) {
      const { object } = createTextBoxObject(text);
      return object;
    },

    /**
     *  Draw shape object
     *
     * @param {Object} objectData data of clipart or shape object
     * @returns a fabric object
     */
    async drawSvg(objectData) {
      return createSvgObject(objectData);
    },
    /**
     *  Draw  clipart object
     *
     * @param {Object} objectData data of clipart or shape object
     * @returns a fabric object
     */
    async drawClipart(objectData) {
      return createClipartObject(objectData);
    },
    /**
     *  Draw video / image
     *
     * @param {Object} objectData data of video / image
     * @returns a fabric object
     */
    async drawMedia(media) {
      return createMediaObject(media, this.videoCallback);
    },

    /**
     *  Draw portrait image
     *
     * @param {Object} portrait data of portrait
     * @returns a fabric object
     */
    async drawPortraitImage(portrait) {
      return createPortraitImageObject(portrait);
    },
    /**
     * To get videos on main canvas
     *
     * @returns {Array} array of video object on canvas
     */
    getVideoOnCanvas() {
      return this.mainCanvas
        .getObjects()
        .filter(o => o.objectType === OBJECT_TYPE.VIDEO);
    },
    /**
     *  To configurate video after playing
     *
     * @param {Number} id id of playing video
     */
    videoCallback(id) {
      const video = this.getVideoOnCanvas().find(o => o.id === id);

      video.set({
        showPlayIcon: false,
        showThumbnail: false
      });
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
     * @param   {Boolean} isWipe              is wipe transtion
     * @returns {Promise}
     */
    async beginTransition(
      mainContainer,
      secondaryContainer,
      cssClass,
      duration,
      isWipe
    ) {
      return new Promise(resolve => {
        this.setTransitionActiveStyle(
          mainContainer,
          secondaryContainer,
          cssClass,
          isWipe
        );

        setTimeout(() => {
          this.transitionCss = isEmpty(duration) ? '' : `all ${duration}s`;

          setTimeout(() => {
            this.setTransitionEndStyle(
              mainContainer,
              secondaryContainer,
              cssClass,
              isWipe
            );

            resolve();
          }, 10);
        }, 10);
      });
    },
    /**
     * Set active transition style
     *
     * @param {Object}  mainContainer       container of main canvas
     * @param {Object}  secondaryContainer  container of secondary canvas
     * @param {Object}  cssClass            css class for trainsition
     * @param {Boolean} isWipe              is wipe transtion
     */
    setTransitionActiveStyle(
      mainContainer,
      secondaryContainer,
      cssClass,
      isWipe
    ) {
      secondaryContainer.classList.remove('preparation');
      secondaryContainer.classList.add(cssClass.enterActive);

      mainContainer.classList.add(cssClass.leaveActive);

      if (!isWipe) return;

      this.maskUrl = this.mainCanvas.toDataURL({
        format: THUMBNAIL_IMAGE_CONFIG.FORMAT
      });

      this.mask.classList.add(cssClass.enterActive);
    },
    /**
     * Set end transition style
     *
     * @param {Object}  mainContainer       container of main canvas
     * @param {Object}  secondaryContainer  container of secondary canvas
     * @param {Object}  cssClass            css class for trainsition
     * @param {Boolean} isWipe              is wipe transtion
     */
    setTransitionEndStyle(mainContainer, secondaryContainer, cssClass, isWipe) {
      secondaryContainer.classList.add(cssClass.enterTo);

      mainContainer.classList.add(cssClass.leaveTo);

      if (isWipe) this.mask.classList.add(cssClass.enterTo);
    },
    /**
     * End transition process
     *
     * @param {Object}  mainContainer       container of main canvas
     * @param {Object}  secondaryContainer  container of secondary canvas
     * @param {Object}  cssClass            css class for trainsition
     */
    endTransition(mainContainer, secondaryContainer, cssClass) {
      this.removeTransition(mainContainer, secondaryContainer, cssClass);

      this.swapCanvas();

      mainContainer.classList.add('preparation');
    },
    /**
     * Remove transition css class
     *
     * @param {Object}  mainContainer       container of main canvas
     * @param {Object}  secondaryContainer  container of secondary canvas
     * @param {Object}  cssClass            css class for trainsition
     */
    removeTransition(mainContainer, secondaryContainer, cssClass) {
      this.transitionCss = '';
      this.maskUrl = '';

      mainContainer.classList.remove(cssClass.leaveActive);
      mainContainer.classList.remove(cssClass.leaveTo);

      secondaryContainer.classList.remove(cssClass.enterActive);
      secondaryContainer.classList.remove(cssClass.enterTo);

      this.mask.classList.remove(cssClass.enterActive);
      this.mask.classList.remove(cssClass.enterTo);
    },
    /**
     * Swap canvas
     */
    swapCanvas() {
      const mainCanvas = this.mainCanvas;
      const secondaryCanvas = this.secondaryCanvas;

      const tempCanvas = mainCanvas;

      this.mainCanvas = secondaryCanvas;
      this.secondaryCanvas = tempCanvas;
    },
    /**
     * To preprocessing object before render on canvas
     *
     * @param {Object} objects ppObject data
     * @param {Object} fbObjects fabric object data
     */
    preprocessingObjects(objects, fbObjects) {
      const nonAnimationObjectIds = Object.values(objects)
        .filter(o => o?.animationIn?.style)
        .map(o => o.id);

      fbObjects.forEach(o => {
        o.set({ selectable: false });

        nonAnimationObjectIds.includes(o.id) && o.set({ visible: false });

        if (o.objectType === OBJECT_TYPE.VIDEO) o.set({ showPlayIcon: false });
      });
    },

    /**
     * Handle play video in order
     */
    playVideo() {
      let timeCounter = 0.2;

      this.getVideoOnCanvas().forEach(v => {
        setTimeout(() => v.play(), timeCounter * 1000);

        const playingDuration = v.endTime - v.startTime;
        timeCounter += playingDuration;
      });
    },
    /**
     * To pre-load all media before the playback happen
     * @param {Array} media array of frame being display in playback
     */
    preloadMedia(media) {
      /*
      Fields need to be loaded to keep playback in time

      Background: imageUrl,
      Clipart: imageUrl,
      Image, Video: imageUrl
      */

      return new Promise(resolve => {
        let totalElements = 0;
        let loadedElements = 0;

        const imageLoadedCallback = () => {
          loadedElements++;

          if (loadedElements === totalElements) resolve();
        };

        media.forEach(frame => {
          frame.objects.forEach(o => {
            if (!o.imageUrl) return;

            const img = new Image();
            img.onload = imageLoadedCallback;
            img.onerror = imageLoadedCallback;
            img.src = o.imageUrl;
            totalElements++;
          });
        });
      });
    }
  }
};
