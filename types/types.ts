export interface Pose {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isFavorite: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  count: number;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}
