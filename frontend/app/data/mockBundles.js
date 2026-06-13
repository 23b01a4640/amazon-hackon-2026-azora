export const bundles = [
  {
    id: "essentials",
    name: "Essentials",
    price: 3500,
    description: "Covers Basics",
    productCount: 3,
    benefits: [
      "Lowest cost",
      "Covers essentials"
    ],
    metrics: {
      budgetMatch: 85,
      coverageScore: 100,
      qualityScore: 78,
      valueScore: 82
    },
    products: [
      {
        id: 1,
        name: "Basic Cotton Bedsheet",
        seller: "Amazon Basics",
        imageUrl: "https://images.unsplash.com/photo-1522771731478-44fb10e99340?q=80&w=200&auto=format&fit=crop",
        price: 399,
        rating: 4.1,
        reviewCount: 3241,
        description: "Soft and breathable cotton bedsheet for everyday use.",
        amazonUrl: "#"
      },
      {
        id: 2,
        name: "Standard Pillow Set",
        seller: "Sleepwell",
        imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=200&auto=format&fit=crop",
        price: 499,
        rating: 4.0,
        reviewCount: 1542,
        description: "Set of 2 standard microfiber pillows.",
        amazonUrl: "#"
      },
      {
        id: 3,
        name: "Compact Desk Lamp",
        seller: "Wipro",
        imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=200&auto=format&fit=crop",
        price: 2602,
        rating: 4.2,
        reviewCount: 892,
        description: "Adjustable desk lamp with warm white light.",
        amazonUrl: "#"
      }
    ]
  },
  {
    id: "best-value",
    name: "Best Value",
    price: 5000,
    recommended: true,
    description: "Best Balance",
    productCount: 3,
    benefits: [
      "Best balance",
      "Highest overall score"
    ],
    metrics: {
      budgetMatch: 96,
      coverageScore: 100,
      qualityScore: 91,
      valueScore: 94
    },
    products: [
      {
        id: 4,
        name: "Premium Cotton Bedsheet",
        seller: "BSB HOME",
        imageUrl: "https://images.unsplash.com/photo-1629949009765-41fb8d655f4e?q=80&w=200&auto=format&fit=crop",
        price: 1249,
        rating: 3.8,
        reviewCount: 1104,
        description: "Comfortable premium cotton bedsheet ideal for daily use.",
        amazonUrl: "#"
      },
      {
        id: 5,
        name: "Memory Foam Pillow",
        seller: "Sleepwell",
        imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=200&auto=format&fit=crop",
        price: 799,
        rating: 4.6,
        reviewCount: 2391,
        description: "Orthopedic memory foam pillow for neck support.",
        amazonUrl: "#"
      },
      {
        id: 6,
        name: "LED Study Lamp",
        seller: "Philips",
        imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=200&auto=format&fit=crop",
        price: 2952,
        rating: 4.8,
        reviewCount: 912,
        description: "Eye-care LED study lamp with 3 brightness levels.",
        amazonUrl: "#"
      }
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 8000,
    description: "Highest Quality",
    productCount: 3,
    benefits: [
      "Highest quality"
    ],
    metrics: {
      budgetMatch: 70,
      coverageScore: 100,
      qualityScore: 98,
      valueScore: 85
    },
    products: [
      {
        id: 7,
        name: "Luxury Egyptian Cotton Bedsheet",
        seller: "Spaces",
        imageUrl: "https://images.unsplash.com/photo-1522771731478-44fb10e99340?q=80&w=200&auto=format&fit=crop",
        price: 2999,
        rating: 4.7,
        reviewCount: 562,
        description: "400 TC Egyptian cotton bedsheet for a luxurious sleep experience.",
        amazonUrl: "#"
      },
      {
        id: 8,
        name: "Cooling Gel Memory Foam Pillow",
        seller: "The Sleep Company",
        imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=200&auto=format&fit=crop",
        price: 1999,
        rating: 4.5,
        reviewCount: 1204,
        description: "Advanced cooling gel technology infused memory foam pillow.",
        amazonUrl: "#"
      },
      {
        id: 9,
        name: "Smart Wi-Fi Designer Lamp",
        seller: "Mi",
        imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=200&auto=format&fit=crop",
        price: 3002,
        rating: 4.6,
        reviewCount: 3412,
        description: "App-controlled smart lamp with 16 million colors.",
        amazonUrl: "#"
      }
    ]
  }
];
