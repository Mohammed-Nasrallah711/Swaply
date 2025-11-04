// mixins/price.js
const usePrice = () => {
  const calculatePriceRating = (merchantPrice, recentPrices, backendRating = null) => {
    // Always prioritize backend rating if available (backend has sophisticated algorithm)
    if (backendRating) {
      return getPriceRatingFromBackend(backendRating);
    }

    // Fallback to frontend calculation only if backend rating is not provided
    // This is a simplified version - backend should always provide rating
    if (!recentPrices || recentPrices.length === 0) {
      return {
        rating: "بلا تقييم",
        message: "بيانات السوق غير متوفرة.",
        style: "text-gray-600 font-normal bg-gray-50 dark:bg-gray-700 dark:text-gray-300",
      };
    }

    // For small samples, use simple comparison
    if (recentPrices.length < 5) {
      const sortedPrices = [...recentPrices].sort((a, b) => a - b);
      const median = sortedPrices[Math.floor(sortedPrices.length / 2)];
      const deviation = Math.abs(merchantPrice - median) / median;

      if (merchantPrice <= median) {
        return deviation <= 0.05 
          ? { rating: "عادل", style: "text-yellow-700 font-normal bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400" }
          : { rating: "جيد", style: "text-green-700 font-normal bg-green-50 dark:bg-green-900/30 dark:text-green-400" };
      } else {
        return deviation <= 0.15
          ? { rating: "جيد", style: "text-green-700 font-normal bg-green-50 dark:bg-green-900/30 dark:text-green-400" }
          : { rating: "مرتفع", style: "text-red-700 font-normal bg-red-50 dark:bg-red-900/30 dark:text-red-400" };
      }
    }

    // For larger samples, use IQR method with robust percentile calculation
    const sortedPrices = [...recentPrices].sort((a, b) => a - b);
    const q1 = calculatePercentile(sortedPrices, 25);
    const medianPrice = calculatePercentile(sortedPrices, 50);
    const q3 = calculatePercentile(sortedPrices, 75);
    const iqr = q3 - q1;

    // Handle zero IQR case (all prices identical)
    let upperBound;
    if (iqr === 0) {
      const mean = sortedPrices.reduce((a, b) => a + b, 0) / sortedPrices.length;
      const variance = sortedPrices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / sortedPrices.length;
      const stdDev = Math.sqrt(variance);
      upperBound = medianPrice + 2 * stdDev;
    } else {
      upperBound = q3 + 1.0 * iqr;
    }

    let rating;
    let style;
    if (merchantPrice <= medianPrice) {
      rating = "عادل";
      style = "text-yellow-700 font-normal bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400";
    } else if (merchantPrice <= upperBound) {
      rating = "جيد";
      style = "text-green-700 font-normal bg-green-50 dark:bg-green-900/30 dark:text-green-400";
    } else {
      rating = "مرتفع";
      style = "text-red-700 font-normal bg-red-50 dark:bg-red-900/30 dark:text-red-400";
    }
    return { rating, message: "", style };
  };

  const getPriceRatingFromBackend = (backendRating) => {
    switch (backendRating) {
      case 'best':
        return {
          rating: "عادل",
          style: "text-yellow-700 font-normal bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400"
        };
      case 'good':
        return {
          rating: "جيد", 
          style: "text-green-700 font-normal bg-green-50 dark:bg-green-900/30 dark:text-green-400"
        };
      case 'high':
        return {
          rating: "مرتفع",
          style: "text-red-700 font-normal bg-red-50 dark:bg-red-900/30 dark:text-red-400"
        };
      case 'no_rating':
      default:
        return {
          rating: "بلا تقييم",
          style: "text-gray-600 font-normal bg-gray-50 dark:bg-gray-900/30 dark:text-gray-400"
        };
    }
  };

  /**
   * Calculate percentile value from sorted array (robust implementation with bounds checking)
   * Matches the backend implementation to prevent index out of bounds errors
   */
  const calculatePercentile = (sortedArray, percentile) => {
    const count = sortedArray.length;
    if (count === 0) {
      return 0;
    }
    
    if (count === 1) {
      return sortedArray[0];
    }

    const index = (percentile / 100) * (count - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    // Ensure indices are within bounds (critical fix)
    const lowerIndex = Math.max(0, Math.min(lower, count - 1));
    const upperIndex = Math.max(0, Math.min(upper, count - 1));
    
    if (lowerIndex === upperIndex) {
      return sortedArray[lowerIndex];
    }
    
    // Linear interpolation
    const weight = index - lowerIndex;
    return sortedArray[lowerIndex] + weight * (sortedArray[upperIndex] - sortedArray[lowerIndex]);
  };

  return { calculatePriceRating, getPriceRatingFromBackend };
};
export default usePrice;
