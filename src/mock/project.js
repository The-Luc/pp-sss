const project = {
  name: 'Year Book',
  releaseDate: '07/21/21',
  sections: [
    {
      id: '1',
      name: 'Cover',
      fixed: true,
      color: 'blue',
      releaseDate: '06/09/21',
      sheets: [
        {
          id: 1,
          type: 'full',
          fixed: true,
          name: 'A'
        }
      ]
    },
    {
      id: '2',
      name: 'Letter',
      fixed: true,
      color: 'pink',
      releaseDate: '06/10/21',
      sheets: [
        {
          id: 2,
          type: 'half',
          fixed: true,
          name: 'B'
        },
        {
          id: 3,
          type: 'full',
          fixed: false,
          name: 'C'
        },
        {
          id: 4,
          type: 'full',
          fixed: false,
          name: 'D'
        },
        {
          id: 5,
          type: 'full',
          fixed: false,
          name: 'E'
        },
        {
          id: 20,
          type: 'full',
          fixed: false,
          name: 'F'
        }
      ]
    },
    {
      id: '3',
      name: 'Admin & Staff',
      fixed: false,
      color: 'black',
      releaseDate: '06/11/21',
      sheets: [
        {
          id: 6,
          type: 'full',
          fixed: false,
          name: 'G'
        },
        {
          id: 7,
          type: 'full',
          fixed: false,
          name: 'H'
        },
        {
          id: 8,
          type: 'full',
          fixed: false,
          name: 'I'
        },
        {
          id: 9,
          type: 'full',
          fixed: false,
          name: 'J'
        }
      ]
    },
    {
      id: '4',
      fixed: false,
      name: 'OOO',
      color: 'orange',
      releaseDate: '06/12/21',
      sheets: []
    },
    {
      id: '54',
      fixed: true,
      name: 'Signatures',
      color: 'yellow',
      releaseDate: '06/13/21',
      sheets: [
        {
          id: 11,
          type: 'half',
          fixed: true
        }
      ]
    }
  ]
};

module.exports = project;
