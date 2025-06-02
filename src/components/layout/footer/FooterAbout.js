import useIsSecondary from "@/hooks/useIsSecondary";

const FooterAbout = () => {
  const { isSecondary } = useIsSecondary();
  return (
    <div
      className="sm:col-start-1 sm:col-span-12 md:col-span-6 lg:col-span-4 mr-30px"
      data-aos="fade-up"
    >
      <h4 className="text-size-22 font-bold text-bodyColor dark:text-whiteColor mb-3">About Us</h4>
      <p className="text-base lg:text-sm 2xl:text-base text-darkgray mb-30px leading-1.8 2xl:leading-1.8">
        Tanga Academy is an innovative online learning platform designed to empower students, educators, and professionals with high-quality, flexible educational content available anytime, anywhere.
      </p>
      <div className="flex items-center">
        <div>
          <i className="icofont-clock-time text-3xl text-whiteColor h-78px w-78px bg-primaryColor leading-78px mr-22px block text-center"></i>
        </div>
        <div>
          <h6 className="text-lg text-gray-600 dark:text-whiteColor font-medium leading-29px">
            PLATFORM ACCESS
          </h6>
          <p className="text-sm text-gray-600 dark:text-whiteColor text-opacity-60 mb-1">
            Available 24/7 for all users
          </p>
          <p className="text-sm text-gray-600 dark:text-whiteColor text-opacity-60">
            Support Hours: Mon - Fri (9:00 AM – 6:00 PM)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterAbout;
