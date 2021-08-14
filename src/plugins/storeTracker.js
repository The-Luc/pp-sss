import { cloneDeep } from 'lodash';

import store from '@/store';

import { isEmpty, hasOwnProperty } from '@/common/utils';

import { DELAY_AFTER_CHANGE_UNDO_REDO, EDITION } from '@/common/constants';
import { MUTATES as PRINT_MUTATES } from '@/store/modules/print/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';

class StoreTracker {
  _trackList = [];
  _maxStep = 1;
  _currentIndex = -1;

  _edition = null;
  _unwatch = null;

  _isSwitching = false;

  /**
   * @param {Object} options  option of store tracker
   */
  constructor(options) {
    if (!hasOwnProperty(options, 'edition')) throw 'Store name must be set';

    this._edition = options.edition;

    if (hasOwnProperty(options, 'maxStep')) this._maxStep = options.maxStep;
  }

  _getStoreData(state) {
    return {
      objects: cloneDeep(state[this._edition].objects),
      objectIds: cloneDeep(state[this._edition].objectIds),
      background: cloneDeep(state[this._edition].background)
    };
  }

  _setDataToTrackList(dataToKeep) {
    if (this._currentIndex >= this._maxStep) {
      this._trackList.splice(0, 1);

      this._currentIndex--;
    }

    const data = [
      cloneDeep(dataToKeep.background.left),
      cloneDeep(dataToKeep.background.right),
      ...dataToKeep.objectIds.map(id => ({ ...dataToKeep.objects[id], id }))
    ];

    this._trackList.splice(
      ++this._currentIndex,
      this._trackList.length - this._currentIndex,
      data
    );
  }

  async _setDataToStore() {
    const MUTATES =
      this._edition === EDITION.PRINT ? PRINT_MUTATES : DIGITAL_MUTATES;

    const data = cloneDeep(this._trackList[this._currentIndex]);

    const backgrounds = { left: cloneDeep(data[0]), right: cloneDeep(data[1]) };

    data.splice(0, 2);

    await Promise.all([
      store.commit(MUTATES.SET_BACKGROUNDS, { backgrounds }),
      store.commit(MUTATES.SET_OBJECTS, { objectList: data })
    ]);
  }

  async _switchData(isValid, nextIndex) {
    if (!isValid) return Promise.resolve(false);

    this._isSwitching = true;

    this._currentIndex += nextIndex;

    await this._setDataToStore();

    return new Promise(resolve => {
      setTimeout(() => {
        this._isSwitching = false;

        resolve(true);
      }, DELAY_AFTER_CHANGE_UNDO_REDO);
    });
  }

  startTracking() {
    this._unwatch = store.watch(
      state => {
        return this._getStoreData(state);
      },
      (newval, oldval) => {
        if (this._isSwitching) return;

        if (JSON.stringify(newval) === JSON.stringify(oldval)) return;

        this._setDataToTrackList(newval);
      },
      {
        deep: true
      }
    );
  }

  stopTracking() {
    if (!isEmpty(this._unwatch)) this._unwatch();

    this._trackList = [];
    this._currentIndex = -1;
  }

  restartTracking() {
    this.stopTracking();

    this.startTracking();

    this._setDataToTrackList(this._getStoreData(store.state));
  }

  async backToPrevious() {
    return await this._switchData(this._currentIndex > 0, -1);
  }

  async moveToNext() {
    return await this._switchData(
      this._currentIndex < this._trackList.length - 1,
      1
    );
  }
}

export default StoreTracker;
