import React, { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, History, ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import debounce from "lodash/debounce";

const SEARCH_PRODUCTS = gql`
 query SearchProducts($query: String!, $limit: Int) {
  searchProducts(query: $query, limit: $limit) {
    name
    series
    price {
      mrp
      offerPrice
    }
    id
    finish
    fabric
    color
    code
    images {
      imageMain
      imageArtTable
      imageWall
      imageBedroom
      imageRoom
      imageLivingRoom
    }
  }
}
`;

const GET_TOP_SUGGESTIONS = gql`
 query GetTopSearchSuggestions($limit: Int) {
  getTopSearchSuggestions(limit: $limit) {
    id
    name
    code
    color
    fabric
    price {
      mrp
      offerPrice
    }
    series
    finish
    images {
      imageMain
      imageArtTable
      imageWall
      imageBedroom
      imageRoom
      imageLivingRoom
    }
  }
}
`;

const GET_TRENDING_SEARCHES = gql`
 query GetTopSearchSuggestions($limit: Int) {
  getTrendingSearches(limit: $limit) {
    id
    name
    code
    color
    fabric
    price {
      mrp
      offerPrice
    }
    series
    finish
    images {
      imageMain
      imageArtTable
      imageWall
      imageBedroom
      imageRoom
      imageLivingRoom
    }
  }
}
`;

interface SearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile = false, onClose }) => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const NoResultsMessage = ({ title }: { title: string }) => (
    <div className="p-4 text-center text-gray-500">
      <p className="text-sm">No {title} available</p>
    </div>
  );

  const { loading: searchLoading, refetch } = useQuery(SEARCH_PRODUCTS, {
    skip: true,
    variables: { query: "", limit: 5 },
  });

 // Inside the SearchBar component, add these logs:
 const { data: topSuggestionsData, loading: topSuggestionsLoading } = useQuery(GET_TOP_SUGGESTIONS, {
  variables: { limit: 5 },
  onCompleted: (data) => console.log("Top suggestions data:", data),
  onError: (error) => console.error("Top suggestions error:", error)
});

const { data: trendingData, loading: trendingLoading } = useQuery(GET_TRENDING_SEARCHES, {
  variables: { limit: 5 },
  onCompleted: (data) => console.log("Trending data:", data),
  onError: (error) => console.error("Trending error:", error)
});
  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length >= 2) {
        try {
          const { data } = await refetch({ query: searchTerm, limit: 5 });
          if (data?.searchProducts) {
            setSearchResults(data.searchProducts);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    [refetch]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSearchResults([]);
      }
    };
  
    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);
  
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Also update your onFocus handler to show results
  const handleFocus = () => {
    setShowResults(true);
  };

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
    setShowResults(false);
    setQuery("");
    if (onClose) onClose();
  };

  const ProductCard = ({ product }: { product: any }) => (

    <div
      onClick={() => handleProductClick(product.id)}
      className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
    >
      <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
      {product.images?.imageMain ? (
          <Image
          src={product.images.imageMain}
          alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="text-xs text-gray-400 text-center">No image</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </h4>
        <p className="text-xs text-gray-500">{product.code}</p>
        <p className="text-sm font-medium text-green-600">
          ₹{product.price?.offerPrice}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400" />
    </div>
  );

  const renderSearchContent = () => {
    
    if (query.length >= 2) {
      if (searchLoading) {
        return (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (searchResults.length === 0) {
        return (
          <div className="p-8 text-center text-gray-500">
            No products found for "{query}"
          </div>
        );
      }

      return (
        <div className="divide-y divide-gray-100">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      );
    }

    // Show suggestions and trending when no search query
    return (
        <div className="divide-y divide-gray-100">
          {/* Top Suggestions */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm font-medium text-gray-900">Top Suggestions</h3>
            </div>
            {topSuggestionsLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
                ))}
              </div>
            ) : topSuggestionsData?.getTopSearchSuggestions?.length > 0 ? (
              topSuggestionsData.getTopSearchSuggestions.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <NoResultsMessage title="top suggestions" />
            )}
          </div>
      
          {/* Trending Searches */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-900">Trending Now</h3>
            </div>
            {trendingLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
                ))}
              </div>
            ) : trendingData?.getTrendingSearches?.length > 0 ? (
              trendingData.getTrendingSearches.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <NoResultsMessage title="trending searches" />
            )}
          </div>
        </div>
      );
  };

  const searchContent = (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={handleFocus}
          placeholder="Search for Stunning Products..."
          className={`w-full px-4 py-2 pl-10 ${
            isMobile ? "text-gray-800" : "text-black"
          } border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent`}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setShowResults(false);
              setSearchResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-y-auto z-50"
          >
            {renderSearchContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4 z-50"
      >
        <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-4">
          <div className="flex flex-col gap-4">
            {searchContent}
            <button
              onClick={onClose}
              className="w-full py-2 text-center text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return searchContent;
};

export default SearchBar;