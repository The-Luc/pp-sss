const project = {
  name: 'Year Book',
  releaseDate: '05/21/21',
  sections: [
    {
      id: '1',
      name: 'Cover',
      fixed: true,
      color: 'blue',
      sheets: [
        {
          id: 1,
          type: 'full',
          fixed: 'both',
          name: 'A'
        }
      ]
    },
    {
      id: '2',
      name: 'Letter',
      fixed: true,
      color: 'pink',
      sheets: [
        {
          id: 2,
          type: 'half',
          fixed: 'first',
          name: 'B'
        },
        {
          id: 3,
          type: 'full',
          fixed: null,
          name: 'C'
        },
        {
          id: 4,
          type: 'full',
          fixed: null,
          name: 'D'
        },
        {
          id: 5,
          type: 'full',
          fixed: null,
          name: 'E'
        },
        {
          id: 20,
          type: 'full',
          fixed: null,
          name: 'F'
        }
      ]
    },
    {
      id: '3',
      name: 'Admin & Staff',
      fixed: false,
      color: 'black',
      sheets: [
        {
          id: 6,
          type: 'full',
          fixed: null,
          name: 'G'
        },
        {
          id: 7,
          type: 'full',
          fixed: null,
          name: 'H'
        },
        {
          id: 8,
          type: 'full',
          fixed: null,
          name: 'I'
        },
        {
          id: 9,
          type: 'full',
          fixed: null,
          name: 'J'
        }
      ]
    },
    {
      id: '4',
      fixed: false,
      name: 'OOO',
      color: 'orange',
      sheets: []
    },
    {
      id: '54',
      fixed: true,
      name: 'Signatures',
      color: 'yellow',
      sheets: [
        {
          id: 11,
          type: 'half',
          fixed: 'last'
        }
      ]
    }
  ]
};

module.exports = project;
