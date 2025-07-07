import Image from "next/image";
import vissionImage from "@/assets/images/about/vision.jpg";
import TranslatedText from "../TranslatedText";

const OurVissionContent = () => {
  return (
    <div>
      <p className="text-contentColor dark:text-contentColor-dark mb-25px">
      <TranslatedText>
        Chez Tanga Academie, notre vision est de démocratiser l’accès à une éducation de qualité et d’autonomiser les individus à travers le monde grâce aux connaissances et aux compétences nécessaires pour réussir dans le monde moderne. Nous croyons que l’apprentissage doit être flexible, accessible et pertinent — façonnant non seulement les carrières, mais aussi des esprits confiants et capables, prêts à impacter l’avenir.
      </TranslatedText>
      </p>

      <ul className="space-y-3 grid grid-cols-1 lg:grid-cols-2 mb-25px">
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
           <TranslatedText>
            Combler le fossé éducatif mondial grâce aux plateformes numériques
           </TranslatedText>
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            <TranslatedText>
              Fournir des compétences concrètes grâce à des cours dirigés par des experts
            </TranslatedText>
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            <TranslatedText>
              Favoriser une culture d’apprentissage continu et d’innovation
            </TranslatedText>
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            <TranslatedText>
              Créer une communauté d’apprentissage inclusive pour tous les âges
            </TranslatedText>
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            <TranslatedText>
              Encourager la créativité, la pensée critique et le leadership
            </TranslatedText>
          </p>
        </li>
        <li className="flex items-center group">
          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
            <TranslatedText>
              Soutenir un apprentissage flexible, autonome et encadré par des instructeurs
            </TranslatedText>
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
            <TranslatedText>
              Promouvoir l'équité éducative et les opportunités dans le monde entier
            </TranslatedText>
          </p>
        </li>
      </ul>

      <Image src={vissionImage} alt="Tanga Academie Vision" className="w-full" placeholder="blur" />
    </div>
  );
};

export default OurVissionContent;
