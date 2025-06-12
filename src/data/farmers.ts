import { Farmer } from '../types';

export const farmers: Farmer[] = [
    {
        id: '1',
        name: 'Maria Rodriguez',
        farmName: 'Rodriguez Farms',
        location: 'Salinas Valley, CA',
        established: 1958,
        practices: ['Certified Organic', 'Regenerative Agriculture', 'Family-Owned'],
        imageUrl: 'https://i.pravatar.cc/160?img=3',
        bannerUrl: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1600&auto=format&fit=crop',
        quote: "For three generations, my family has worked this land. We don't just sell vegetables; we share a piece of our history in every harvest.",
        story: "Rodriguez Farms began in 1958 when my grandparents, Elena and Mateo, first tilled this soil. They believed in a simple principle: grow food that is honest, healthy, and good for the earth. That philosophy has been passed down through the generations and remains the heart of everything we do today.\n\nWe practice regenerative agriculture, focusing on building healthy soil through crop rotation, cover cropping, and composting. This means no synthetic pesticides or fertilizers—just rich, living soil that produces nutrient-dense, flavorful produce. We believe that caring for the land is our most important duty, ensuring it will continue to provide for our community for generations to come.\n\nWhen you buy from Rodriguez Farms, you're becoming part of our story. You're tasting the sunshine, the rain, and the care that goes into every single plant. Thank you for supporting our family and our commitment to sustainable farming."
    },
    {
        id: '2',
        name: 'Tom Mitchell',
        farmName: 'Sunrise Farm',
        location: 'Petaluma, CA',
        established: 2010,
        practices: ['Pasture-Raised', 'Humane Certified', 'Sustainable'],
        imageUrl: 'https://i.pravatar.cc/160?img=5',
        bannerUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1600&auto=format&fit=crop',
        quote: "Our chickens live the way nature intended - free to roam, scratch, and be chickens. Happy hens lay the best eggs.",
        story: "Sunrise Farm started as a dream to raise animals the right way. After years in corporate agriculture, I knew there had to be a better approach - one that prioritized animal welfare, environmental stewardship, and community connection.\n\nOur chickens spend their days on rotating pastures, eating bugs, grass, and supplemental organic feed. They have access to shelter when they need it, but they're free to express their natural behaviors. This isn't just better for the chickens - it produces eggs with incredible flavor and nutrition that you simply can't get from conventional farming.\n\nEvery morning when I collect the eggs, I'm reminded why we do this work. These aren't just products - they're the result of caring for our animals, our land, and our community."
    },
    {
        id: '3',
        name: 'Sarah Chen',
        farmName: 'Golden Bee Apiary',
        location: 'Sonoma County, CA',
        established: 2015,
        practices: ['Treatment-Free', 'Wildflower Forage', 'Small-Batch'],
        imageUrl: 'https://i.pravatar.cc/160?img=9',
        bannerUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=1600&auto=format&fit=crop',
        quote: "Our bees are our partners, not our products. We work with them to create something truly special.",
        story: "Golden Bee Apiary began when I inherited my grandmother's beehives and discovered the incredible world of beekeeping. What started as a hobby quickly became a passion for sustainable, treatment-free beekeeping that works in harmony with nature.\n\nOur bees forage across 50 acres of wildflowers, fruit trees, and native plants. We never use treatments or medications, instead focusing on strong genetics and natural hive management. This approach produces honey that truly reflects the terroir of our land - complex, floral, and changing with the seasons.\n\nEvery jar of honey tells the story of thousands of bees, millions of flowers, and the delicate balance of our local ecosystem. When you taste our honey, you're experiencing the pure essence of our landscape."
    }
];

export const getFarmerById = (id: string | undefined) => {
    if (!id) return undefined;
    return farmers.find(f => f.id === id);
}