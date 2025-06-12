import { Product } from '../types';

export const sampleProducts: Product[] = [
  {
    id: '1',
    farmerId: '1',
    title: 'Heirloom Tomatoes',
    description: "Juicy, sweet, and bursting with the authentic flavor of summer, these heirloom tomatoes are picked fresh this morning from Rodriguez Farms. Grown with sustainable practices and nurtured by three generations of farming wisdom, each tomato tells a story of the land. This vibrant mix of varieties is perfect for creating stunning salads, rich sauces, or simply enjoying with a sprinkle of salt.\n\nBy joining this group buy, you're not just getting incredible tomatoes at a great price; you're directly supporting the Rodriguez family, helping them reduce waste and continue their tradition of responsible farming.",
    weight: '~ 5lb Box',
    price: 18,
    originalPrice: 25,
    imageUrl: 'https://images.unsplash.com/photo-1561138244-64942a482381?q=80&w=800&auto=format&fit=crop',
    gallery: [
        'https://images.unsplash.com/photo-1561138244-64942a482381?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1587403223849-53b8a3424d8b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598512752271-33f913a53233?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1616901844962-4804639912a7?q=80&w=800&auto=format&fit=crop',
    ],
    farmer: {
      name: 'Rodriguez Farms',
      avatar: 'https://i.pravatar.cc/80?img=3',
    },
    host: {
      name: "Jennifer's Porch Pickup",
      avatar: 'https://i.pravatar.cc/80?img=10',
    },
    progress: 70,
    spotsLeft: 3,
    daysLeft: 3,
    members: [
      { id: '1', avatar: 'https://i.pravatar.cc/48?img=1', name: 'Sarah P.' },
      { id: '2', avatar: 'https://i.pravatar.cc/48?img=2', name: 'Mark L.' },
      { id: '3', avatar: 'https://i.pravatar.cc/48?img=4', name: 'Emily J.' },
      { id: '4', avatar: 'https://i.pravatar.cc/48?img=5', name: 'David C.' },
      { id: '5', avatar: 'https://i.pravatar.cc/48?img=6', name: 'Maria R.' },
      { id: '6', avatar: 'https://i.pravatar.cc/48?img=7', name: 'Chris B.' },
      { id: '7', avatar: 'https://i.pravatar.cc/48?img=8', name: 'Jessica W.' },
    ],
  },
  {
    id: '2',
    farmerId: '2',
    title: 'Farm Fresh Eggs',
    description: "Free-range eggs from our happy hens. Rich, golden yolks every time. Our chickens roam freely on pasture, eating bugs, grass, and supplemental organic feed. The result is eggs with vibrant orange yolks, firm whites, and incredible flavor that you simply can't get from store-bought eggs.\n\nThese eggs are collected daily and are never more than 3 days old when you receive them. Perfect for baking, cooking, or enjoying simply scrambled with a touch of butter.",
    weight: '~ 2 Dozen',
    price: 12,
    originalPrice: 16,
    imageUrl: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=800&auto=format&fit=crop',
    gallery: [
        'https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1569288052389-dac9b01ac3b9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582722872445-44dc5f3e3c8f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=800&auto=format&fit=crop',
    ],
    farmer: {
      name: 'Sunrise Farm',
      avatar: 'https://i.pravatar.cc/80?img=5',
    },
    host: {
      name: "Mike's Garage Pickup",
      avatar: 'https://i.pravatar.cc/80?img=15',
    },
    progress: 90,
    spotsLeft: 2,
    daysLeft: 1,
    members: [
      { id: '4', avatar: 'https://i.pravatar.cc/48?img=6', name: 'Lisa M.' },
      { id: '5', avatar: 'https://i.pravatar.cc/48?img=7', name: 'Tom K.' },
      { id: '6', avatar: 'https://i.pravatar.cc/48?img=8', name: 'Anna S.' },
      { id: '7', avatar: 'https://i.pravatar.cc/48?img=9', name: 'Mike D.' },
      { id: '8', avatar: 'https://i.pravatar.cc/48?img=10', name: 'Rachel T.' },
      { id: '9', avatar: 'https://i.pravatar.cc/48?img=11', name: 'James H.' },
      { id: '10', avatar: 'https://i.pravatar.cc/48?img=12', name: 'Sophie L.' },
      { id: '11', avatar: 'https://i.pravatar.cc/48?img=13', name: 'Alex R.' },
      { id: '12', avatar: 'https://i.pravatar.cc/48?img=14', name: 'Nina P.' },
    ],
  },
  {
    id: '3',
    farmerId: '3',
    title: 'Organic Honey',
    description: "Raw, unfiltered honey from our hives. Pure sweetness from nature. Our bees forage on wildflowers, clover, and fruit tree blossoms across our 50-acre farm, creating a complex, floral honey that changes subtly with the seasons.\n\nThis honey is never heated or processed, preserving all the natural enzymes, pollen, and beneficial compounds. You might notice crystallization over time - this is completely natural and a sign of pure, high-quality honey.",
    weight: '~ 16oz Jar',
    price: 22,
    originalPrice: 28,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop',
    gallery: [
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1471943311424-646960669fbc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop',
    ],
    farmer: {
      name: 'Golden Bee Apiary',
      avatar: 'https://i.pravatar.cc/80?img=9',
    },
    host: {
      name: "Sarah's Front Porch",
      avatar: 'https://i.pravatar.cc/80?img=20',
    },
    progress: 45,
    spotsLeft: 8,
    daysLeft: 4,
    members: [
      { id: '7', avatar: 'https://i.pravatar.cc/48?img=10', name: 'Carol W.' },
      { id: '8', avatar: 'https://i.pravatar.cc/48?img=11', name: 'Ben F.' },
      { id: '9', avatar: 'https://i.pravatar.cc/48?img=12', name: 'Grace N.' },
      { id: '10', avatar: 'https://i.pravatar.cc/48?img=13', name: 'Oliver M.' },
      { id: '11', avatar: 'https://i.pravatar.cc/48?img=14', name: 'Zoe K.' },
    ],
  },
  {
    id: '4',
    farmerId: '1',
    title: 'Sweet Rainbow Carrots',
    description: "A colorful bunch of sweet, crisp carrots, straight from the nutrient-rich soil of our farm. These rainbow carrots come in vibrant shades of orange, purple, yellow, and white, each with its own subtle flavor profile. Perfect for roasting, snacking, or adding a vibrant crunch to your favorite dishes.\n\nGrown using the same regenerative practices as all our vegetables, these carrots are packed with flavor and nutrition that comes from healthy, living soil.",
    weight: '~ 2lb Bunch',
    price: 6,
    originalPrice: 9,
    imageUrl: 'https://images.unsplash.com/photo-1582281214303-38b8c5a24933?q=80&w=800&auto=format&fit=crop',
    farmer: {
      name: 'Rodriguez Farms',
      avatar: 'https://i.pravatar.cc/80?img=3',
    },
    host: {
      name: "Jennifer's Porch Pickup",
      avatar: 'https://i.pravatar.cc/80?img=10',
    },
    progress: 40,
    spotsLeft: 6,
    daysLeft: 5,
    members: [
      { id: '12', avatar: 'https://i.pravatar.cc/48?img=12', name: 'Ben S.' },
      { id: '13', avatar: 'https://i.pravatar.cc/48?img=14', name: 'Chloe T.' },
      { id: '14', avatar: 'https://i.pravatar.cc/48?img=15', name: 'Ryan M.' },
      { id: '15', avatar: 'https://i.pravatar.cc/48?img=16', name: 'Kate L.' },
    ],
  }
];

// Add a simple way to find a product by its ID
export const getProductById = (id: string | undefined) => {
    if (!id) return undefined;
    return sampleProducts.find(p => p.id === id);
}

// Add a function to get products by farmer ID
export const getProductsByFarmerId = (farmerId: string | undefined) => {
    if (!farmerId) return [];
    return sampleProducts.filter(p => p.farmerId === farmerId);
}