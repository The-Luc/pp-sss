const Edit = () => import('../CreateBook');
const Manager = () => import('./Manager');
const PrintEdition = () => import('./PrintEdition');
const DigitalEdition = () => import('./DigitalEdition');
const MainScreen = () => import('./PrintEdition/MainScreen');
const EditScreen = () => import('./PrintEdition/EditScreen');

export default [
  {
    path: '/edit',
    name: 'edit',
    component: Edit,
    children: [
      {
        path: 'manager',
        component: Manager
      },
      {
        path: 'print',
        component: PrintEdition,
        children: [
          {
            path: '/',
            component: MainScreen
          },
          {
            path: 'edit-screen',
            component: EditScreen
          }
        ]
      },
      {
        path: 'print/edit',
        component: PrintEdition
      },
      {
        path: 'digital',
        component: DigitalEdition
      }
    ]
  }
];
