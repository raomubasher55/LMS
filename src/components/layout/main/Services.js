"use client";
import TranslatedText from "@/components/shared/TranslatedText";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Clock, Lock, Globe, Headset, Zap, Heart } from "lucide-react";
import cvImg from '../../../assets/images/services/cv.png';
import girlImg from '../../../assets/images/services/girl.png';

export default function Services() {
  return (
    <div className="px-4 md:px-20 py-16 space-y-16 text-[#2C3340] dark:text-white transition-colors duration-300">
      {/* Section: CV Creation */}
      <section className="flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2">
          <Image src={cvImg} alt="CV Illustration" width={500} height={500} className="w-full h-auto" />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            <TranslatedText>Création de CV / Résumé Professionnel</TranslatedText>
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li><TranslatedText>Un CV qui vous ouvre des portes. Profitez d’un format professionnel et attractif, adapté à vos objectifs.</TranslatedText></li>
            <li><TranslatedText>Mise en page moderne et élégante</TranslatedText></li>
            <li><TranslatedText>Contenu valorisant vos compétences</TranslatedText></li>
            <li><TranslatedText>Modèles adaptés à votre domaine</TranslatedText></li>
            <li><TranslatedText>Version conforme aux normes internationales</TranslatedText></li>
          </ul>
          <p className="text-sm text-orange-500 font-medium">
            <TranslatedText>🎁 Bonus : Guide PDF offert pour optimiser</TranslatedText>
          </p>
        </div>
      </section>

      {/* Section: Translation Services */}
      <section className="flex flex-col md:flex-row-reverse items-center gap-10">
        <div className="md:w-1/2">
          <Image src={girlImg} alt="Translation Illustration" width={500} height={500} className="w-full h-auto" />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            <TranslatedText>Traduction de Documents Professionnels</TranslatedText>
          </h2>
          <p>
            <TranslatedText>Faites traduire vos documents en toute confiance. Précision, rapidité et confidentialité assurées.</TranslatedText>
          </p>
          <p className="text-sm">
            🇫🇷 <TranslatedText>Français</TranslatedText> <span className="mx-1">📄</span> 🇬🇧 <TranslatedText>Anglais</TranslatedText>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            <TranslatedText>🌐 Autres langues sur demande</TranslatedText>
          </p>

          <div className="flex gap-6 pt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-white" />
              <span><TranslatedText>Traduction fidèle</TranslatedText></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-white" />
              <span><TranslatedText>Délais rapides</TranslatedText></span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600 dark:text-white" />
              <span><TranslatedText>Confidentialité garantie</TranslatedText></span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why Choose Us */}
      <section className="text-center space-y-10">
        <h2 className="text-3xl md:text-4xl font-bold">
          <TranslatedText>Pourquoi Choisir Tanga Académie ?</TranslatedText>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <Globe className="mx-auto w-10 h-10 text-blue-600 dark:text-white" />
            <p><TranslatedText>Expertise locale & internationale</TranslatedText></p>
          </div>
          <div className="space-y-2">
            <Headset className="mx-auto w-10 h-10 text-blue-600 dark:text-white" />
            <p><TranslatedText>Accompagnement personnalisé</TranslatedText></p>
          </div>
          <div className="space-y-2">
            <Zap className="mx-auto w-10 h-10 text-blue-600 dark:text-white" />
            <p><TranslatedText>Service rapide & abordable</TranslatedText></p>
          </div>
          <div className="space-y-2">
            <Heart className="mx-auto w-10 h-10 text-blue-600 dark:text-white" />
            <p><TranslatedText>Engagement envers votre réussite</TranslatedText></p>
          </div>
        </div>
      </section>

      {/* Section: Testimonials */}
      <section className="space-y-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          <TranslatedText>Témoignages de clients</TranslatedText>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              text: '« Grâce à Tanga Académie, j’ai enfin un CV professionnel qui met réellement en valeur mes compétences. En moins de deux semaines, j’ai obtenu des entretiens dans trois entreprises différentes. Merci pour ce service de qualité ! »',
              author: '– Arsen Mbenda, Assistante Administrative',
            },
            {
              text: '« Le service de traduction a dépassé mes attentes ! Mon dossier de candidature a été traduit avec une précision remarquable. J’ai pu l’utiliser pour une demande de visa et tout a été approuvé sans souci. »',
              author: '– Jean-Claude Makufi, Étudiant En Mobilité Internationale',
            },
            {
              text: '« J’ai utilisé les deux services de Tanga Académie : création de CV et traduction. Le résultat était tout simplement parfait. Mon CV en anglais a été accepté par une entreprise au Canada, et j’ai déjà commencé le processus de recrutement. »',
              author: '– Aminata, Développeuse Web Junior',
            },
          ].map((testimonial, index) => (
            <blockquote key={index} className="bg-gray-50 dark:bg-[#002B5B] p-6 rounded-2xl shadow transition-colors duration-300">
              <p><TranslatedText>{testimonial.text}</TranslatedText></p>
              <footer className="mt-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <TranslatedText>{testimonial.author}</TranslatedText>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Section: CTA */}
      <section className="text-center space-y-6 pt-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          <TranslatedText>Prêt(e) à booster votre carrière ?</TranslatedText>
        </h2>
        <Link href="/contact">
          <button className="bg-blue-600 hover:bg-blue-700 dark:text-white font-semibold px-6 py-3 rounded-full transition">
            <TranslatedText>Demander Un Service Maintenant</TranslatedText>
          </button>
        </Link>
      </section>
    </div>
  );
}
