import { useState, useCallback } from "react";
import RecipeSearch from "@/components/RecipeSearch";
import RecipeCard from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Sparkles, UtensilsCrossed } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { backgroundImageUrl } from "@/assets/backgroundImage";

const Index = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [flashingTitle, setFlashingTitle] = useState<string | null>(null);

  const handleSearch = async (params: {
    ingredients: string;
    preference: string;
    cuisine: string;
    course: string;
    maxPrepTime: number;
  }) => {
    setLoading(true);
    setError("");

    console.log("Search params:", params); // Debug log

    try {
      const response = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: params.ingredients,
          preference: params.preference.toLowerCase(),
          cuisine: params.cuisine,
          course: params.course,
          maxPrepTime: params.maxPrepTime,
        }),
      });

      console.log("Response status:", response.status); // Debug log
      const data = await response.json();
      console.log("API Response data:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recipes");
      }

      if (data.success) {
        const transformedRecipes = data.recipes.map((recipe: any) => {
          // Convert ingredients string to array if needed
          const allIngredients = recipe.all_ingredients || [];
          const matchedIngredients = recipe.matched_ingredients || [];

          return {
            id: Math.random(),
            name: recipe.recipe_name,
            match: recipe.match_score,
            flavor: recipe.flavour,
            ingredients: allIngredients,
            matchedIngredients: {
              exact: matchedIngredients,
              similar: [],
            },
            region: recipe.cuisine,
            prepTime: parseInt(recipe["prep_time (in mins)"]) || 0,
            cookTime: parseInt(recipe["cook_time (in mins)"]) || 0,
            isVegetarian:
              !recipe.ingredients_name.toLowerCase().includes("chicken") &&
              !recipe.ingredients_name.toLowerCase().includes("meat") &&
              !recipe.ingredients_name.toLowerCase().includes("fish") &&
              !recipe.ingredients_name.toLowerCase().includes("prawn") &&
              !recipe.ingredients_name.toLowerCase().includes("egg"),
            imageUrl:
              recipe.image_url || "https://source.unsplash.com/featured/?food",
            description: recipe.description,
            instructions: recipe.instructions,
            ingredientsQuantity: recipe.ingredients_quantity,
          };
        });

        console.log("Transformed recipes:", transformedRecipes); // Debug log
        setFilteredRecipes(transformedRecipes);

        if (transformedRecipes.length > 0) {
          toast({
            title: "Recipes Found!",
            description: `Found ${transformedRecipes.length} delicious recipes matching your preferences.`,
            className:
              "bg-black border border-recipe-orange/50 text-white font-pitter",
          });
        } else {
          setError("No recipes found matching your criteria");
          toast({
            title: "No Recipes Found",
            description: "Try different ingredients or flavor preferences!",
            className:
              "bg-black border border-recipe-orange/50 text-white font-pitter",
          });
        }
      } else {
        setError(data.message || "No recipes found matching your criteria");
        toast({
          title: "No Recipes Found",
          description:
            data.message || "Try different ingredients or flavor preferences!",
          className:
            "bg-black border border-recipe-orange/50 text-white font-pitter",
        });
        setFilteredRecipes([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch recipes";
      setError(errorMessage);
      toast({
        title: "No Recipes Found",
        description:
          "Please try ingredients from our dataset. Common ingredients include: milk, sugar, rice, flour, etc.",
        className:
          "bg-black border border-recipe-orange/50 text-white font-pitter",
      });
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
      setSearchPerformed(true);
    }
  };

  const handleTitleClick = useCallback((titleId: string) => {
    setFlashingTitle(titleId);
    setTimeout(() => setFlashingTitle(null), 600); // Match animation duration
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-black">
      {/* Main background with stylish food-themed gradients */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: `
            radial-gradient(ellipse at top left, rgba(76, 175, 80, 0.12) 0%, rgba(0, 0, 0, 0) 50%),
            radial-gradient(ellipse at bottom right, rgba(255, 152, 0, 0.12) 0%, rgba(0, 0, 0, 0) 50%),
            linear-gradient(135deg, #121212 0%, #1e1e1e 100%)
          `,
          backgroundSize: "cover",
        }}
      />

      {/* Modern dot pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Subtle accent glow */}
      <div
        className="absolute bottom-0 left-0 w-full h-1/3"
        style={{
          background:
            "linear-gradient(0deg, rgba(255, 152, 0, 0.08) 0%, rgba(0, 0, 0, 0) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute top-0 right-0 w-1/3 h-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(76, 175, 80, 0.08) 100%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <section
          className="hero-pattern py-20 px-4"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255, 152, 0, 0.08) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        >
          <RecipeSearch
            onSearch={handleSearch}
            isLoading={loading}
            error={error}
          />
        </section>

        <section
          className="recipe-section flex-1 px-4 pb-16"
          style={{
            background:
              "radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.08) 0%, rgba(0, 0, 0, 0) 60%), radial-gradient(circle at 80% 40%, rgba(255, 152, 0, 0.08) 0%, rgba(0, 0, 0, 0) 60%)",
            boxShadow: "inset 0 8px 16px -8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <ErrorBoundary>
            <div className="max-w-6xl mx-auto">
              {searchPerformed ? (
                <>
                  <div className="flex items-center justify-center mb-10 relative">
                    {loading ? (
                      <div className="text-white flex items-center gap-2">
                        <ChefHat className="animate-spin" size={24} />
                        <span className="font-pitter">
                          Finding your perfect recipes...
                        </span>
                      </div>
                    ) : error ? (
                      <div
                        className="text-center py-12 bg-black/40 rounded-xl border border-white/10 backdrop-blur-sm"
                        style={{
                          boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <p className="text-center text-white text-lg font-pitter">
                          {error}
                        </p>
                        <p className="text-recipe-orange mt-2 font-pitter-script">
                          Try different ingredients or flavor preferences!
                        </p>
                      </div>
                    ) : filteredRecipes.length > 0 ? (
                      <>
                        <div
                          className="absolute top-0 left-1/4 w-full h-full"
                          style={{
                            background:
                              "radial-gradient(circle at center, rgba(255, 152, 0, 0.05) 0%, rgba(0,0,0,0) 70%)",
                            filter: "blur(40px)",
                            transform: "translateY(-40%)",
                            zIndex: -1,
                          }}
                        ></div>
                        <Sparkles
                          className="text-recipe-yellow mr-3 animate-pulse"
                          size={24}
                        />
                        <h2 className="text-3xl font-bold text-white font-pitter animate-float-slow glow-effect-white hover:text-recipe-yellow transition-all duration-300">
                          Your Perfect Recipe Matches
                        </h2>
                        <Sparkles
                          className="text-recipe-yellow ml-3 animate-pulse"
                          size={24}
                        />
                      </>
                    ) : null}
                  </div>

                  {!loading && !error && filteredRecipes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredRecipes.map((recipe, index) => (
                        <div
                          key={recipe.id}
                          className="opacity-0 animate-fade-in"
                          style={{
                            animationDelay: `${index * 0.2}s`,
                            animationFillMode: "forwards",
                          }}
                        >
                          <RecipeCard
                            name={recipe.name}
                            match={recipe.match}
                            flavor={recipe.flavor}
                            ingredients={recipe.ingredients}
                            region={recipe.region}
                            prepTime={recipe.prepTime}
                            cookTime={recipe.cookTime}
                            isVegetarian={recipe.isVegetarian}
                            imageUrl={recipe.imageUrl}
                            description={recipe.description}
                            instructions={recipe.instructions}
                            ingredientsQuantity={recipe.ingredientsQuantity}
                            matchedIngredients={recipe.matchedIngredients}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center max-w-3xl mx-auto mt-8 animate-fade-in">
                  <div className="flex justify-center mb-6">
                    <ChefHat
                      size={60}
                      className="text-recipe-orange animate-wiggle"
                    />
                    <UtensilsCrossed
                      size={40}
                      className="text-recipe-yellow -ml-2 animate-float"
                      style={{ animationDelay: "1s" }}
                    />
                  </div>
                  <h2
                    className={`text-3xl md:text-4xl font-bold text-recipe-yellow mb-6 font-pitter animate-color-shift glow-effect hover:animate-pulse transition-all duration-300 relative z-10 group ${
                      flashingTitle === "welcome" ? "flash" : ""
                    }`}
                    onClick={() => handleTitleClick("welcome")}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-recipe-orange/10 to-transparent group-hover:translate-x-full duration-1000 transform transition-transform"></span>
                    Welcome to Flavor Finder
                  </h2>
                  <p className="text-white/90 text-lg mb-4 font-pitter">
                    Enter your ingredients and flavor preferences above to
                    discover delicious recipes perfectly matched to what you
                    have on hand.
                  </p>
                  <p className="text-white/70 font-pitter-script">
                    Our smart algorithm analyzes your inputs and recommends the
                    best dishes tailored just for you.
                  </p>
                </div>
              )}
            </div>
          </ErrorBoundary>
        </section>
      </div>
    </div>
  );
};

export default Index;
