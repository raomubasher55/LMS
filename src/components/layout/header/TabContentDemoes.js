import home1 from "@/assets/images/mega/home-1.png";
import home2 from "@/assets/images/mega/home-2.png";
import home3 from "@/assets/images/mega/home-3.png";
import home4 from "@/assets/images/mega/home-4.png";
import home5 from "@/assets/images/mega/home-5.png";
import home6 from "@/assets/images/mega/home-6.png";
import home7 from "@/assets/images/mega/home-7.png";
import home8 from "@/assets/images/mega/home-8.png";
import home9 from "@/assets/images/mega/home-9.png";
import home10 from "@/assets/images/mega/home-10.png";
import home11 from "@/assets/images/mega/home-11.png";
import comming from "@/assets/images/mega/coming.png";
import homeDark1 from "@/assets/images/mega/home-1-dark.png";
import homeDark2 from "@/assets/images/mega/home-2-dark.png";
import homeDark3 from "@/assets/images/mega/home-3-dark.png";
import homeDark4 from "@/assets/images/mega/home-4-dark.png";
import homeDark5 from "@/assets/images/mega/home-5-dark.png";
import homeDark6 from "@/assets/images/mega/home-6-dark.png";
import homeDark7 from "@/assets/images/mega/home-7-dark.png";
import homeDark8 from "@/assets/images/mega/home-8-dark.png";
import homeDark9 from "@/assets/images/mega/home-9-dark.png";
import homeDark10 from "@/assets/images/mega/home-10-dark.png";
import homeDark11 from "@/assets/images/mega/home-11-dark.png";
import commingDark from "@/assets/images/mega/coming-dark.png";
import Image from "next/image";
import Link from "next/link";
const TabContentDemoes = ({ isDark }) => {
  const demoes = [
    {
      name: "Home",
      path: isDark ? "/home-1-dark" : "/",
      image: isDark ? homeDark1 : home1,
      status: null,
    },
  ];
  return (
    <div
      id="light-demos"
      className="block opacity-100 transition-opacity duration-150 ease-linear"
    >
      <ul id="light-list" className="grid grid-cols-5 gap-30px pt-30px pb-15px">
        {demoes?.map(({ image, name, path, status }, idx) => (
          <li key={idx}>
            <Link
              href={path}
              className="overflow-hidden group/light relative block shadow-dropdown-card hover:shadow-dropdown-card-hover hover:-translate-y-[5px] rounded-standard dark:shadow-dropdown-card-dark"
            >
              <Image prioriy="false" placeholder="blur" src={image} alt="" />
              {status && (
                <span className="bg-secondaryColor text-xs px-15px py-5px leading-1 text-white absolute top-5px left-5px rounded-standard">
                  {status}
                </span>
              )}
              <span className="absolute left-0 w-full top-full group-hover/light:-translate-y-full bg-primaryColor text-sm leading-[1] p-10px text-center font-semibold text-whiteColor">
                {name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabContentDemoes;
