import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { CreateProductModal } from '../../components/CreateProductModal';
import type { FarmerSection, Product } from '../../types';

interface FarmerViewProps {
  activeSection: FarmerSection;
}

export const FarmerView: React.FC<FarmerViewProps> = ({ activeSection }) => {
    const { user } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch farmer's products
    useEffect(() => {
        const fetchFarmerProducts = async () => {
            if (!user?.email) return;

            setIsLoading(true);
            try {
                // First get the farmer's ID
                const { data: farmerData, error: farmerError } = await supabase
                    .from('farmers')
                    .select('id')
                    .eq('email', user.email)
                    .single();

                if (farmerError || !farmerData) {
                    console.error('Farmer not found:', farmerError);
                    setProducts([]);
                    return;
                }

                // Then get their products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('farmer_id', farmerData.id)
                    .order('created_at', { ascending: false });

                if (productsError) {
                    console.error('Error fetching products:', productsError);
                    setProducts([]);
                } else {
                    setProducts(productsData || []);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (activeSection === 'listings') {
            fetchFarmerProducts();
        }
    }, [user?.email, activeSection]);

    const handleCreateSuccess = () => {
        // Refresh the products list
        if (user?.email) {
            const fetchFarmerProducts = async () => {
                const { data: farmerData } = await supabase
                    .from('farmers')
                    .select('id')
                    .eq('email', user.email)
                    .single();

                if (farmerData) {
                    const { data: productsData } = await supabase
                        .from('products')
                        .select('*')
                        .eq('farmer_id', farmerData.id)
                        .order('created_at', { ascending: false });

                    setProducts(productsData || []);
                }
            };
            fetchFarmerProducts();
        }
    };

    const getStatusBadge = (product: any) => {
        const spotsLeft = product.spots_left || 0;
        const daysLeft = product.days_left || 0;
        
        if (spotsLeft === 0) {
            return <span className="px-3 py-1 bg-success-light text-success font-bold text-sm rounded-full">FULL</span>;
        } else if (daysLeft <= 0) {
            return <span className="px-3 py-1 bg-error-light text-error font-bold text-sm rounded-full">EXPIRED</span>;
        } else {
            return <span className="px-3 py-1 bg-info-light text-info font-bold text-sm rounded-full">ACTIVE</span>;
        }
    };

    return (
        <div className="space-y-xl">
            {/* My Listings Section */}
            <section className={activeSection === 'listings' ? '' : 'hidden'}>
                <div className="flex flex-wrap justify-between items-center gap-md mb-md">
                    <h2 className="text-3xl font-lora">Product Listings</h2>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-12 px-6 flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:scale-105 transition-transform"
                    >
                        <i className="ph-bold ph-plus-circle mr-2"></i> Create New Listing
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-xl">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-harvest-gold border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
                            <p className="text-lg font-semibold text-charcoal">Loading your listings...</p>
                        </div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="space-y-md">
                        {products.map(product => (
                            <div key={product.id} className="bg-white rounded-xl p-md border border-stone/10 shadow-sm flex flex-col sm:flex-row items-start gap-md">
                                <img 
                                    src={product.image_url || product.imageUrl} 
                                    alt={product.title} 
                                    className="w-full sm:w-32 h-32 sm:h-auto object-cover rounded-lg" 
                                />
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-lora">{product.title}</h3>
                                    <p className="font-semibold text-stone">Price: ${product.price} / {product.weight}</p>
                                    <p className="text-sm text-charcoal/80 mt-1 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center text-sm font-semibold mt-3">
                                        <span className="text-success">
                                            {(product.spotsTotal || 10) - (product.spots_left || 0)} / {product.spotsTotal || 10} spots filled
                                        </span>
                                        {getStatusBadge(product)}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    <button className="h-10 px-4 bg-evergreen text-parchment font-semibold rounded-lg hover:opacity-90 transition-opacity">
                                        Manage
                                    </button>
                                    <button className="h-10 px-4 bg-stone/10 text-charcoal font-semibold rounded-lg hover:bg-stone/20 transition-colors">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-xl">
                        <div className="bg-white rounded-xl p-xl border border-stone/10 shadow-sm">
                            <i className="ph-bold ph-storefront text-stone text-6xl mb-md"></i>
                            <h3 className="text-2xl font-lora text-charcoal mb-sm">No Listings Yet</h3>
                            <p className="text-body mb-lg">
                                Create your first product listing to start connecting with customers in your area.
                            </p>
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="h-12 px-6 bg-harvest-gold text-evergreen font-bold rounded-lg hover:scale-105 transition-transform"
                            >
                                <i className="ph-bold ph-plus-circle mr-2"></i> Create Your First Listing
                            </button>
                        </div>
                    </div>
                )}
            </section>

             {/* Sales & Earnings Section */}
            <section className={activeSection === 'sales' ? '' : 'hidden'}>
                 <h2 className="text-3xl font-lora mb-md">Sales & Earnings</h2>
                <div className="bg-white rounded-xl p-md border border-stone/10 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
                        <div className="bg-parchment p-md rounded-lg text-center">
                            <p className="text-stone font-semibold">Total Revenue</p>
                            <p className="text-3xl font-lora text-evergreen">$4,280</p>
                        </div>
                        <div className="bg-parchment p-md rounded-lg text-center">
                            <p className="text-stone font-semibold">Active Sales</p>
                            <p className="text-3xl font-lora text-evergreen">{products.filter(p => (p.spots_left || 0) > 0 && (p.days_left || 0) > 0).length}</p>
                        </div>
                        <div className="bg-parchment p-md rounded-lg text-center">
                            <p className="text-stone font-semibold">Total Listings</p>
                            <p className="text-3xl font-lora text-evergreen">{products.length}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Farm Profile Section */}
            <section className={activeSection === 'farm-profile' ? '' : 'hidden'}>
                <h2 className="text-3xl font-lora mb-md">Edit Farm Profile</h2>
                <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm space-y-md">
                    <div>
                        <label htmlFor="farm-name" className="font-semibold text-charcoal mb-1 block">Farm Name</label>
                        <input id="farm-name" type="text" defaultValue="Rodriguez Farms" className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30" />
                    </div>
                    <div>
                        <label htmlFor="farm-story" className="font-semibold text-charcoal mb-1 block">Your Story (Public)</label>
                        <textarea id="farm-story" rows={5} className="w-full p-4 bg-parchment rounded-md border border-stone/30" defaultValue="For three generations, my family has worked this land. We don't just sell vegetables; we share a piece of our history in every harvest."></textarea>
                    </div>
                    <button className="h-12 px-8 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90">Update Profile</button>
                </div>
            </section>

            {/* Create Product Modal */}
            <CreateProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};