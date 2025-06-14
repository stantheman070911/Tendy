import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { productService } from '../services/productService';
import { toast } from 'react-hot-toast';
import type { ProductWithFarmer } from '../types';

interface ProductLoaderData {
  product: ProductWithFarmer;
}

export const ProductDetailsPage: React.FC = () => {
    const { product } = useLoaderData() as ProductLoaderData;
    const navigate = useNavigate();

    // State for the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to track if user has joined this group (optimistic UI)
    const [hasJoined, setHasJoined] = useState(false);
    // State for join loading
    const [isJoining, setIsJoining] = useState(false);

    const [activeImage, setActiveImage] = useState(product.imageUrl);

    useEffect(() => {
        setActiveImage(product.imageUrl);
    }, [product]);

    // --- OPTIMISTIC UI LOGIC FOR JOINING A GROUP ---
    const handleJoinClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmJoin = async () => {
        setIsJoining(true);
        setIsModalOpen(false); // Close modal immediately

        const loadingToast = toast.loading('Joining group...');

        try {
            // Use the service to join the group
            const result = await productService.joinGroup(product.id);

            if (result === true) {
                // Success! The spot was claimed.
                setHasJoined(true); // Keep the optimistic UI state
                toast.success(`Successfully joined group for ${product.title}!`, { duration: 4000 });
                
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
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            toast.error(errorMessage);
        } finally {
            toast.dismiss(loadingToast);
            setIsJoining(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const filledSpots = Math.floor((product.members?.length || 0));
    const totalSpots = filledSpots + product.spotsLeft;
    const progressPercent = totalSpots > 0 ? (filledSpots / totalSpots) * 100 : 0;

    return (
        <>
            <main className="container mx-auto max-w-screen-xl px-md md:px-lg py-lg md:py-xl">
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
                                <p className="text-lg line-through text-stone">${product.originalPrice.toFixed(2)} Retail</p>
                            </div>
                            <div className="w-full sm:w-auto">
                                <button 
                                    onClick={handleJoinClick}
                                    disabled={hasJoined || isJoining || product.spotsLeft <= 0}
                                    className={`w-full h-14 px-8 flex items-center justify-center font-bold text-lg rounded-lg transition-all shadow-lg ${
                                        hasJoined 
                                        ? 'bg-success text-white cursor-not-allowed' 
                                        : isJoining
                                        ? 'bg-stone/50 text-stone cursor-not-allowed'
                                        : product.spotsLeft <= 0
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
                                    ) : product.spotsLeft <= 0 ? (
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
                                <span className="text-stone">{product.daysLeft} days left</span>
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
                                <img width="80" height="80" className="w-20 h-20 rounded-full flex-shrink-0" src={product.farmer.avatar} alt="Farmer Avatar"/>
                                <div>
                                    <p className="text-sm font-semibold text-stone">FROM</p>
                                    <h4 className="text-2xl font-lora">{product.farmer.name}</h4>
                                    <Link to={`/farmer/${product.farmerId}`} className="text-md font-semibold text-evergreen hover:text-harvest-gold transition-colors flex items-center gap-1 group">
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