import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { farmerService } from '../../services/farmerService';
import { CreateProductModal } from '../../components/CreateProductModal';
import { usePayouts } from '../../context/PayoutContext';
import { useRatings } from '../../context/RatingContext';
import { toast } from 'react-hot-toast';
import type { FarmerSection, ProductWithFarmer } from '../../types';

interface FarmerViewProps {
  activeSection: FarmerSection;
}

export const FarmerView: React.FC<FarmerViewProps> = ({ activeSection }) => {
    const { user } = useAuth();
    const { getPayoutsByFarmer, getTotalEarnings } = usePayouts();
    const { getRatingsByFarmer, getAverageRating } = useRatings();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [products, setProducts] = useState<ProductWithFarmer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get farmer ID based on current user (in a real app, this would come from auth)
    const farmerId = user?.role === 'farmer' ? 'farmer01' : 'farmer01'; // Default for demo

    // Get payout and rating data
    const farmerPayouts = getPayoutsByFarmer(farmerId);
    const earnings = getTotalEarnings(farmerId);
    const farmerRatings = getRatingsByFarmer(farmerId);
    const ratingStats = getAverageRating(farmerId);

    // Fetch farmer's products
    useEffect(() => {
        const fetchFarmerProducts = async () => {
            if (!user?.email) return;

            setIsLoading(true);
            try {
                // Get farmer by email first
                const farmer = await farmerService.getFarmerByEmail(user.email);
                
                if (!farmer) {
                    console.error('Farmer not found');
                    setProducts([]);
                    return;
                }

                // Then get their products
                const farmerProducts = await productService.getProductsByFarmerId(parseInt(farmer.id));
                setProducts(farmerProducts);

            } catch (error) {
                console.error('Error fetching farmer products:', error);
                toast.error('Failed to load your products');
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (activeSection === 'listings') {
            fetchFarmerProducts();
        }
    }, [user?.email, activeSection]);

    // Optimized state update - prepend new product instead of refetching
    const handleCreateSuccess = (newProduct: ProductWithFarmer) => {
        setProducts(currentProducts => [newProduct, ...currentProducts]);
        toast.success('Product listing created successfully!');
    };

    const getStatusBadge = (product: ProductWithFarmer) => {
        const spotsLeft = product.spotsLeft || 0;
        const daysLeft = product.daysLeft || 0;
        
        if (spotsLeft === 0) {
            return <span className="px-3 py-1 bg-success-light text-success font-bold text-sm rounded-full">FULL</span>;
        } else if (daysLeft <= 0) {
            return <span className="px-3 py-1 bg-error-light text-error font-bold text-sm rounded-full">EXPIRED</span>;
        } else {
            return <span className="px-3 py-1 bg-info-light text-info font-bold text-sm rounded-full">ACTIVE</span>;
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product listing?')) {
            return;
        }

        try {
            await productService.deleteProduct(productId);
            setProducts(currentProducts => currentProducts.filter(p => p.id !== productId));
            toast.success('Product listing deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product listing');
        }
    };

    const getPayoutStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'text-success';
            case 'Processing':
                return 'text-harvest-gold';
            case 'Pending':
                return 'text-info';
            case 'Failed':
                return 'text-error';
            default:
                return 'text-stone';
        }
    };

    const getPayoutStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'ph-check-circle';
            case 'Processing':
                return 'ph-clock';
            case 'Pending':
                return 'ph-hourglass';
            case 'Failed':
                return 'ph-x-circle';
            default:
                return 'ph-circle';
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
                        {products.map(product => {
                            const totalSpots = (product.spotsLeft || 0) + Math.floor(Math.random() * 8) + 2; // Mock filled spots
                            const filledSpots = totalSpots - (product.spotsLeft || 0);
                            
                            return (
                                <div key={product.id} className="bg-white rounded-xl p-md border border-stone/10 shadow-sm flex flex-col sm:flex-row items-start gap-md">
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.title} 
                                        className="w-full sm:w-32 h-32 sm:h-auto object-cover rounded-lg" 
                                    />
                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-lora">{product.title}</h3>
                                        <p className="font-semibold text-stone">Price: ${product.price} / {product.weight}</p>
                                        <p className="text-sm text-charcoal/80 mt-1 line-clamp-2">{product.description}</p>
                                        <div className="flex justify-between items-center text-sm font-semibold mt-3">
                                            <span className="text-success">
                                                {filledSpots} / {totalSpots} spots filled
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
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="h-10 px-4 bg-error/10 text-error font-semibold rounded-lg hover:bg-error/20 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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
                
                {/* Earnings Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
                    <div className="bg-white p-lg rounded-xl border border-stone/10 shadow-sm text-center">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-md">
                            <i className="ph-bold ph-wallet text-success text-3xl"></i>
                        </div>
                        <p className="text-stone font-semibold">Total Earnings</p>
                        <p className="text-3xl font-lora text-evergreen">${earnings.total.toFixed(2)}</p>
                        <p className="text-sm text-success mt-1">All time</p>
                    </div>
                    <div className="bg-white p-lg rounded-xl border border-stone/10 shadow-sm text-center">
                        <div className="w-16 h-16 bg-harvest-gold/10 rounded-full flex items-center justify-center mx-auto mb-md">
                            <i className="ph-bold ph-clock text-harvest-gold text-3xl"></i>
                        </div>
                        <p className="text-stone font-semibold">Pending Payouts</p>
                        <p className="text-3xl font-lora text-evergreen">${earnings.pending.toFixed(2)}</p>
                        <p className="text-sm text-harvest-gold mt-1">Processing</p>
                    </div>
                    <div className="bg-white p-lg rounded-xl border border-stone/10 shadow-sm text-center">
                        <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-md">
                            <i className="ph-bold ph-star text-info text-3xl"></i>
                        </div>
                        <p className="text-stone font-semibold">Average Rating</p>
                        <p className="text-3xl font-lora text-evergreen">
                            {ratingStats.average > 0 ? `${ratingStats.average}⭐` : 'No ratings'}
                        </p>
                        <p className="text-sm text-info mt-1">{ratingStats.count} reviews</p>
                    </div>
                </div>

                {/* Payout History */}
                <div className="bg-white rounded-xl border border-stone/10 shadow-sm mb-lg">
                    <div className="p-lg border-b border-stone/10">
                        <h3 className="text-2xl font-lora text-evergreen">Payout History</h3>
                        <p className="text-charcoal/80">Track your earnings and payout status</p>
                    </div>
                    
                    {farmerPayouts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-parchment border-b border-stone/10">
                                    <tr>
                                        <th className="text-left p-md font-semibold text-charcoal">Product</th>
                                        <th className="text-left p-md font-semibold text-charcoal">Order ID</th>
                                        <th className="text-left p-md font-semibold text-charcoal">Amount</th>
                                        <th className="text-left p-md font-semibold text-charcoal">Status</th>
                                        <th className="text-left p-md font-semibold text-charcoal">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone/10">
                                    {farmerPayouts.map(payout => (
                                        <tr key={payout.payoutId} className="hover:bg-parchment/50 transition-colors">
                                            <td className="p-md">
                                                <p className="font-semibold text-charcoal">{payout.productName}</p>
                                            </td>
                                            <td className="p-md">
                                                <p className="text-charcoal font-mono text-sm">{payout.orderId}</p>
                                            </td>
                                            <td className="p-md">
                                                <p className="font-semibold text-evergreen">${payout.amount.toFixed(2)}</p>
                                            </td>
                                            <td className="p-md">
                                                <div className="flex items-center gap-2">
                                                    <i className={`ph-bold ${getPayoutStatusIcon(payout.status)} ${getPayoutStatusColor(payout.status)}`}></i>
                                                    <span className={`font-semibold ${getPayoutStatusColor(payout.status)}`}>
                                                        {payout.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-md">
                                                <p className="text-charcoal">
                                                    {new Date(payout.dateInitiated).toLocaleDateString()}
                                                </p>
                                                {payout.dateCompleted && (
                                                    <p className="text-sm text-stone">
                                                        Completed: {new Date(payout.dateCompleted).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-xl text-center">
                            <i className="ph-bold ph-wallet text-stone text-6xl mb-md"></i>
                            <h3 className="text-xl font-semibold text-charcoal mb-2">No Payouts Yet</h3>
                            <p className="text-charcoal/80">
                                Payouts will appear here when customers complete orders from your listings.
                            </p>
                        </div>
                    )}
                </div>

                {/* Customer Reviews */}
                <div className="bg-white rounded-xl border border-stone/10 shadow-sm">
                    <div className="p-lg border-b border-stone/10">
                        <h3 className="text-2xl font-lora text-evergreen">Customer Reviews</h3>
                        <p className="text-charcoal/80">See what customers are saying about your products</p>
                    </div>
                    
                    {farmerRatings.length > 0 ? (
                        <div className="p-lg space-y-md">
                            {farmerRatings.slice(0, 5).map(rating => (
                                <div key={rating.ratingId} className="border-b border-stone/10 pb-md last:border-b-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-charcoal">{rating.customerName}</span>
                                                {rating.isVerified && (
                                                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
                                                        Verified Purchase
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span
                                                        key={star}
                                                        className={`text-lg ${
                                                            star <= rating.rating ? 'text-harvest-gold' : 'text-stone/30'
                                                        }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                                <span className="text-sm text-stone ml-2">
                                                    {new Date(rating.dateCreated).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-charcoal mb-1">{rating.productName}</p>
                                    {rating.comment && (
                                        <p className="text-charcoal/80">{rating.comment}</p>
                                    )}
                                </div>
                            ))}
                            
                            {farmerRatings.length > 5 && (
                                <div className="text-center pt-md">
                                    <button className="text-evergreen font-semibold hover:text-harvest-gold transition-colors">
                                        View All {farmerRatings.length} Reviews →
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-xl text-center">
                            <i className="ph-bold ph-star text-stone text-6xl mb-md"></i>
                            <h3 className="text-xl font-semibold text-charcoal mb-2">No Reviews Yet</h3>
                            <p className="text-charcoal/80">
                                Customer reviews will appear here after they rate your products.
                            </p>
                        </div>
                    )}
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