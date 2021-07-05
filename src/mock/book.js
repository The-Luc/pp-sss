import {
  COVER_TYPE,
  LINK_STATUS,
  PAGE_NUMBER_POSITION,
  POSITION_FIXED
} from '@/common/constants';

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

const book = {
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
    themeId: 1
  },
  sections: [
    {
      id: 1,
      name: 'Cover',
      draggable: false,
      color: '#fcd726',
      status: 0,
      dueDate: '05/20/21',
      order: 0,
      assigneeId: 123456789,
      sheets: [
        {
          id: 1,
          type: 0, // enum
          draggable: false,
          isVisited: false,
          positionFixed: POSITION_FIXED.ALL,
          order: 0,
          printData: {
            thumbnailUrl: null,
            themeId: null,
            layout: defaultLayout,
            link: LINK_STATUS.NONE
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.NONE,
            themeId: null,
            layout: defaultDigitalLayout
          }
        }
      ]
    },
    {
      id: 2,
      name: 'Letter',
      draggable: false,
      color: '#a4ca52',
      status: 1,
      dueDate: '05/23/21',
      order: 1,
      assigneeId: 123456789,
      sheets: [
        {
          id: 2,
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
            spreadInfo: { ...spreadInfo }
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.NONE,
            themeId: null,
            layout: defaultDigitalLayout
          }
        },
        {
          id: 3,
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
            link: LINK_STATUS.UNLINK
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout
          }
        },
        {
          id: 4,
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
            link: LINK_STATUS.LINK
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout
          }
        },
        {
          id: 5,
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
            link: LINK_STATUS.LINK
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout
          }
        },
        {
          id: 20,
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
            link: LINK_STATUS.LINK
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout
          }
        }
      ]
    },
    {
      id: 3,
      name: 'Admin & Staff',
      draggable: true,
      color: '#bc72c2',
      status: 2,
      dueDate: '05/25/21',
      order: 2,
      assigneeId: 123456789,
      sheets: [
        {
          id: 6,
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
            link: LINK_STATUS.LINK
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout
          }
        },
        {
          id: 7,
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
            link: LINK_STATUS.LINK
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout
          }
        },
        {
          id: 8,
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
            link: LINK_STATUS.LINK
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout
          }
        }
      ]
    },
    {
      id: 4,
      draggable: true,
      name: 'Student of the best class of Year 2019',
      color: 'orange',
      status: 0,
      dueDate: '05/27/21',
      order: 3,
      assigneeId: 123456789,
      sheets: [
        {
          id: 9,
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: POSITION_FIXED.NONE,
          order: 3,
          printData: {
            spreadInfo: { ...spreadInfo },
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout
          }
        }
      ]
    },
    {
      id: 55,
      draggable: false,
      name: 'Signatures',
      color: '#0b49f5',
      status: 3,
      dueDate: '06/01/21',
      order: 4,
      assigneeId: 123456789,
      sheets: [
        {
          id: 11,
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
            link: LINK_STATUS.LINK
          },
          digitalData: {
            thumbnailUrl: null,
            link: LINK_STATUS.LINK,
            themeId: null,
            layout: defaultDigitalLayout
          }
        }
      ]
    }
  ]
};

export const modifyBookData = ({ coverType, maxPage }) => {
  book.coverOption =
    coverType === COVER_TYPE.HARD_OVER
      ? COVER_TYPE.HARD_OVER
      : COVER_TYPE.SOFT_COVER;
  book.numberMaxPages = maxPage;
  return book;
};

export default book;
