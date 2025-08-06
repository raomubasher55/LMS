import TranslatedText from "../TranslatedText";

const FilterController = ({ categories, selectedCategory, setSelectedCategory }) => {
  const handleClick = (category) => {
    setSelectedCategory(category.toLowerCase());
  };

  return (
    <div className="basis-full lg:basis-[700px]">
      <ul className="filter-controllers flex flex-wrap sm:flex-nowrap justify-start lg:justify-end button-group filters-button-group" data-aos="fade-up">
        <li>
          <button 
            onClick={() => handleClick("all")} 
            className={`pr-5 md:pr-10 lg:pr-17px 2xl:pr-10 font-medium ${
              selectedCategory === "all" 
                ? "text-primaryColor dark:text-primaryColor"
                : "text-contentColor hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
            }`}
          >
            <TranslatedText>Voir tout</TranslatedText>
          </button>
        </li>
        
        {categories.map(category => (
          <li key={category}>
            <button 
              onClick={() => handleClick(category)} 
              className={`pr-5 md:pr-10 lg:pr-17px 2xl:pr-10 font-medium ${
                selectedCategory === category.toLowerCase() 
                  ? "text-primaryColor dark:text-primaryColor"
                  : "text-contentColor hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterController;