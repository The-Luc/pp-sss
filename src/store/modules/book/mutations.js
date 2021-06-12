import { cloneDeep, uniqueId, omit, pick, merge } from 'lodash';
import randomcolor from 'randomcolor';
import moment from 'moment';

import {
  SHEET_TYPE,
  DATE_FORMAT,
  BACKGROUND_PAGE_TYPE,
  OBJECT_TYPE,
  HALF_SHEET,
  HALF_LEFT
} from '@/common/constants';
import { getAllSheets, nextId, isEmpty } from '@/common/utils';

import BOOK from './const';
import { POSITION_FIXED } from '@/common/constants';

const getIndexById = (items, id) => {
  return items.findIndex(s => s.id === id);
};

const getIndexByItem = (items, item) => {
  return getIndexById(items, item.id);
};

const moveToOtherSection = (
  sheet,
  currentSectionIndex,
  moveToSectionIndex,
  moveToSheetIndex,
  sections
) => {
  const sheetIndex = getIndexByItem(
    sections[currentSectionIndex].sheets,
    sheet
  );

  sections[currentSectionIndex].sheets.splice(sheetIndex, 1);

  sections[moveToSectionIndex].sheets.splice(moveToSheetIndex, 0, sheet);
};

const moveToSection = (
  currentSectionId,
  currentSheetIndex,
  moveToSectionId,
  moveToSheetIndex,
  sections
) => {
  const currentSectionIndex = getIndexById(sections, currentSectionId);
  const moveToSectionIndex = getIndexById(sections, moveToSectionId);

  moveToOtherSection(
    sections[currentSectionIndex].sheets[currentSheetIndex],
    currentSectionIndex,
    moveToSectionIndex,
    moveToSheetIndex,
    sections
  );
};

const moveItem = (item, currentIndex, moveToIndex, items) => {
  const _items = Object.assign([], items);

  if (moveToIndex < currentIndex) {
    _items.splice(currentIndex, 1);
    _items.splice(moveToIndex, 0, item);
  } else if (moveToIndex > currentIndex) {
    _items.splice(moveToIndex + 1, 0, item);
    _items.splice(currentIndex, 1);
  }

  return _items;
};

const makeNewSection = (sections, sectionIndex) => {
  const newId = Math.max(...sections.map(s => nextId(s.sheets)), 1);

  const totalSheets = sections[sectionIndex].sheets.length;
  const order =
    sectionIndex === sections.length - 1 ? totalSheets - 1 : totalSheets;
  return {
    id: newId,
    type: SHEET_TYPE.NORMAL,
    draggable: true,
    positionFixed: POSITION_FIXED.NONE,
    order: order,
    printData: {
      layout: null,
      thumbnailUrl: null,
      link: 'link'
    },
    digitalData: {
      thumbnailUrl: null,
      link: 'link'
    }
  };
};

