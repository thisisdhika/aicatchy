export interface GenerationRequest {
  occasion: string;
  vibes: string[];
  expression: string;
  shoppingIntent: string;
}

export interface GeneratedOutfit {
  id: string;
  type: 'Safe' | 'Stylish' | 'Bolder';
  items: any[];
  rationale: string;
  affiliateLinks: string[];
}