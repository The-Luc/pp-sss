import { POSITION_FIXED } from '@/common/constants';

const defaultLayout = {
  id: null,
  isFavorites: false,
  name: '',
  pages: [{ objects: [] }, { objects: [] }],
  previewImageUrl: '',
  size: {
    width: 0,
    height: 0
  },
  themeId: null,
  type: ''
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
  coverOption: 'Hardcover',
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
    themeId: null
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
            theme: null,
            layout: defaultLayout,
            link: 'none'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'none'
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
            link: 'none'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'none'
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
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
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
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
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
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
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
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
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
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
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
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
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
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
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
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
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
            thumbnailUrl: null,
            theme: null,
            layout: defaultLayout,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
          }
        }
      ]
    }
  ]
};

export default book;
