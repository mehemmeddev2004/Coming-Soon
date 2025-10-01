import React from "react";

const Footer = () => {
  const categories = [
    "Femme",
    "Homme",
    "Fille",
    "Garçon",
    "Bébé Fille",
    "Bébé Garçon",
    "Nouveau-né Bébé Fille",
    "Nouveau-né Bébé Garçon",
    "Robe Femme",
    "Robe Longue Femme",
    "Robe Courte",
    "Robe Midi",
    "Short Femme",
    "Jeans Larges pour Femme",
    "Jeans Larges pour Homme",
    "Pantalon Femme",
    "Pantalon Homme",
    "Pantalon Cargo Homme",
    "Chemise Femme",
    "Chemises Homme",
    "T-shirts Homme",
    "T-shirt Femme",
    "T-shirts Fille",
    "T-shirts Garçon",
    "Kimono",
    "Tuniques Femme",
    "Ensemble Garçon",
    "Collection Modeste",
    "Vêtements De Maternité",
  ];

  return (
    <footer>
      <div className="w-full min-h-[40vh] flex flex-col px-[15px] bg-[#F8F8F9]">
        <div className="max-w-[1286px] w-full mx-auto py-8">
         
          <h2 className="text-lg font-semibold mb-4">Top Catégories</h2>

       
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-600 hover:text-black transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
