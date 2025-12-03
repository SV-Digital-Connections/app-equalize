export interface RecipeDetail {
  label: string;
  content: string;
}

export interface Recipe {
  id: string;
  date: string;
  title: string;
  author: string;
  details?: RecipeDetail[];
  status: 'completed' | 'pending' | 'cancelled';
  pdfFileName?: string;
  expanded?: boolean;
}

export interface RecipeData {
  recipes: Recipe[];
}
