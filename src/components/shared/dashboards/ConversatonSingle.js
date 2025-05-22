import Image from "next/image";
import React from "react";

const ConversatonSingle = ({ details }) => {
  const { image, isCurrentUser, messages } = details;

  return (
    <div className={`max-w-415px ${isCurrentUser ? "ml-auto" : ""}`}>
      <div className={`flex ${isCurrentUser ? "text-end" : ""}`}>
        {/* avatar */}
        {isCurrentUser ? (
          ""
        ) : (
          <div className="w-15 h-15 mr-5 flex-shrink">
            {image ? (
              <Image 
                src={image} 
                alt="" 
                className="w-full rounded-full" 
                width={60} 
                height={60} 
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full"></div>
            )}
          </div>
        )}
        {/* details */}
        <div className={`flex-grow ${isCurrentUser ? "mr-5" : ""}`}>
          <div>
            {messages?.map(({ message, time }, idx) => (
              <div key={idx}>
                <p className="text-sm text-blackColor dark:text-blackColor-dark px-15px py-10px mb-15px bg-darkdeep3 dark:bg-darkdeep3-dark rounded-5px">
                  <span className="leading-26px">{message}</span>
                </p>
                <p
                  className={`text-sm text-darkdeep4 leading-22px mb-10px ${
                    isCurrentUser ? "" : "text-start "
                  }`}
                >
                  {time}
                </p>
              </div>
            ))}
          </div>
        </div>
        {isCurrentUser ? (
          <div className="w-15 h-15 flex-shrink">
            {image ? (
              <Image 
                src={image} 
                alt="" 
                className="w-full rounded-full" 
                width={60} 
                height={60} 
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full"></div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ConversatonSingle;