export const mutations = {
  [BOOK._MUTATES.UPDATE_SECTIONS](state, payload) {
    const { sections } = payload;

    state.book.sections = sections;
  },
  [BOOK._MUTATES.UPDATE_SHEETS](state, payload) {
    const { sectionId, sheets } = payload;

    const index = state.book.sections.findIndex(s => s.id === sectionId);

    if (index >= 0) {
      state.book.sections[index].sheets = sheets;
    }
  },
  [BOOK._MUTATES.UPDATE_SHEET_POSITION](state, payload) {
    const {
      moveToSectionId,
      moveToIndex,
      selectedSectionId,
      selectedIndex
    } = payload;

    const { sections } = state.book;

    if (moveToSectionId !== selectedSectionId) {
      moveToSection(
        selectedSectionId,
        selectedIndex,
        moveToSectionId,
        moveToIndex,
        sections
      );

      return;
    }

    const selectedSectionIndex = getIndexById(sections, selectedSectionId);
    const moveToSectionIndex = getIndexById(sections, moveToSectionId);

    sections[selectedSectionIndex].sheets = moveItem(
      sections[selectedSectionIndex].sheets[selectedIndex],
      selectedIndex,
      moveToIndex,
      sections[moveToSectionIndex].sheets
    );
  },
  [BOOK._MUTATES.UPDATE_SECTION_POSITION](state, payload) {
    const { moveToIndex, selectedIndex } = payload;

    let { sections } = state.book;

    const selectedSection = sections[selectedIndex];

    state.book.sections = moveItem(
      selectedSection,
      selectedIndex,
      moveToIndex,
      sections
    );
  },
  [BOOK._MUTATES.ADD_SHEET](state, payload) {
    const { sectionId } = payload;
    const { totalPages, totalSheets, totalScreens, sections } = state.book;

    let index = sections.findIndex(item => item.id === sectionId);
    if (index !== sections.length - 1) {
      sections[index].sheets = [
        ...sections[index].sheets,
        makeNewSection(sections, index)
      ];
    } else {
      sections[index].sheets = [
        ...sections[index].sheets.slice(0, sections[index].sheets.length - 1),
        makeNewSection(sections, index),
        ...sections[index].sheets.slice(sections[index].sheets.length - 1)
      ];
      sections[index].sheets[sections[index].sheets.length - 1].order += 1;
    }
    state.book.totalPages = totalPages + 2;
    state.book.totalSheets = totalSheets + 1;
    state.book.totalScreens = totalScreens + 1;
  },
  [BOOK._MUTATES.DELETE_SECTION](state, payload) {
    const { sectionId } = payload;
    const { sections } = state.book;
    const index = sections.findIndex(item => item.id == sectionId);
    state.book.sections = sections.filter(item => item.id !== sectionId);
    state.book.totalPages -= sections[index].sheets.length * 2;
    state.book.totalSheets -= sections[index].sheets.length;
    state.book.totalScreens -= sections[index].sheets.length;
  },
  [BOOK._MUTATES.DELETE_SHEET](state, payload) {
    const { idSheet, idSection } = payload;
    const { totalPages, totalSheets, totalScreens, sections } = state.book;
    const sectionIndex = sections.findIndex(item => {
      return item.id === idSection;
    });
    state.book.sections[sectionIndex].sheets = sections[
      sectionIndex
    ].sheets.filter(item => item.id !== idSheet);
    state.book.totalPages = totalPages - 2;
    state.book.totalSheets = totalSheets - 1;
    state.book.totalScreens = totalScreens - 1;
  },
  [BOOK._MUTATES.MOVE_SHEET](state, payload) {
    const { sheetId, sectionId, currentSectionId } = payload;

    const { sections } = state.book;

    const currentSectionIndex = getIndexById(sections, sectionId);
    const moveToSectionIndex = getIndexById(sections, currentSectionId);

    const currentSheetIndex = getIndexById(
      sections[currentSectionIndex].sheets,
      sheetId
    );

    const totalSheetInMoveToSection =
      sections[moveToSectionIndex].sheets.length;

    const moveToIndex =
      moveToSectionIndex === sections.length - 1
        ? totalSheetInMoveToSection - 1
        : totalSheetInMoveToSection;

    moveToOtherSection(
      sections[currentSectionIndex].sheets[currentSheetIndex],
      currentSectionIndex,
      moveToSectionIndex,
      moveToIndex,
      sections
    );
  },
  [BOOK._MUTATES.ADD_SECTION](state) {
    const { sections, releaseDate } = state.book;
    const newSectionId = nextId(sections);

    state.book.sections = [
      ...sections.slice(0, sections.length - 1),
      {
        color: randomcolor(),
        fixed: false,
        id: newSectionId,
        name: '',
        status: 0,
        draggable: true,
        dueDate: moment(releaseDate).format(DATE_FORMAT.BASE),
        sheets: []
      },
      ...sections.slice(sections.length - 1)
    ];
    setTimeout(() => {
      const collapse = document
        .querySelector('#btn-ec-all')
        .getAttribute('data-toggle');
      let el = document.querySelector(`#section-${newSectionId}`);
      if (collapse !== 'collapse') {
        el.click();
      }
      let input = el.querySelector('input');
      let text = el.querySelector('.text');
      text.style.display = 'none';
      input.style.display = 'block';
      input.style.width = '100%';
      input.focus();
    }, 0);
  },
  [BOOK._MUTATES.EDIT_SECTION_NAME](state, payload) {
    const { sectionId } = payload;
    let { sectionName } = payload;
    sectionName = sectionName || 'Untitled';
    const { sections } = state.book;
    const indexSection = sections.findIndex(item => item.id == sectionId);
    state.book.sections[indexSection].name = sectionName;
  },
  [BOOK._MUTATES.SELECT_SHEET](state, payload) {
    const { sheet } = payload;
    state.pageSelected = sheet;
  },
  [BOOK._MUTATES.GET_BOOK_SUCCESS](state, payload) {
    state.book = payload;
  },
  [BOOK._MUTATES.SELECT_THEME](state, payload) {
    const { themeId } = payload;
    state.book.printData.themeId = themeId;
  },
  [BOOK._MUTATES.SET_OBJECT_TYPE_SELECTED](state, { type }) {
    state.selectedObjectType = type;
  },
  [BOOK._MUTATES.TOGGLE_MENU_PROPERTIES](state, { isOpen }) {
    state.isOpenProperties = isOpen;
  },
  [BOOK._MUTATES.TEXT_PROPERTIES](
    state,
    { bold, fontStyle, underLine, fontFamily, fontSize, textAlign }
  ) {
    state.textProperties.bold = bold;
    state.textProperties.fontStyle = fontStyle;
    state.textProperties.underLine = underLine;
    state.textProperties.fontFamily = fontFamily;
    state.textProperties.fontSize = fontSize;
    state.textProperties.textAlign = textAlign;
  },
  [BOOK._MUTATES.UPDATE_SHEET_THEME_LAYOUT](
    state,
    { sheetId, themeId, layout, pagePosition }
  ) {
    const layoutPages = cloneDeep(layout.pages);
    // Assign unique id to objects
    const pagesWithObjectId = layoutPages.map(page => ({
      objects: page.objects.map(obj => ({
        ...obj,
        id: uniqueId()
      }))
    }));
    const allSheets = getAllSheets(state.book.sections);
    const layoutObj = cloneDeep(layout);
    layoutObj.pages = pagesWithObjectId;
    const currentSheet = allSheets.find(sheet => sheet.id === sheetId);
    const sheetObj = cloneDeep(currentSheet);
    // Reset objects of current sheet
    if (sheetObj.printData.layout?.id && !pagePosition) {
      sheetObj.printData.layout.pages.forEach(page => {
        page.objects.forEach(objectId => {
          state.objects = omit(state.objects, [objectId]);
        });
      });
    }

    const singleLayoutSelected = layoutObj.pages[0]; // For single layout, data object always first item
    let currentPosition = pagePosition; // Check whether user has add single page or not. Value: left or right with single page else undefine
    if (sheetObj.type === SHEET_TYPE.FRONT_COVER) {
      // Front cover always has the right page
      currentPosition = 'right';
    }

    if (sheetObj.type === SHEET_TYPE.BACK_COVER) {
      // Back cover always has the left page
      currentPosition = 'left';
    }
    // Current sheet's layout
    let sheetLeftLayout = sheetObj?.printData?.layout?.pages[0];
    let sheetRightLayout = sheetObj?.printData?.layout?.pages[1];

    if (sheetLeftLayout) {
      // Convert object from string to object by object id to compare data
      const objectKeys = Object.keys(
        pick(state.objects, [...sheetLeftLayout?.objects])
      );
      sheetLeftLayout = {
        ...sheetLeftLayout,
        objects: objectKeys.map(key => state.objects[key])
      };
    }

    if (sheetRightLayout) {
      // Convert object from string to object by object id to compare data
      const objectKeys = Object.keys(
        pick(state.objects, [...sheetRightLayout?.objects])
      );
      sheetRightLayout = {
        ...sheetRightLayout,
        objects: objectKeys.map(key => state.objects[key])
      };
    }

    let pages = new Array(2);
    pages[0] = sheetLeftLayout; // Assign left layout of current sheet to first item
    pages[1] = sheetRightLayout; // Assign right layout of current sheet to first item
    let initPages = pages;

    if (currentPosition) {
      // User select single page type
      // Check user apply layout to left or right of page
      const indexPage = currentPosition === 'left' ? 0 : 1;
      initPages = pages.map((page, index) => {
        if (index === indexPage) {
          return singleLayoutSelected;
        }
        return {
          ...page
        };
      });
    } else {
      // Apply whole layout's pages selected
      initPages = layoutObj.pages;
    }

    // Update objects state
    let objects = {};
    initPages.forEach(page => {
      if (page?.objects) {
        page?.objects.forEach(obj => {
          objects[obj.id] = {
            ...obj
          };
        });
      }
    });
    state.objects = {
      ...state.objects,
      ...objects
    };

    // Convert objects to objectId into pages
    const objectsId = initPages.map(page => {
      if (page?.objects) {
        return {
          objects: page?.objects?.map(obj => obj.id)
        };
      }
      return {
        objects: []
      };
    });

    layoutObj.pages = objectsId;
    currentSheet.printData.layout = layoutObj;
    currentSheet.printData.theme = themeId;
  },
  [BOOK._MUTATES.UPDATE_SHEET_VISITED](state, { sheetId }) {
    const allSheets = getAllSheets(state.book.sections);
    const currentSheet = allSheets.find(sheet => sheet.id === sheetId);
    currentSheet.isVisited = true;
  },
  [BOOK._MUTATES.SET_SECTION_ID](state, { sectionId }) {
    state.sectionId = sectionId;
  },
  [BOOK._MUTATES.SAVE_PRINT_CANVAS](state, { data }) {
    // const { pageSelected, sectionId, book } = state;
    // const sectionIndex = book.sections.findIndex(item => item.id === sectionId);
    // const sheetIndex = book.sections[sectionIndex].sheets.findIndex(
    //   item => item.id === pageSelected.id
    // );
    // let printData = book.sections[sectionIndex].sheets[sheetIndex].printData;
    // printData.pages = data;
  },
  [BOOK._MUTATES.SET_SELECTED_OBJECT_ID](state, { id }) {
    state.objectSelectedId = id;
  },
  [BOOK._MUTATES.SET_PROP](state, { id, property }) {
    merge(state.objects[id].property, property);
  },
  [BOOK._MUTATES.ADD_OBJECT](state, { id, newObject }) {
    state.objects[id] = newObject;
  },
  [BOOK._MUTATES.UPDATE_TRIGGER_TEXT_CHANGE](state) {
    state.triggerTextChange = !state.triggerTextChange;
  },
  [BOOK._MUTATES.ADD_BACKGROUND](
    state,
    { id, sheetId, isLeft = true, newBackground }
  ) {
    const sheets = getAllSheets(state.book.sections);
    const sheet = sheets.find(s => s.id === sheetId);

    if (isEmpty(sheet)) return;

    if (isEmpty(sheet.printData.layout)) {
      sheet.printData.layout = { pages: [{ objects: [] }, { objects: [] }] };
    }

    if (sheet.printData.layout.pages.length < 2) {
      sheet.printData.layout.pages.push({ objects: [] });
    }

    const pageData = sheet.printData.layout.pages;

    const firstId = isEmpty(pageData[0].objects) ? '' : pageData[0].objects[0];
    const secondId = isEmpty(pageData[1].objects) ? '' : pageData[1].objects[0];

    const firstBackground =
      state.objects[firstId]?.type === OBJECT_TYPE.BACKGROUND
        ? state.objects[firstId]
        : null;

    const secondBackground =
      state.objects[secondId]?.type === OBJECT_TYPE.BACKGROUND
        ? state.objects[secondId]
        : null;

    const isAddingFullBackground =
      newBackground.property.pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;

    const isCurrentFullBackground =
      !isEmpty(firstBackground) &&
      firstBackground.property.pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;

    const isHalfSheet = HALF_SHEET.indexOf(sheet.type) >= 0;
    const isHalfLeft = isHalfSheet && HALF_LEFT.indexOf(sheet.type) >= 0;

    const isRemoveAllBackground =
      isHalfSheet || isAddingFullBackground || isCurrentFullBackground;

    const isAddToLeftFullSheet =
      !isHalfSheet && (isAddingFullBackground || isLeft);

    const isAddToLeft = isHalfLeft || isAddToLeftFullSheet;

    const isRemoveLeft =
      !isEmpty(firstBackground) && (isRemoveAllBackground || isAddToLeft);
    const isRemoveRight =
      !isEmpty(secondBackground) && (isRemoveAllBackground || !isAddToLeft);

    if (isRemoveLeft) {
      sheet.printData.layout.pages[0].objects.shift();

      delete state.objects[firstId];
    }

    if (isRemoveRight) {
      sheet.printData.layout.pages[1].objects.shift();

      delete state.objects[secondId];
    }

    const pageIndex = isAddToLeft ? 0 : 1;

    sheet.printData.layout.pages[pageIndex].objects.unshift(id);

    state.objects[id] = newBackground;
  },
  [BOOK._MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE](state) {
    state.triggerBackgroundChange = !state.triggerBackgroundChange;
  }
};
