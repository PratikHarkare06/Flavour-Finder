import React, { useState } from "react";
import { Search, ChefHat, Flame, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecipeSearchProps {
  onSearch: (params: {
    ingredients: string;
    preference: string;
    cuisine: string;
    course: string;
    maxPrepTime: number;
  }) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const RecipeSearch = ({ onSearch, isLoading, error }: RecipeSearchProps) => {
  const [ingredients, setIngredients] = useState("");
  const [preference, setPreference] = useState("sweet");
  const [cuisine, setCuisine] = useState("all");
  const [course, setCourse] = useState("all");
  const [maxPrepTime, setMaxPrepTime] = useState(60);
  const [validationError, setValidationError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!ingredients.trim()) {
      setValidationError("Please enter at least one ingredient");
      return;
    }

    try {
      await onSearch({
        ingredients,
        preference,
        cuisine,
        course,
        maxPrepTime,
      });
    } catch (error) {
      setValidationError("An error occurred while searching for recipes");
    }
  };

  return (
    <div
      className="w-full px-4 md:px-0 max-w-4xl mx-auto"
      style={{
        background: "rgba(25, 25, 25, 0.8)",
        backdropFilter: "blur(10px)",
        borderRadius: "24px",
        boxShadow:
          "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        padding: "36px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative accents */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0) 70%)",
          filter: "blur(40px)",
          opacity: 0.8,
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0) 70%)",
          filter: "blur(40px)",
          opacity: 0.6,
          zIndex: 0,
        }}
      ></div>

      <div className="search-container relative z-10">
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="flex items-center mb-3 relative">
            {/* Animated decorative dots */}
            <span className="absolute -top-6 -left-6 w-3 h-3 bg-recipe-yellow rounded-full animate-dot-bounce"></span>
            <span
              className="absolute -bottom-4 left-1/4 w-2 h-2 bg-recipe-lime rounded-full animate-dot-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="absolute top-1 right-1/4 w-2 h-2 bg-recipe-green rounded-full animate-dot-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
            <span
              className="absolute -bottom-6 -right-8 w-3 h-3 bg-recipe-orange rounded-full animate-dot-bounce"
              style={{ animationDelay: "0.6s" }}
            ></span>

            <ChefHat
              size={30}
              className="text-recipe-orange mr-3 animate-float"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-pitter animate-wiggle">
              Flavor Finder
            </h2>
            <Flame
              size={30}
              className="text-recipe-orange ml-3 animate-float-slow"
            />
          </div>
          <p className="text-center text-white/80 text-sm md:text-base font-pitter-script">
            Discover delicious recipes perfectly matched to your ingredients
          </p>
        </div>

        {(error || validationError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error || validationError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSearch} className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1">
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium text-white/90 mb-2 font-pitter"
              >
                Your Ingredients:
              </label>
              <div className="input-wrapper group relative">
                <Input
                  id="ingredients"
                  placeholder="e.g., Yellow Moong Dal, Whole Wheat Flour..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-recipe-orange focus:ring-recipe-orange font-pitter hover:bg-white/15 transition-colors"
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    height: "48px",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(5px)",
                  }}
                  disabled={isLoading}
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-recipe-yellow transition-colors duration-300"
                  size={18}
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <label
                htmlFor="preference"
                className="block text-sm font-medium text-white/90 mb-2 font-pitter"
              >
                Flavor Profile:
              </label>
              <Select
                value={preference}
                onValueChange={setPreference}
                disabled={isLoading}
              >
                <SelectTrigger
                  className="bg-white/10 border-white/20 text-white focus:border-recipe-orange focus:ring-recipe-orange h-12 font-pitter rounded-xl backdrop-blur-sm"
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <SelectValue placeholder="Sweet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sweet" className="font-pitter">
                    Sweet
                  </SelectItem>
                  <SelectItem value="savory" className="font-pitter">
                    Savory
                  </SelectItem>
                  <SelectItem value="spicy" className="font-pitter">
                    Spicy
                  </SelectItem>
                  <SelectItem value="sour" className="font-pitter">
                    Sour
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-1/3">
              <label
                htmlFor="cuisine"
                className="block text-sm font-medium text-white/90 mb-2 font-pitter"
              >
                Cuisine:
              </label>
              <Select
                value={cuisine}
                onValueChange={setCuisine}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-recipe-orange focus:ring-recipe-orange h-10 font-pitter">
                  <SelectValue placeholder="All Cuisines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-pitter">
                    All Cuisines
                  </SelectItem>
                  <SelectItem value="indian" className="font-pitter">
                    Indian
                  </SelectItem>
                  <SelectItem value="italian" className="font-pitter">
                    Italian
                  </SelectItem>
                  <SelectItem value="chinese" className="font-pitter">
                    Chinese
                  </SelectItem>
                  <SelectItem value="mexican" className="font-pitter">
                    Mexican
                  </SelectItem>
                  <SelectItem value="thai" className="font-pitter">
                    Thai
                  </SelectItem>
                  <SelectItem value="japanese" className="font-pitter">
                    Japanese
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-1/3">
              <label
                htmlFor="course"
                className="block text-sm font-medium text-white/90 mb-2 font-pitter"
              >
                Course:
              </label>
              <Select
                value={course}
                onValueChange={setCourse}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-recipe-orange focus:ring-recipe-orange h-10 font-pitter">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-pitter">
                    All Courses
                  </SelectItem>
                  <SelectItem value="appetizer" className="font-pitter">
                    Appetizer
                  </SelectItem>
                  <SelectItem value="main" className="font-pitter">
                    Main Course
                  </SelectItem>
                  <SelectItem value="dessert" className="font-pitter">
                    Dessert
                  </SelectItem>
                  <SelectItem value="snack" className="font-pitter">
                    Snack
                  </SelectItem>
                  <SelectItem value="beverage" className="font-pitter">
                    Beverage
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-1/3">
              <label
                htmlFor="maxPrepTime"
                className="block text-sm font-medium text-white/90 mb-2 font-pitter"
              >
                Max Prep Time: {maxPrepTime} mins
              </label>
              <Slider
                id="maxPrepTime"
                min={15}
                max={120}
                step={15}
                value={[maxPrepTime]}
                onValueChange={(value) => setMaxPrepTime(value[0])}
                disabled={isLoading}
                className="mt-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              className="w-full md:w-auto text-white h-14 px-8 font-pitter relative overflow-hidden group rounded-xl"
              style={{
                background: "linear-gradient(135deg, #FF9800 0%, #FFC107 100%)",
                boxShadow:
                  "0 10px 20px -5px rgba(255, 152, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                border: "none",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span className="text-base">Searching...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10 text-base px-2">
                    Discover Recipes
                  </span>
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)",
                    }}
                  ></span>
                  <Sparkles
                    size={16}
                    className="ml-2 text-white inline-block animate-pulse absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeSearch;
