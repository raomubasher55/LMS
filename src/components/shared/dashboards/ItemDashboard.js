"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ItemDashboard = ({ item }) => {
  const currentPath = usePathname();

  const { name, path, icon, tag, onClick } = item;
  const isActive = currentPath === path ? true : false;

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault(); 
      onClick();
    }
  };
  return (
    <li
      className={`py-10px border-b border-borderColor dark:border-borderColor-dark ${
        tag ? "flex justify-between items-center" : ""
      }`}
    >
      <Link
        href={path}
        onClick={handleClick}
        className={`${
          isActive
            ? "text-primaryColor"
            : "text-contentColor dark:text-contentColor-dark "
        }  hover:text-primaryColor dark:hover:text-primaryColor leading-1.8 flex gap-3 text-nowrap`}
      >
        {icon} {name}
      </Link>
      {tag ? (
        <span className="text-size-10 font-medium text-whiteColor px-9px bg-primaryColor leading-14px rounded-2xl">
          {tag}
        </span>
      ) : (
        ""
      )}
    </li>
  );
};

export default ItemDashboard;
