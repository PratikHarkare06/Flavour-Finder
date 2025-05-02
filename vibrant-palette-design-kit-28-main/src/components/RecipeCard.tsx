import { useState } from "react";
import {
  Utensils,
  MapPin,
  Clock,
  Award,
  Sparkles,
  Leaf,
  Beef,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import RecipeModal from "./RecipeModal";

interface RecipeCardProps {
  name: string;
  match: number;
  flavor: string;
  ingredients: string[];
  region: string;
  prepTime?: number;
  cookTime?: number;
  isVegetarian?: boolean;
  imageUrl?: string;
  description?: string;
  instructions?: string;
  ingredientsQuantity?: string;
  matchedIngredients?: {
    exact: string[];
    similar: [string, string][];
  };
}

const RecipeCard = ({
  name,
  match,
  flavor,
  ingredients,
  region,
  prepTime,
  cookTime,
  isVegetarian,
  imageUrl = "/placeholder-recipe.jpg",
  description,
  instructions,
  ingredientsQuantity,
  matchedIngredients = { exact: [], similar: [] },
}: RecipeCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ensure match is a number and between 0-100
  const normalizedMatch = Math.min(Math.max(Number(match) || 0, 0), 100);

  // Determine color based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return "text-recipe-green";
    if (percentage >= 50) return "text-recipe-yellow";
    return "text-recipe-orange";
  };

  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 70) return "bg-recipe-green text-white";
    if (percentage >= 50) return "bg-recipe-yellow text-black";
    return "bg-recipe-orange text-white";
  };

  return (
    <>
      <div
        className="recipe-card transition-all duration-500 bg-black/60 animate-bounce-in cursor-pointer rounded-2xl overflow-hidden"
        style={{
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05) inset",
          transform: "translateY(0)",
          transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow =
            "0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05) inset";
        }}
      >
        {/* Image container with aspect ratio */}
        <div className="relative overflow-hidden">
          <AspectRatio ratio={16 / 9} className="bg-recipe-dark">
            <img
              src={imageUrl}
              alt={`${name} dish`}
              className="object-cover w-full h-full transition-transform duration-700"
              style={{
                transform: "scale(1.01)",
                transition:
                  "transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            {/* Dish name overlay on the image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-2xl font-bold text-white font-pitter drop-shadow-lg">
                {name}
              </h3>
            </div>
          </AspectRatio>
        </div>

        <div className="p-6 relative backdrop-blur-sm">
          {/* Decorative accent */}
          <div
            className="absolute -top-8 right-10 w-16 h-16 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255, 152, 0, 0.3) 0%, rgba(255, 152, 0, 0) 70%)",
              filter: "blur(10px)",
            }}
          ></div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isVegetarian !== undefined && (
                <span
                  className={`px-3 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 ${
                    isVegetarian ? "bg-recipe-green/90" : "bg-recipe-red/90"
                  } text-white`}
                  style={{
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  {isVegetarian ? (
                    <Leaf size={12} className="animate-float" />
                  ) : (
                    <Beef size={12} className="animate-float" />
                  )}
                  <span>{isVegetarian ? "Veg" : "Non-Veg"}</span>
                </span>
              )}
              <span
                className={cn(
                  "px-3 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1.5 ml-1",
                  getMatchBadgeColor(normalizedMatch)
                )}
                style={{
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                <span>{normalizedMatch}%</span>{" "}
                <Award size={14} className="inline animate-pulse" />
              </span>
            </div>
          </div>

          <div className="space-y-5 mt-5">
            <div>
              <h4 className="text-xs uppercase tracking-wide text-recipe-yellow font-semibold mb-2 font-pitter-script flex items-center">
                <span className="inline-block w-4 h-0.5 bg-recipe-orange/50 mr-2"></span>
                Flavor Profile
              </h4>
              <p className="text-white text-lg capitalize font-pitter">
                {flavor}
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wide text-recipe-yellow font-semibold mb-2 font-pitter-script flex items-center">
                <span className="inline-block w-4 h-0.5 bg-recipe-orange/50 mr-2"></span>
                Matched Ingredients
              </h4>
              <p className="text-recipe-lime text-sm font-pitter">
                {matchedIngredients.exact.join(", ")}
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wide text-recipe-yellow font-semibold mb-2 font-pitter-script flex items-center">
                <span className="inline-block w-4 h-0.5 bg-recipe-orange/50 mr-2"></span>
                All Required Ingredients
              </h4>
              <p className="text-white/90 line-clamp-2 font-pitter">
                {ingredients.join(", ")}
              </p>
            </div>

            <div
              className="flex items-center justify-between pt-3 mt-2 text-white/80 border-t border-white/10"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)",
                backgroundSize: "200% 1px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 top",
              }}
            >
              <div className="flex items-center">
                <MapPin
                  size={16}
                  className="mr-1.5 text-recipe-orange opacity-80"
                />
                <span className="text-sm font-pitter">
                  <span className="text-white/60 mr-1">Region:</span>
                  <span className="text-recipe-orange">{region}</span>
                </span>
              </div>
              {prepTime && (
                <div className="flex items-center">
                  <Clock
                    size={16}
                    className="mr-1.5 text-recipe-yellow opacity-80"
                  />
                  <span className="text-sm font-pitter">{prepTime} mins</span>
                </div>
              )}
              <div className="flex items-center">
                <Utensils
                  size={16}
                  className="text-recipe-orange animate-float mr-1"
                />
                <Sparkles
                  size={14}
                  className="text-recipe-yellow animate-pulse"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={{
          name,
          description,
          ingredients,
          ingredientsQuantity,
          instructions,
          prepTime,
          cookTime,
          isVegetarian,
          flavor,
          region,
        }}
      />
    </>
  );
};

export default RecipeCard;
