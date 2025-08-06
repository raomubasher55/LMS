import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import TranslatedText from "@/components/shared/TranslatedText";

const ContactFrom = () => {
  return (
    <section>
      <div className="container pb-100px">
        <form
          className="p-5 md:p-70px md:pt-90px border border-borderColor2 dark:border-transparent dark:shadow-container"
          data-aos="fade-up"
        >
          {/* heading  */}
          <div className="mb-10">
            <h4
              className="text-size-23 md:text-size-44 font-bold leading-10 md:leading-70px text-blackColor dark:text-blackColor-dark"
              data-aos="fade-up"
            >
              <TranslatedText>Laissez-nous un message</TranslatedText>
            </h4>
            <p
              data-aos="fade-up"
              className="text-size-13 md:text-base leading-5 md:leading-30px text-contentColor dark:text-contentColor-dark"
            >
              <TranslatedText>Votre adresse e-mail ne sera pas publiée. Les champs obligatoires sont marqués *</TranslatedText>
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 mb-30px gap-30px">
            <div data-aos="fade-up" className="relative">
              <input
                type="text"
                placeholder="Entrez votre nom*"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              />

              <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-businessman"></i>
              </div>
            </div>
            <div data-aos="fade-up" className="relative">
              <input
                type="email"
                placeholder="Entrez votre adresse e-mail*"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              />

              <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-envelope"></i>
              </div>
            </div>
            <div data-aos="fade-up" className="relative">
              <input
                type="text"
                placeholder="Écrivez le type de service"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              />

              <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-edit"></i>
              </div>
            </div>
            <div data-aos="fade-up" className="relative">
              <input
                type="text"
                placeholder="Entrez votre numéro de téléphone"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              />

              <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-ui-call"></i>
              </div>
            </div>
          </div>

          <div className="relative" data-aos="fade-up">
            <textarea
              placeholder="Entrez votre message ici"
              className="w-full pl-26px bg-transparent text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 rounded"
              cols="30"
              rows="10"
            />
            <div className="text-xl leading-23px text-primaryColor absolute right-6 top-[17px]">
              <i className="icofont-pen-alt-2"></i>
            </div>
          </div>

          <div className="mt-30px" data-aos="fade-up">
            <ButtonPrimary type={"submit"}><TranslatedText>Poster un commentaire</TranslatedText></ButtonPrimary>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactFrom;
