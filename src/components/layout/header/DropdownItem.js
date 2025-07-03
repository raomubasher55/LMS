import React from "react";
import DropdownLink from "./DropdownLink";
import DropdownWrapperPrimary from "@/components/shared/wrappers/DropdownWrapperPrimary";
import DropdownContainerPrimary from "@/components/shared/containers/DropdownContainerPrimary";

const DropdownItem = ({ item }) => {
  const { name, status, type, dropdown, path } = item;
  return (
    <li className={`${dropdown ? "relative group/nested" : ""}`}>
      <DropdownLink item={item} />

      {dropdown && (
        <DropdownWrapperPrimary>
          <DropdownContainerPrimary>
            <ul>
              {dropdown?.map((subItem, idx) => (
                <DropdownItem key={idx} item={subItem} />
              ))}
            </ul>
          </DropdownContainerPrimary>
        </DropdownWrapperPrimary>
      )}
    </li>
  );
};

export default DropdownItem;
