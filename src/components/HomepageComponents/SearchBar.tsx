import React, { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Star, Hash, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import debounce from "lodash/debounce";

// Keep the original search query
const SEARCH_PRODUCTS = gql`
 query SearchProducts($query: String!, $limit: Int) {
  searchProducts(query: $query, limit: $limit) {
    name
    series
    price {
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
      imageSecondLivingRoom
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
      imageSecondLivingRoom
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
      imageSecondLivingRoom
    }
  }
}
`;

interface SearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

// Create a sanitized product type to handle missing fields
interface SafeProduct {
  id: string;
  name: string;
  code: string;
  images: {
    imageMain?: string;
    [key: string]: string | undefined;
  };
  price: {
    mrp: number;
    offerPrice: number;
  };
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile = false, onClose }) => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchTips, setShowSearchTips] = useState(false);
  const [isCodeSearch, setIsCodeSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const NoResultsMessage = ({ title }: { title: string }) => (
    <div className="p-4 text-center text-gray-500">
      <p className="text-sm">No {title} available</p>
    </div>
  );

  // Use skip to prevent automatic fetching of search results
  const { loading: searchLoading, refetch } = useQuery(SEARCH_PRODUCTS, {
    skip: true,
    variables: { query: "", limit: 5 },
    onError: (error) => {
      console.error("Search error:", error);
    }
  });

  const { data: topSuggestionsData, loading: topSuggestionsLoading } = useQuery(GET_TOP_SUGGESTIONS, {
    variables: { limit: 5 },
    onError: (error) => console.error("Top suggestions error:", error)
  });

  const { data: trendingData, loading: trendingLoading } = useQuery(GET_TRENDING_SEARCHES, {
    variables: { limit: 5 },
    onError: (error) => console.error("Trending error:", error)
  });

  // Function to sanitize product data and ensure all required fields are present
  const sanitizeProduct = (rawProduct: any): SafeProduct => {
    // Default values for all required fields
    return {
      id: rawProduct?.id || "",
      name: rawProduct?.name || "Unnamed Product",
      code: rawProduct?.code || "No Code",
      images: {
        imageMain: rawProduct?.images?.imageMain || "",
        imageArtTable: rawProduct?.images?.imageArtTable || "",
        imageWall: rawProduct?.images?.imageWall || "",
        imageBedroom: rawProduct?.images?.imageBedroom || "",
        imageRoom: rawProduct?.images?.imageRoom || "",
        imageLivingRoom: rawProduct?.images?.imageLivingRoom || "",
        imageSecondLivingRoom: rawProduct?.images?.imageSecondLivingRoom || ""
      },
      price: {
        mrp: typeof rawProduct?.price?.mrp === 'number' ? rawProduct.price.mrp : 0,
        offerPrice: typeof rawProduct?.price?.offerPrice === 'number' ? rawProduct.price.offerPrice : 0
      }
    };
  };

  // Check if the input looks like a product code
  const detectProductCodeSearch = (input: string) => {
    return /^\d+$/.test(input) || /ep\s*\d+/i.test(input);
  };

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm || searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        // Detect if this looks like a code search
        const looksLikeCode = detectProductCodeSearch(searchTerm);
        setIsCodeSearch(looksLikeCode);

        // Try to get search results
        const result = await refetch({ 
          query: searchTerm, 
          limit: 5 
        });

        // Make sure we have valid results before updating state
        if (result.data?.searchProducts && Array.isArray(result.data.searchProducts)) {
          // Sanitize all products before storing them
          const safeProducts = result.data.searchProducts.map(sanitizeProduct);
          setSearchResults(safeProducts);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
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
        setShowSearchTips(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleFocus = () => {
    setShowResults(true);
    setShowSearchTips(true);
  };

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleProductClick = (productId: string) => {
    router.push(`/productDescription/${productId}`);
    setShowResults(false);
    setQuery("");
    if (onClose) onClose();
  };

  // Highlight the matching part of the code
  const highlightCodeMatch = (code: string, searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) return code;
    
    // Check if the search term is numeric
    const isNumericSearch = /^\d+$/.test(searchTerm);
    
    if (isNumericSearch) {
      // For numeric searches, try to highlight just the number part
      const regex = new RegExp(`(${searchTerm})`, 'i');
      return code.replace(regex, '<span class="text-green-600 font-medium">$1</span>');
    } else {
      // For text searches, highlight the whole matching part
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      return code.replace(regex, '<span class="text-green-600 font-medium">$1</span>');
    }
  };

  // Use sanitized products in the product card
  const ProductCard = ({ product }: { product: SafeProduct }) => {
    // Create a highlighted version of the code if there's a search query
    const highlightedCode = query.length >= 2 
      ? <span dangerouslySetInnerHTML={{ __html: highlightCodeMatch(product.code, query) }} />
      : product.code;
    
    return (
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
          <div className="flex items-center">
            <Hash className="w-3 h-3 text-gray-400 mr-1" />
            <p className="text-xs text-gray-500">{highlightedCode}</p>
          </div>
          <p className="text-sm font-medium text-green-600">
            ₹{product.price.offerPrice}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </div>
    );
  };

  // Sanitize top suggestions and trending data
  const sanitizedTopSuggestions = topSuggestionsData?.getTopSearchSuggestions 
    ? topSuggestionsData.getTopSearchSuggestions.map(sanitizeProduct) 
    : [];

  const sanitizedTrendingProducts = trendingData?.getTrendingSearches 
    ? trendingData.getTrendingSearches.map(sanitizeProduct) 
    : [];

  const renderSearchContent = () => {
    if (showSearchTips && query.length < 2) {
      return (
        <div className="p-4 text-gray-600 text-sm">
          <h3 className="font-medium mb-2">Search Tips:</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <span>Type a product name to search</span>
            </li>
            <li className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-500" />
              <span>Search by product code like "EP 401" or just "401"</span>
            </li>
          </ul>
        </div>
      );
    }
    
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
            <p>No products found for "{query}"</p>
            <p className="text-xs mt-2">
              Try searching with a product name or code (e.g., "EP 401" or just "401")
            </p>
          </div>
        );
      }

      return (
        <div className="divide-y divide-gray-100">
          {isCodeSearch && (
            <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
              <div className="text-xs text-gray-500 flex items-center">
                <Hash className="w-3 h-3 mr-1 text-gray-400" />
                <span>Searching product codes</span>
              </div>
            </div>
          )}
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
          ) : sanitizedTopSuggestions.length > 0 ? (
            sanitizedTopSuggestions.map((product:any) => (
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
          ) : sanitizedTrendingProducts.length > 0 ? (
            sanitizedTrendingProducts.map((product:any) => (
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
          placeholder="Search by name or product code (e.g., EP 401 or 401)"
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