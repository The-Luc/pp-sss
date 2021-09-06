import {
  COVER_TYPE,
  LINK_STATUS,
  PAGE_NUMBER_POSITION,
  POSITION_FIXED
} from '@/common/constants';
import {
  BookDetailEntity,
  SectionEntity,
  SheetEntity
} from '@/common/models/entities';
import { uniqueId } from 'lodash';

const spreadInfo = {
  leftTitle: '', // spread title use left for link
  rightTitle: '',
  isLeftNumberOn: false,
  isRightNumberOn: false
};

const defaultLayout = {
  id: null,
  isFavorites: false,
  name: '',
  previewImageUrl: '',
  themeId: null,
  type: ''
};

const defaultDigitalLayout = {
  id: null,
  name: '',
  type: '',
  isFavorites: false,
  previewImageUrl: '',
  themeId: ''
};

const book = new BookDetailEntity({
  id: 1719,
  communityId: 28,
  title: 'Year Book 2021',
  totalPages: 18,
  totalSheets: 11,
  totalScreens: 11,
  createdDate: '11/27/20',
  deliveryDate: '08/21/21',
  releaseDate: '08/07/21',
  saleDate: '05/16/21',
  coverOption: COVER_TYPE.HARD_OVER,
  numberMaxPages: 48,
  deliveryOption: 'Bulk Ship To School',
  booksSold: 0,
  fundraisingEarned: 0,
  coverId: 1,
  insideFrontCoverId: 2,
  insideBackCoverId: 11,
  isPhotoVisited: false,
  estimatedQuantity: {
    min: 50,
    max: 100
  },
  printData: {
    themeId: null,
    pageInfo: {
      isNumberingOn: false,
      position: PAGE_NUMBER_POSITION.BOTTOM_CENTER,
      fontFamily: 'Arial',
      fontSize: 8,
      color: '#000000'
    }
  },
  digitalData: {
    themeId: null
  },
  sections: [
    new SectionEntity({
      id: +uniqueId(),
      name: 'Cover',
      draggable: false,
      color: '#fcd726',
      status: 0,
      dueDate: '05/20/21',
      order: 0,
      assigneeId: 1,
      sheets: [
        new SheetEntity({
          id: +uniqueId(),
          type: 0, // enum
          draggable: false,
          isVisited: false,
          positionFixed: POSITION_FIXED.ALL,
          order: 0,
          printData: {
            thumbnailUrl: null,
            themeId: null,
            layout: defaultLayout,
            link: LINK_STATUS.NONE,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.NONE,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        })
      ]
    }),
    new SectionEntity({
      id: +uniqueId(),
      name: 'Letter',
      draggable: false,
      color: '#a4ca52',
      status: 1,
      dueDate: '05/23/21',
      order: 1,
      assigneeId: 1,
      sheets: [
        new SheetEntity({
          id: +uniqueId(),
          type: 1,
          draggable: false,
          isVisited: false,
          positionFixed: POSITION_FIXED.FIRST,
          order: 0,
          printData: {
            theme: null,
            layout: defaultLayout,
            thumbnailUrl: null,
            link: LINK_STATUS.NONE,
            spreadInfo: { ...spreadInfo },
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.NONE,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        }),
        new SheetEntity({
          id: +uniqueId(),
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: POSITION_FIXED.NONE,
          order: 1,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: LINK_STATUS.LINK,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        }),
        new SheetEntity({
          id: +uniqueId(),
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: POSITION_FIXED.NONE,
          order: 2,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: LINK_STATUS.UNLINK,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.UNLINK,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        }),
        new SheetEntity({
          id: +uniqueId(),
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: POSITION_FIXED.NONE,
          order: 3,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: LINK_STATUS.LINK,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        }),
        new SheetEntity({
          id: +uniqueId(),
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: POSITION_FIXED.NONE,
          order: 4,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: LINK_STATUS.LINK,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        })
      ]
    }),
    new SectionEntity({
      id: +uniqueId(),
      name: 'Admin & Staff',
      draggable: true,
      color: '#bc72c2',
      status: 2,
      dueDate: '05/25/21',
      order: 2,
      assigneeId: 1,
      sheets: [
        new SheetEntity({
          id: +uniqueId(),
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: POSITION_FIXED.NONE,
          order: 0,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: LINK_STATUS.UNLINK,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.UNLINK,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        }),
        new SheetEntity({
          id: +uniqueId(),
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: POSITION_FIXED.NONE,
          order: 1,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: LINK_STATUS.LINK,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        }),
        new SheetEntity({
          id: +uniqueId(),
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: POSITION_FIXED.NONE,
          order: 2,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: LINK_STATUS.LINK,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        })
      ]
    }),
    new SectionEntity({
      id: +uniqueId(),
      draggable: true,
      name: 'Student of the best class of Year 2019',
      color: 'orange',
      status: 0,
      dueDate: '05/27/21',
      order: 3,
      assigneeId: 893,
      sheets: [
        new SheetEntity({
          id: +uniqueId(),
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: POSITION_FIXED.NONE,
          order: 3,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: LINK_STATUS.LINK,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        })
      ]
    }),
    new SectionEntity({
      id: +uniqueId(),
      draggable: false,
      name: 'Signatures',
      color: '#0b49f5',
      status: 3,
      dueDate: '06/01/21',
      order: 4,
      assigneeId: 893,
      sheets: [
        new SheetEntity({
          id: +uniqueId(),
          type: 2,
          draggable: false,
          isVisited: false,
          positionFixed: POSITION_FIXED.LAST,
          order: 0,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: LINK_STATUS.NONE,
            media: []
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.NONE,
            themeId: null,
            layout: defaultDigitalLayout,
            media: [],
            transitions: []
          }
        })
      ]
    })
  ]
});

export const modifyBookData = ({ coverType, maxPage }) => {
  book.coverOption =
    coverType === COVER_TYPE.HARD_OVER
      ? COVER_TYPE.HARD_OVER
      : COVER_TYPE.SOFT_COVER;
  book.numberMaxPages = maxPage;
  return book;
};

export default book;
