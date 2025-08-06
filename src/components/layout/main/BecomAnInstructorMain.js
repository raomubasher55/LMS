import BecomeAnInstructorPrimary from "@/components/sections/become-an-instructor/BecomeAnInstructorPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";

const BecomAnInstructorMain = () => {
  return (
    <>
      <HeroPrimary
        path={"Devenir formateur"}
        title={"Devenir formateur"}
      />
      <BecomeAnInstructorPrimary />
    </>
  );
};

export default BecomAnInstructorMain;
