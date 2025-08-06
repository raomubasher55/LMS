import DropdownPrimary from "./DropdownPrimary";

const DropdownHome = () => {
  const items = [
    {
      name: "Home (Light)",
      status: null,
      path: "/",
      type: "secondary",
    },
    {
      name: "Home (Dark)",
      status: null,
      path: "/home-1-dark",
      type: "secondary",
    },
  ];
  return <DropdownPrimary items={items} />;
};

export default DropdownHome;
