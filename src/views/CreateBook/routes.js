const CreateBook = () => import("../CreateBook");
const Manager = () => import("./Manager");
const PrintEdition = () => import("./PrintEdition");
const DigitalEdition = () => import("./DigitalEdition");

export default [
  {
    path: "/create-book",
    name: "createBook",
    component: CreateBook,
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
