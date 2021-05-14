const book = {
  id: 1719,
  communityId: 28,
  title: 'Year Book 2021',
  totalPages: 18,
  totalSheets: 11,
  totalScreens: 11,
  deliveryDate: '08/21/21',
  releaseDate: '08/07/21',
  coverOption: 'Hardcover',
  numberMaxPages: 48,
  deliveryOption: 'Bulk Ship To School',
  booksSold: 0,
  fundraisingEarned: 0,
  estimatedQuantity: {
    min: 50,
    max: 100
  },
  sections: [
    {
      id: 1,
      name: 'Cover',
      draggable: false,
      color: '#fcd726',
      status: 'not started',
      releaseDate: '08/07/21',
      order: 0,
      assigneeId: 123456789,
      sheets: [
        {
          id: 1,
          type: 'cover',
          draggable: false,
          positionFixed: 'all',
          order: 0,
          printData: {
            thumbnailUrl: null,
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
      status: 'in process',
      releaseDate: '08/07/21',
      order: 1,
      assigneeId: 123456789,
      sheets: [
        {
          id: 2,
          type: 'intro',
          draggable: false,
          positionFixed: 'first',
          order: 0,
          printData: {
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
          type: 'normal',
          draggable: true,
          positionFixed: 'none',
          order: 1,
          printData: {
            thumbnailUrl: null,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
          }
        },
        {
          id: 4,
          type: 'normal',
          draggable: true,
          positionFixed: 'none',
          order: 2,
          printData: {
            thumbnailUrl: null,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
          }
        },
        {
          id: 5,
          type: 'normal',
          draggable: true,
          positionFixed: 'none',
          order: 3,
          printData: {
            thumbnailUrl: null,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
          }
        },
        {
          id: 20,
          type: 'normal',
          draggable: true,
          positionFixed: 'none',
          order: 4,
          printData: {
            thumbnailUrl: null,
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
      status: 'completed',
      releaseDate: '08/07/21',
      order: 2,
      assigneeId: 123456789,
      sheets: [
        {
          id: 6,
          type: 'normal',
          draggable: true,
          positionFixed: 'none',
          order: 0,
          printData: {
            thumbnailUrl: null,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
          }
        },
        {
          id: 7,
          type: 'normal',
          draggable: true,
          positionFixed: 'none',
          order: 1,
          printData: {
            thumbnailUrl: null,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
          }
        },
        {
          id: 8,
          type: 'normal',
          draggable: true,
          positionFixed: 'none',
          order: 2,
          printData: {
            thumbnailUrl: null,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link'
          }
        },
        {
          id: 9,
          type: 'normal',
          draggable: true,
          positionFixed: 'none',
          order: 3,
          printData: {
            thumbnailUrl: null,
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
      name: 'OOO',
      color: 'orange',
      status: 'not started',
      releaseDate: '08/07/21',
      order: 3,
      assigneeId: 123456789,
      sheets: []
    },
    {
      id: 55,
      draggable: false,
      name: 'Signatures',
      color: '#0b49f5',
      status: 'approved',
      releaseDate: '08/07/21',
      order: 4,
      assigneeId: 123456789,
      sheets: [
        {
          id: 11,
          type: 'signature',
          draggable: false,
          positionFixed: 'last',
          order: 0,
          printData: {
            thumbnailUrl: null,
            link: 'unlink'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'unlink'
          }
        }
      ]
    }
  ]
};

module.exports = book;
