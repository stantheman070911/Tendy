import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types';

interface ProductLoaderData {
  product: Product;
}

export const ProductDetailsPage: React.FC = () => {
    const { product } = useLoaderData() as ProductLoaderData;
    const navigate = useNavigate();

    // State for the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to track if user has joined this group (optimistic UI)
    const [hasJoined, setHasJoined] = useState(false);
    // State for handling join errors
    const [joinError, setJoinError] = useState<string | null>(null);
    // State for join loading
    const [isJoining, setIsJoining] = useState(false);

    const [activeImage, setActiveImage] = useState(product.image_url);

    useEffect(() => {
        setActiveImage(product.image_url);
    }, [product]);

    // --- OPTIMISTIC UI LOGIC FOR JOINING A GROUP ---
    const handleJoinClick = () => {
        setJoinError(null);
        setIsModalOpen(true);
    };

    const handleConfirmJoin = async () => {
        setIsJoining(true);
        setJoinError(null);
        setIsModalOpen(false); // Close modal immediately

        try {
            // Call the PostgreSQL function from your client
            const { data, error } = await supabase.rpc('join_group', {
                product_id_to_join: product.id
            });

            if (error) {
                throw new Error('A database error occurred. Please try again.');
            }

            // The 'data' returned from the function will be true or false
            if (data === true) {
                // Success! The spot was claimed.
                setHasJoined(true); // Keep the optimistic UI state
                console.log(`Successfully joined group for ${product.title}`);
                // Optional: Redirect to dashboard after a short delay
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                // The function returned false, meaning no spots were left
                throw new Error('Sorry, the last spot was just taken!');
            }

        } catch (error) {
            // Revert optimistic update on any error
            setHasJoined(false);
            setJoinError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsJoining(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setJoinError(null);
    };

    // Handle both database field names and interface field names
    const spotsLeft = product.spots_left || product.spotsLeft || 0;
    const daysLeft = product.days_left || product.daysLeft || 0;
    const originalPrice = product.original_price || product.originalPrice || 0;
    
    const filledSpots = Math.floor((product.members?.length || 0));
    const totalSpots = filledSpots + spotsLeft;
    const progressPercent = totalSpots > 0 ? (filledSpots / totalSpots) * 100 : 0;

    return (
        <>
            <main className="container mx-auto max-w-screen-xl px-md md:px-lg py-lg md:py-xl">
                {/* Error Message */}
                {joinError && (
                    <div className="mb-lg p-md rounded-lg bg-error-light text-error border border-error/20 flex items-center gap-3">
                        <i className="ph-bold ph-warning-circle text-2xl"></i>
                        <div>
                            <p className="font-semibold">Failed to join group</p>
                            <p className="text-sm">{joinError}</p>
                        </div>
                        <button 
                            onClick={() => setJoinError(null)}
                            className="ml-auto text-error hover:text-error/70"
                        >
                            <i className="ph-bold ph-x text-xl"></i>
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-xl">
                    
                    {/* Left Column: Image Gallery */}
                    <div>
                        <div className="aspect-w-4 aspect-h-3">
                            <img src={activeImage} alt={product.title} className="w-full h-full object-cover rounded-xl shadow-lg"/>
                        </div>
                        {product.gallery && product.gallery.length > 0 && (
                            <div className="grid grid-cols-4 gap-sm mt-sm">
                                {product.gallery.map((imgSrc, index) => (
                                    <button key={index} onClick={() => setActiveImage(imgSrc)} className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ring-2 transition ${activeImage === imgSrc ? 'ring-harvest-gold' : 'ring-transparent hover:ring-harvest-gold/50'}`}>
                                        <img src={imgSrc} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Details & CTA */}
                    <div className="mt-lg lg:mt-0 flex flex-col">
                        <h1 className="text-4xl lg:text-5xl font-lora leading-tight">{product.title}</h1>
                        <p className="text-2xl font-semibold text-charcoal mt-2">{product.weight}</p>
                        
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-md">
                            <div>
                                <p className="text-4xl font-bold text-evergreen">${product.price.toFixed(2)}</p>
                                <p className="text-lg line-through text-stone">${originalPrice.toFixed(2)} Retail</p>
                            </div>
                            <div className="w-full sm:w-auto">
                                <button 
                                    onClick={handleJoinClick}
                                    disabled={hasJoined || isJoining || spotsLeft <= 0}
                                    className={`w-full h-14 px-8 flex items-center justify-center font-bold text-lg rounded-lg transition-all shadow-lg ${
                                        hasJoined 
                                        ? 'bg-success text-white cursor-not-allowed' 
                                        : isJoining
                                        ? 'bg-stone/50 text-stone cursor-not-allowed'
                                        : spotsLeft <= 0
                                        ? 'bg-error/20 text-error cursor-not-allowed'
                                        : 'bg-harvest-gold text-evergreen hover:scale-105 shadow-harvest-gold/20'
                                    }`}
                                >
                                    {isJoining ? (
                                        <>
                                            <i className="ph ph-spinner animate-spin mr-2"></i>
                                            Joining...
                                        </>
                                    ) : hasJoined ? (
                                        <>
                                            <i className="ph-bold ph-check-circle mr-2"></i>
                                            Successfully Joined!
                                        </>
                                    ) : spotsLeft <= 0 ? (
                                        'Group Full'
                                    ) : (
                                        'Join Group'
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div className="prose max-w-none text-charcoal/90 mt-lg whitespace-pre-wrap">
                            <p>{product.description}</p>
                        </div>

                        <div className="bg-white rounded-xl p-md mt-lg border border-stone/10 shadow-sm">
                            <div className="flex justify-between items-center text-sm font-semibold mb-2">
                                <span className="text-success">{filledSpots} of {totalSpots} spots filled!</span>
                                <span className="text-stone">{daysLeft} days left</span>
                            </div>
                            <div className="w-full bg-success-light rounded-full h-4">
                                <div className="bg-success h-4 rounded-full transition-all duration-300" style={{width: `${progressPercent}%`}}></div>
                            </div>
                        </div>

                        {product.members && product.members.length > 0 && (
                            <div className="mt-lg">
                                <h3 className="text-2xl font-lora">Your Neighbors in this Group</h3>
                                <div className="flex items-center -space-x-3 mt-md overflow-hidden">
                                    {product.members.map(member => (
                                        <img key={member.id} width="48" height="48" className="w-12 h-12 rounded-full border-2 border-white" src={member.avatar} alt={`Avatar of ${member.name}`} title={member.name} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-lg space-y-md">
                            <div className="bg-white rounded-xl p-md border border-stone/10 shadow-sm flex items-center gap-md">
                                <img width="80" height="80" className="w-20 h-20 rounded-full flex-shrink-0" src={product.farmer?.avatar || 'https://i.pravatar.cc/80?img=1'} alt="Farmer Avatar"/>
                                <div>
                                    <p className="text-sm font-semibold text-stone">FROM</p>
                                    <h4 className="text-2xl font-lora">{product.farmer?.name || 'Local Farmer'}</h4>
                                    <Link to={`/farmer/${product.farmer_id || product.farmerId}`} className="text-md font-semibold text-evergreen hover:text-harvest-gold transition-colors flex items-center gap-1 group">
                                        <span>View Profile</span>
                                        <i className="ph-bold ph-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
                                    </Link>
                                </div>
                            </div>
                            {product.host && (
                                <div className="bg-white rounded-xl p-md border border-stone/10 shadow-sm flex items-center gap-md">
                                    <img width="80" height="80" className="w-20 h-20 rounded-full flex-shrink-0" src={product.host.avatar} alt="Host Avatar"/>
                                    <div>
                                        <p className="text-sm font-semibold text-stone">HOSTED BY</p>
                                        <h4 className="text-2xl font-lora">{product.host.name}</h4>
                                        <a href="#" className="text-md font-semibold text-evergreen hover:text-harvest-gold transition-colors flex items-center gap-1 group">
                                            <span>View Pickup Details</span>
                                            <i className="ph-bold ph-arrow-right text-lg group-hover:translate-x-1 transition-transform"></i>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Render the modal, passing in the necessary props */}
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmJoin}
                product={product}
            />
        </>
    );
};