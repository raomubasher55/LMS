import Image from "next/image";
import React from "react";

const ImageSingle = ({ image }) => {
  return (
    <div className="image-wrapper relative group" data-aos="fade-up">
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
        alt="Image"
        className="gallery-image w-[200px] h-[50px] object-cover"
        width={200}
        height={50}
        unoptimized
      />

      <div className="absolute left-0 top-0 right-0 bottom-0 bg-blackColor bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-60 text-whiteColor flex items-center justify-center">
        <button className="popup-open">
          <i className="icofont-eye-alt opacity-0 group-hover:opacity-100"></i>
        </button>
      </div>
    </div>
  );
};

export default ImageSingle;
