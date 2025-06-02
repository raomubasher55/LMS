import Image from "next/image";
import vissionImage from "@/assets/images/about/vision.jpg";

const OurVissionContent = () => {
  return (
    <div>
      <p className="text-contentColor dark:text-contentColor-dark mb-25px">
        At Tanga Academy, our vision is to democratize access to quality education and empower individuals across the globe with the knowledge and skills needed to thrive in the modern world. We believe learning should be flexible, accessible, and relevant—shaping not only careers but also confident, capable minds ready to impact the future.
      </p>

      <ul className="space-y-3 grid grid-cols-1 lg:grid-cols-2 mb-25px">
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Bridge the global education gap through digital platforms
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Deliver real-world skills through expert-led courses
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Foster a culture of lifelong learning and innovation
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Build an inclusive learning community for all ages
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Encourage creativity, critical thinking, and leadership
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Support flexible, self-paced, and instructor-guided learning
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Integrate emerging technologies to enhance education
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            Promote educational equity and opportunities worldwide
          </p>
        </li>
      </ul>

      <Image src={vissionImage} alt="Tanga Academy Vision" className="w-full" placeholder="blur" />
    </div>
  );
};

export default OurVissionContent;
