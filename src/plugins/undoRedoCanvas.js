import { fabric } from 'fabric';

import {
  isEmpty,
  hasOwnProperty,
  isOk,
  isCtrlKey,
  resetObjects
} from '@/common/utils';

import { KEY_CODE, MAX_STEP_UNDO_REDO } from '@/common/constants';

import StoreTracker from './storeTracker';

class UndoRedoCanvas {
  _storeTracker = null;

  _canvas = null;

  _renderCanvasFn = null;

  /**
   * @param {Object} options  option for config
   */
  constructor(options) {
    if (!hasOwnProperty(options, 'canvas')) throw 'Canvas must be set';

    if (!hasOwnProperty(options, 'renderCanvasFn')) {
      throw 'Render canvas method must be set';
    }

    this._canvas = options.canvas;

    this._renderCanvasFn = options.renderCanvasFn;

    this._storeTracker = new StoreTracker({
      edition: options.edition,
      maxStep: MAX_STEP_UNDO_REDO
    });

    document.body.addEventListener('keyup', this._handleKeyPress);
  }

  _handleKeyPress = event => {
    const key = event.keyCode || event.charCode;

    const isCtrlPressed = isCtrlKey(event);

    const isUndo = isCtrlPressed && key == KEY_CODE.Z;
    const isRedo = isCtrlPressed && key == KEY_CODE.Y;

    if (isUndo) this.undo();

    if (isRedo) this.redo();
  };

  _undoRedo = async (isUndo = true) => {
    const storeChangeResult = isUndo
      ? await this._storeTracker.backToPrevious()
      : await this._storeTracker.moveToNext();

    const selectedObjectIds = isEmpty(storeChangeResult.changedIds)
      ? this._canvas.getActiveObjects().map(o => o.id)
      : storeChangeResult.changedIds;

    if (!isOk(storeChangeResult)) return;

    resetObjects(this._canvas);

    await this._renderCanvasFn(storeChangeResult.objects);

    const selectedObjects = this._canvas
      .getObjects()
      .filter(({ id }) => selectedObjectIds.includes(id));

    if (selectedObjects.length === 0) return;

    if (selectedObjectIds.length === 1) {
      this._canvas.setActiveObject(selectedObjects[0]).renderAll();

      return;
    }

    const selections = new fabric.ActiveSelection(selectedObjects, {
      canvas: this._canvas
    });

    this._canvas.setActiveObject(selections).renderAll();
  };

  reset = () => {
    this._storeTracker.restartTracking();
  };

  dispose = () => {
    this._storeTracker.stopTracking();

    this._storeTracker = null;

    document.body.removeEventListener('keyup', this._handleKeyPress);
  };

  undo = () => {
    this._undoRedo();
  };

  redo = () => {
    this._undoRedo(false);
  };
}

export default UndoRedoCanvas;
