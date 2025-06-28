// Service to load and manage placeholder data
export interface PlaceholderProduct {
  productId: string;
  type: 'Standard Listing' | 'Waste-Warrior Listing';
  farmerId: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  moq: number;
  estimatedWeight?: string;
  uiBadge?: string;
}

export interface PlaceholderUser {
  userId: string;
  role: 'Customer' | 'Verified Host' | 'Farmer';
  name: string;
  email: string;
  joinDate: string;
  avatar: string;
  farmName?: string;
  verificationTier?: string;
  businessLicenseVerified?: boolean;
  manualReviewCompleted?: boolean;
  virtualTourCompleted?: boolean;
  averageRating?: number;
  products?: string[];
  successfulGroups?: number;
  totalMembersServed?: number;
  hostRating?: number;
  verificationStatus?: string;
  groupsManaged?: string[];
}

class PlaceholderDataService {
  private products: PlaceholderProduct[] = [];
  private users: PlaceholderUser[] = [];
  private isLoaded = false;

  async loadData() {
    if (this.isLoaded) return;

    try {
      // Load products
      const productsResponse = await fetch('/placeholder-products.json');
      this.products = await productsResponse.json();

      // Load users
      const usersResponse = await fetch('/placeholder-users.json');
      this.users = await usersResponse.json();

      this.isLoaded = true;
      console.log('📦 Placeholder data loaded:', {
        products: this.products.length,
        users: this.users.length
      });
    } catch (error) {
      console.error('Failed to load placeholder data:', error);
      // Fallback to empty arrays
      this.products = [];
      this.users = [];
    }
  }

  async getProducts(): Promise<PlaceholderProduct[]> {
    await this.loadData();
    return this.products;
  }

  async getUsers(): Promise<PlaceholderUser[]> {
    await this.loadData();
    return this.users;
  }

  async getProductsByFarmerId(farmerId: string): Promise<PlaceholderProduct[]> {
    await this.loadData();
    return this.products.filter(product => product.farmerId === farmerId);
  }

  async getUserById(userId: string): Promise<PlaceholderUser | undefined> {
    await this.loadData();
    return this.users.find(user => user.userId === userId);
  }

  async getFarmers(): Promise<PlaceholderUser[]> {
    await this.loadData();
    return this.users.filter(user => user.role === 'Farmer');
  }

  async getHosts(): Promise<PlaceholderUser[]> {
    await this.loadData();
    return this.users.filter(user => user.role === 'Verified Host');
  }

  async getCustomers(): Promise<PlaceholderUser[]> {
    await this.loadData();
    return this.users.filter(user => user.role === 'Customer');
  }

  // Get products with farmer information
  async getProductsWithFarmers(): Promise<Array<PlaceholderProduct & { farmer: PlaceholderUser }>> {
    await this.loadData();
    
    return this.products.map(product => {
      const farmer = this.users.find(user => user.userId === product.farmerId);
      return {
        ...product,
        farmer: farmer || {
          userId: product.farmerId,
          role: 'Farmer' as const,
          name: 'Unknown Farmer',
          email: '',
          joinDate: '',
          avatar: 'https://i.pravatar.cc/80?img=1'
        }
      };
    });
  }

  // Get waste-warrior products (only available to verified farmers)
  async getWasteWarriorProducts(): Promise<PlaceholderProduct[]> {
    await this.loadData();
    return this.products.filter(product => product.type === 'Waste-Warrior Listing');
  }

  // Get standard products
  async getStandardProducts(): Promise<PlaceholderProduct[]> {
    await this.loadData();
    return this.products.filter(product => product.type === 'Standard Listing');
  }
}

// Export a singleton instance
export const placeholderDataService = new PlaceholderDataService();