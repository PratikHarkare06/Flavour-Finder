import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  UtensilsCrossed,
  ChefHat,
  Leaf,
  Beef,
  Users,
  Timer,
  Flame,
  Scale,
  ChefHat as Chef,
} from "lucide-react";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: {
    name: string;
    description?: string;
    ingredients: string[];
    ingredientsQuantity?: string;
    instructions?: string;
    prepTime?: number;
    cookTime?: number;
    isVegetarian?: boolean;
    flavor: string;
    region: string;
    servings?: number;
    difficulty?: string;
    totalTime?: number;
    nutritionalInfo?: string;
    tips?: string;
  };
}

const RecipeModal = ({ isOpen, onClose, recipe }: RecipeModalProps) => {
  const formatInstructions = (instructions: string = "") => {
    if (!instructions) return [];

    // Split by newlines or numbers followed by dots or parentheses
    const steps = instructions
      .split(/\n|(?=\d+[\.\)])/g)
      .filter((step) => step.trim())
      .map((step) => step.trim())
      // Remove leading numbers and special characters
      .map((step) => step.replace(/^\d+[\.\)]\s*/, ""))
      .filter((step) => step.length > 0);

    return steps.map((step, index) => ({
      number: index + 1,
      text: step.trim(),
    }));
  };

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-black/95 border-recipe-orange/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white font-pitter flex items-center gap-2">
            <ChefHat className="text-recipe-orange" size={24} />
            {recipe.name}
            {recipe.isVegetarian !== undefined && (
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                  recipe.isVegetarian
                    ? "bg-recipe-green/90"
                    : "bg-recipe-red/90"
                } text-white`}
              >
                {recipe.isVegetarian ? <Leaf size={12} /> : <Beef size={12} />}
                <span>{recipe.isVegetarian ? "Veg" : "Non-Veg"}</span>
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-8 text-white/90">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Time Card */}
              <div className="bg-black/50 p-4 rounded-lg border border-recipe-orange/20">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="text-recipe-orange" size={18} />
                  <h4 className="font-pitter text-recipe-yellow">Time</h4>
                </div>
                <div className="space-y-1 text-sm">
                  {recipe.prepTime && (
                    <p className="font-pitter">Prep: {recipe.prepTime} mins</p>
                  )}
                  {recipe.cookTime && (
                    <p className="font-pitter">Cook: {recipe.cookTime} mins</p>
                  )}
                  {totalTime > 0 && (
                    <p className="font-pitter text-recipe-orange">
                      Total: {totalTime} mins
                    </p>
                  )}
                </div>
              </div>

              {/* Cuisine Card */}
              <div className="bg-black/50 p-4 rounded-lg border border-recipe-orange/20">
                <div className="flex items-center gap-2 mb-2">
                  <Chef className="text-recipe-orange" size={18} />
                  <h4 className="font-pitter text-recipe-yellow">Cuisine</h4>
                </div>
                <p className="font-pitter text-sm">{recipe.region}</p>
                <p className="font-pitter text-sm text-recipe-orange">
                  {recipe.flavor} flavor
                </p>
              </div>

              {/* Difficulty Card */}
              <div className="bg-black/50 p-4 rounded-lg border border-recipe-orange/20">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="text-recipe-orange" size={18} />
                  <h4 className="font-pitter text-recipe-yellow">Difficulty</h4>
                </div>
                <p className="font-pitter text-sm">
                  {recipe.difficulty || "Moderate"}
                </p>
                <p className="font-pitter text-sm text-recipe-orange">
                  {recipe.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}
                </p>
              </div>

              {/* Servings Card */}
              <div className="bg-black/50 p-4 rounded-lg border border-recipe-orange/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-recipe-orange" size={18} />
                  <h4 className="font-pitter text-recipe-yellow">Servings</h4>
                </div>
                <p className="font-pitter text-sm">
                  {recipe.servings || "2-4"} servings
                </p>
              </div>
            </div>

            {/* Description */}
            {recipe.description && (
              <div className="bg-black/50 p-6 rounded-lg border border-recipe-orange/20">
                <h3 className="text-lg font-semibold text-recipe-yellow mb-2 font-pitter flex items-center gap-2">
                  <ChefHat size={20} />
                  About This Recipe
                </h3>
                <p className="text-white/80 font-pitter leading-relaxed">
                  {recipe.description}
                </p>
              </div>
            )}

            {/* Ingredients */}
            <div className="bg-black/50 p-6 rounded-lg border border-recipe-orange/20">
              <h3 className="text-lg font-semibold text-recipe-yellow mb-4 font-pitter flex items-center gap-2">
                <Scale size={20} />
                Ingredients
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 font-pitter"
                  >
                    <span className="w-2 h-2 bg-recipe-orange rounded-full"></span>
                    <span className="flex-1">{ingredient}</span>
                    {recipe.ingredientsQuantity && (
                      <span className="text-recipe-orange">
                        {recipe.ingredientsQuantity.split(",")[index]?.trim()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            {recipe.instructions && (
              <div className="bg-black/50 p-6 rounded-lg border border-recipe-orange/20">
                <h3 className="text-lg font-semibold text-recipe-yellow mb-4 font-pitter flex items-center gap-2">
                  <UtensilsCrossed size={20} />
                  Cooking Method
                </h3>
                <ol className="space-y-4">
                  {formatInstructions(recipe.instructions).map((step) => (
                    <li key={step.number} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-recipe-orange/20 flex items-center justify-center text-recipe-orange font-bold font-pitter">
                        {step.number}
                      </span>
                      <div className="flex-1">
                        <p className="text-white/80 font-pitter leading-relaxed">
                          {step.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Tips and Notes */}
            {recipe.tips && (
              <div className="bg-black/50 p-6 rounded-lg border border-recipe-orange/20">
                <h3 className="text-lg font-semibold text-recipe-yellow mb-2 font-pitter flex items-center gap-2">
                  <Sparkles size={20} />
                  Tips & Notes
                </h3>
                <p className="text-white/80 font-pitter">{recipe.tips}</p>
              </div>
            )}

            {/* Nutritional Information */}
            {recipe.nutritionalInfo && (
              <div className="bg-black/50 p-6 rounded-lg border border-recipe-orange/20">
                <h3 className="text-lg font-semibold text-recipe-yellow mb-2 font-pitter">
                  Nutritional Information
                </h3>
                <p className="text-white/80 font-pitter">
                  {recipe.nutritionalInfo}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
