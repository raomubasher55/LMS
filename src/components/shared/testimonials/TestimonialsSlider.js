"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import TestimonialSlide from "./TestimonialSlide";
import { UserIcon } from "lucide-react"; // SVG icon from lucide-react
import TranslatedText from "../TranslatedText";

const TestimonialsSlider = () => {
const testimonials = [
  {
    name: "Amina Yusuf",
    desig: <TranslatedText>Étudiante en développement web</TranslatedText>,
    desc: <TranslatedText>
      Tanga Academie a transformé ma carrière. Le cours HTML et CSS m’a donné des compétences concrètes et la confiance pour créer des sites web par moi-même.
    </TranslatedText>,
  },
  {
    name: "John Mwakalukwa",
    desig: <TranslatedText>Freelance & Ancien élève</TranslatedText>,
    desc: <TranslatedText>
      Les projets pratiques et les conseils d’experts m'ont permis de décrocher ma première mission freelance. Je le recommande vivement à tous ceux qui prennent le code au sérieux.
    </TranslatedText>,
  },
  {
    name: "Rehema Mushi",
    desig: <TranslatedText>Développeuse débutante</TranslatedText>,
    desc: <TranslatedText>
      J’ai commencé sans aucune base en code, et maintenant je crée des sites web responsive en toute confiance grâce à leurs tutoriels étape par étape.
    </TranslatedText>,
  },
  {
    name: "Elisha Mndeme",
    desig: <TranslatedText>Designer UI/UX</TranslatedText>,
    desc: <TranslatedText>
      Le module CSS de Tanga Academie m’a permis de maîtriser Flexbox et Grid. Parfait pour les designers qui veulent des compétences en frontend.
    </TranslatedText>,
  },
  {
    name: "Fatma Ally",
    desig: <TranslatedText>Passionnée de Full-Stack</TranslatedText>,
    desc: <TranslatedText>
      La structure et le soutien de Tanga Academie sont excellents. J’ai maintenant une base solide en développement web.
    </TranslatedText>,
  },
  {
    name: "Samuel Mbwana",
    desig: <TranslatedText>Diplômé en informatique</TranslatedText>,
    desc: <TranslatedText>
      Je m’étais inscrit pour rafraîchir mes compétences. Finalement, j’ai appris des outils de développement modernes que je n’avais jamais utilisés à l’université.
    </TranslatedText>,
  },
  {
    name: "Neema Joseph",
    desig: <TranslatedText>Designer freelance</TranslatedText>,
    desc: <TranslatedText>
      Les cours sont clairs, adaptés aux débutants et pratiques. J’utilise ce que j’ai appris chaque jour dans mon travail freelance.
    </TranslatedText>,
  },
  {
    name: "Juma Said",
    desig: <TranslatedText>Stagiaire en développement logiciel</TranslatedText>,
    desc: <TranslatedText>
      Tanga Academie m’a enfin permis de comprendre JavaScript. Je développe maintenant des applications web interactives en toute confiance.
    </TranslatedText>,
  },
  {
    name: "Lucy Matonya",
    desig: <TranslatedText>Étudiante universitaire</TranslatedText>,
    desc: <TranslatedText>
      Je me suis inscrite pendant les vacances et j’ai appris plus de choses pratiques que pendant toute ma première année à l’université.
    </TranslatedText>,
  },
  {
    name: "Hamis Rajabu",
    desig: <TranslatedText>Développeur en devenir</TranslatedText>,
    desc: <TranslatedText>
      Leur approche basée sur les projets fait vraiment la différence. On termine avec des réalisations concrètes pour son portfolio.
    </TranslatedText>,
  },
  {
    name: "Angela Nyangusi",
    desig: <TranslatedText>Graphiste</TranslatedText>,
    desc: <TranslatedText>
      Les cours frontend m’ont aidée à combler l’écart entre le design et le développement. Je recommande vivement.
    </TranslatedText>,
  },
  {
    name: "George Paul",
    desig: <TranslatedText>Développeur Frontend</TranslatedText>,
    desc: <TranslatedText>
      J’ai amélioré mes compétences et décroché un emploi à distance grâce à ce que j’ai appris chez Tanga Academie.
    </TranslatedText>,
  },
  {
    name: "Ruth Mbaga",
    desig: <TranslatedText>Développeuse WordPress</TranslatedText>,
    desc: <TranslatedText>
      Les approfondissements sur HTML/CSS ont amélioré mes thèmes WordPress de façon remarquable. Du code propre et moderne.
    </TranslatedText>,
  },
  {
    name: "Salim Athumani",
    desig: <TranslatedText>Développeur autodidacte</TranslatedText>,
    desc: <TranslatedText>
      J’ai enfin trouvé un parcours d’apprentissage structuré avec Tanga Academie. Pas de blabla, juste l’essentiel.
    </TranslatedText>,
  },
  {
    name: "Mariam Juma",
    desig: <TranslatedText>Stagiaire UI</TranslatedText>,
    desc: <TranslatedText>
      Grâce à leur mentorat, j’ai obtenu un stage en tant que développeuse UI. Le retour d’expérience a été inestimable.
    </TranslatedText>,
  },
  {
    name: "Noel Christopher",
    desig: <TranslatedText>Lycéen</TranslatedText>,
    desc: <TranslatedText>
      Apprendre avec Tanga Academie a été ma première expérience en programmation. Maintenant, je veux devenir ingénieur logiciel.
    </TranslatedText>,
  },
];


  return (
    <Swiper
      className="mySwiper"
      slidesPerView={1}
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      loop={true}
      navigation={true}
      modules={[Navigation]}
    >
      {testimonials.map((testimonial, idx) => (
        <SwiperSlide key={idx}>
          <TestimonialSlide testimonial={testimonial} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TestimonialsSlider;
