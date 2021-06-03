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
          positionFixed: 'all',
          order: 0,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'none',
            pages: [
              {
                id: 1,
                layoutId: 1,
                objects: []
              }
            ]
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
          positionFixed: 'first',
          order: 0,
          printData: {
            theme: null,
            layout: null,
            thumbnailUrl: null,
            link: 'none',
            pages: [
              {
                id: 2,
                data: []
              }
            ]
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
          positionFixed: 'none',
          order: 1,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'link',
            pages: [
              {
                id: 3,
                data: []
              },

              {
                id: 4,
                data: []
              }
            ]
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
          positionFixed: 'none',
          order: 2,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'link',
            pages: [
              {
                id: 5,
                data: []
              },

              {
                id: 6,
                data: []
              }
            ]
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
          positionFixed: 'none',
          order: 3,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'link',
            pages: [
              {
                id: 7,
                data: []
              },

              {
                id: 8,
                data: []
              }
            ]
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
          positionFixed: 'none',
          order: 4,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'link',
            pages: [
              {
                id: 9,
                data: []
              },

              {
                id: 10,
                data: []
              }
            ]
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
          positionFixed: 'none',
          order: 0,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'link',
            pages: [
              {
                id: 11,
                data: []
              },

              {
                id: 12,
                data: []
              }
            ]
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
          positionFixed: 'none',
          order: 1,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'link'
          },
          digitalData: {
            thumbnailUrl: null,
            link: 'link',
            pages: [
              {
                id: 13,
                data: []
              },

              {
                id: 14,
                data: []
              }
            ]
          }
        },
        {
          id: 8,
          type: 3,
          draggable: true,
          isVisited: false,
          positionFixed: 'none',
          order: 2,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'link',
            pages: [
              {
                id: 15,
                data: []
              },

              {
                id: 16,
                data: []
              }
            ]
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
          positionFixed: 'none',
          order: 3,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'link',
            pages: [
              {
                id: 17,
                data: []
              },

              {
                id: 18,
                data: []
              }
            ]
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
          positionFixed: 'last',
          order: 0,
          printData: {
            thumbnailUrl: null,
            theme: null,
            layout: null,
            link: 'link',
            pages: [
              {
                id: 19,
                data: []
              }
            ]
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

module.exports = book;
