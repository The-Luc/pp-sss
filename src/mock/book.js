const book = {
  id: 1719,
  communityId: 28,
  title: 'Year Book 2021',
  totalPages: 20,
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
      id: '1',
      name: 'Cover',
      draggable: false,
      color: '#fcd726',
      status: 'not started',
      order: 0,
      assigneeId: 123456789,
      sheets: [
        {
          id: 1,
          type: 'full',
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
      id: '2',
      name: 'Letter',
      draggable: true,
      color: '#a4ca52',
      status: 'in process',
      order: 1,
      assigneeId: 123456789,
      sheets: [
        {
          id: 2,
          type: 'half',
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
          type: 'full',
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
          type: 'full',
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
          type: 'full',
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
          type: 'full',
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
      id: '3',
      name: 'Admin & Staff',
      draggable: true,
      color: '#bc72c2',
      status: 'completed',
      order: 2,
      assigneeId: 123456789,
      sheets: [
        {
          id: 6,
          type: 'full',
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
          type: 'full',
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
          type: 'full',
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
          type: 'full',
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
      id: '4',
      draggable: true,
      name: 'OOO',
      color: 'orange',
      status: 'not started',
      order: 3,
      assigneeId: 123456789,
      sheets: []
    },
    {
      id: '54',
      draggable: false,
      name: 'Signatures',
      color: '#0b49f5',
      status: 'approved',
      order: 4,
      assigneeId: 123456789,
      sheets: [
        {
          id: 11,
          type: 'half',
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
