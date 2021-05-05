const Edit = () => import("../CreateBook");
const Manager = () => import("./Manager");
const PrintEdition = () => import("./PrintEdition");
const DigitalEdition = () => import("./DigitalEdition");

export default [
  {
    path: "/edit",
    name: "edit",
    component: Edit,
    children: [
      {
        path: "manager",
        component: Manager
      },
      {
        path: "print",
        component: PrintEdition
      },
      {
        path: "digital",
        component: DigitalEdition
      }
    ]
  }
];
