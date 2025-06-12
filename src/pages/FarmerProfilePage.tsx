import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import type { Farmer, ProductWithFarmer } from '../types';

interface FarmerLoaderData {
  farmer: Farmer;
  products: ProductWithFarmer[];
}

export const FarmerProfilePage: React.FC = () => {
    const { farmer, products } = useLoaderData() as FarmerLoaderData;
    const { isLoggedIn } = useAuth();

    return (
        <main>
            {/* Hero Section with Banner */}
            <section className="relative mb-lg md:mb-2xl">
                <div 
                    className="h-64 md:h-80 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${farmer.bannerUrl}')` }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
                    <div className="flex flex-col md:flex-row md:items-end -mt-20 relative z-10">
                        <img 
                            src={farmer.imageUrl} 
                            alt={`Farmer ${farmer.name}`} 
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg bg-white mx-auto md:mx-0" 
                        />
                        <div className="md:ml-md mb-2 text-center md:text-left mt-md md:mt-0">
                            <h1 className="text-3xl md:text-5xl font-lora font-bold text-evergreen">{farmer.farmName}</h1>
                            <p className="text-lg md:text-xl font-semibold text-charcoal/80">with {farmer.name}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg lg:gap-xl">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <blockquote className="border-l-4 border-harvest-gold pl-md text-2xl md:text-3xl italic leading-relaxed text-charcoal/90 font-lora">
                            "{farmer.quote}"
                        </blockquote>
                        <div className="prose max-w-none text-charcoal/90 mt-lg space-y-md text-lg leading-relaxed whitespace-pre-wrap">
                           {farmer.story}
                        </div>
                    </div>
                    
                    {/* Sidebar */}
                    <aside>
                        <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm space-y-md sticky top-24">
                            <h3 className="text-2xl font-lora text-evergreen">Farm Details</h3>
                            <div className="space-y-sm text-md">
                                <div className="flex items-center gap-3">
                                    <i className="ph-bold ph-map-pin text-harvest-gold text-xl"></i>
                                    <span>{farmer.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <i className="ph-bold ph-calendar text-harvest-gold text-xl"></i>
                                    <span>Family-Owned since {farmer.established}</span>
                                </div>
                                {farmer.practices.map(practice => (
                                    <div key={practice} className="flex items-center gap-3">
                                        <i className="ph-bold ph-leaf text-harvest-gold text-xl"></i>
                                        <span>{practice}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
                
                {/* Products Section */}
                <section className="mt-2xl">
                    <div className="mb-lg">
                        <h2 className="text-4xl md:text-5xl font-lora text-evergreen">Current Group Buys from {farmer.farmName}</h2>
                        <p className="text-body mt-2">
                            Join these active group buys to get fresh produce directly from {farmer.name}.
                        </p>
                    </div>
                    
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                           {products.map(product => (
                               <div key={product.id} className="product-card">
                                   <ProductCard product={product} isLoggedIn={isLoggedIn} />
                               </div>
                           ))}
                        </div>
                    ) : (
                        <div className="text-center py-xl">
                            <div className="bg-white rounded-xl p-xl border border-stone/10 shadow-sm">
                                <i className="ph-bold ph-plant text-stone text-6xl mb-md"></i>
                                <h3 className="text-2xl font-lora text-charcoal mb-sm">No Active Group Buys</h3>
                                <p className="text-body">
                                    {farmer.farmName} doesn't have any active group buys right now. 
                                    Check back soon for new seasonal offerings!
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};