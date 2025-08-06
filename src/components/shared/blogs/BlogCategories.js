"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TranslatedText from '@/components/shared/TranslatedText';

const BlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to create URL-friendly slug
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/categories/list`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          if (data.success && Array.isArray(data.categories)) {
            setCategories(data.categories);
            console.log('Categories set:', data.categories);
          } else {
            throw new Error(data.message || 'Invalid response format');
          }
        }
      } catch (err) {
        console.error('Categories fetch error:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-borderColor2-dark"
      data-aos="fade-up"
    >
      <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        <TranslatedText>Catégories</TranslatedText>
        {!loading && categories.length > 0 && (
          <span className="text-sm font-normal ml-2">({categories.length})</span>
        )}
      </h4>

      {loading ? (
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm mb-3"><TranslatedText>Échec du chargement des catégories</TranslatedText></p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primaryColor text-white rounded text-sm hover:bg-primaryColor/80 transition-colors"
          >
            <TranslatedText>Réessayer</TranslatedText>
          </button>
        </div>
      ) : categories.length > 0 ? (
        <ul className="flex flex-col gap-y-4">
          {categories.map((category, index) => {
            const categorySlug = createSlug(category.name);
            
            return (
              <li 
                key={category.name || `category-${index}`}
                className="text-contentColor hover:text-white hover:bg-primaryColor transition-all duration-300 text-sm font-medium px-4 py-2 border border-borderColor2 hover:border-primaryColor dark:border-borderColor2-dark dark:hover:border-primaryColor flex justify-between items-center leading-7 rounded"
              >
                <Link 
                  href={`/blogs/${categorySlug}`}
                  className="flex-1 hover:no-underline"
                >
                  {category.name}
                </Link>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs ml-2">
                  {category.count}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm"><TranslatedText>Aucune catégorie trouvée</TranslatedText></p>
          <p className="text-xs text-gray-400 mt-2"><TranslatedText>Les catégories apparaîtront quand les blogs seront publiés</TranslatedText></p>
        </div>
      )}
    </div>
  );
};

export default BlogCategories;