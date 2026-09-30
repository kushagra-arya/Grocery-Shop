import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FunnelIcon, 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { getProducts, getCategories } from '../store/slices/productSlice';
import { getImageUrl } from '../utils';
import ProductGrid from '../components/product/ProductGrid';
import ProductCard from '../components/product/ProductCard';

// Skeleton loader for filter sidebar
const FilterSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-6 bg-gray-200 rounded w-24"></div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="h-6 bg-gray-200 rounded w-28 mt-6"></div>
    <div className="flex space-x-2">
      <div className="h-10 bg-gray-200 rounded flex-1"></div>
      <div className="h-10 bg-gray-200 rounded flex-1"></div>
    </div>
  </div>
);

// Product list view component
const ProductListItem = ({ product }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < Math.floor(rating) 
        ? <StarSolid key={i} className="h-4 w-4 text-amazon-orange" />
        : <StarIcon key={i} className="h-4 w-4 text-gray-300" />
    ));
  };

  const discount = product.comparePrice 
    ? Math.round((1 - product.price / product.comparePrice) * 100) 
    : 0;

  return (
    <Link 
      to={`/products/${product.slug}`}
      className="flex gap-4 bg-white rounded-lg border hover:shadow-lg transition-all duration-300 p-4 group"
    >
      {/* Image */}
      <div className="w-48 h-48 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={getImageUrl(product.primaryImage, '/placeholder.jpg')}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-amazon-navy-light group-hover:text-amazon-orange transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex">{renderStars(product.avgRating || 0)}</div>
          <span className="text-sm text-amazon-blue hover:text-amazon-orange cursor-pointer">
            {product.reviewCount || 0} ratings
          </span>
        </div>

        {/* Price */}
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.comparePrice?.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-red-600 font-medium">
                  ({discount}% off)
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ₹{(product.price / 10).toFixed(2)}/unit (estimated)
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Stock & Delivery */}
        <div className="mt-3 flex items-center gap-4">
          {product.stockQuantity > 0 ? (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <CheckIcon className="h-4 w-4" />
              In Stock
            </span>
          ) : (
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          )}
          <span className="text-sm text-gray-600">
            Category: {product.category?.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  
  const dispatch = useDispatch();
  const { products, categories, pagination, isLoading } = useSelector((state) => state.products);

  // Get filter values from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const page = parseInt(searchParams.get('page')) || 1;
  const rating = searchParams.get('rating') || '';

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProducts({
      category,
      search,
      minPrice,
      maxPrice,
      sortBy,
      order,
      page,
      limit: 12,
    }));
  }, [dispatch, category, search, minPrice, maxPrice, sortBy, order, page]);



  // Sync price range state with URL
  useEffect(() => {
    setPriceRange({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Only reset page when changing filters (not when changing page itself)
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const updateSort = (newSortBy, newOrder) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', newSortBy);
    newParams.set('order', newOrder);
    newParams.delete('page'); // Reset to first page when sorting changes
    setSearchParams(newParams);
  };

  const applyPriceFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    if (priceRange.min) newParams.set('minPrice', priceRange.min);
    else newParams.delete('minPrice');
    if (priceRange.max) newParams.set('maxPrice', priceRange.max);
    else newParams.delete('maxPrice');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange({ min: '', max: '' });
  };

  const hasFilters = category || minPrice || maxPrice || rating;

  // Calculate price statistics from products
  const priceStats = useMemo(() => {
    if (!products || products.length === 0) return null;
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];
    const { page: currentPage, totalPages } = pagination;
    const pages = [];
    const delta = 2;
    
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    
    // Add first page and ellipsis
    if (pages[0] > 1) {
      if (pages[0] > 2) pages.unshift('...');
      pages.unshift(1);
    }
    
    // Add last page and ellipsis
    if (pages[pages.length - 1] < totalPages) {
      if (pages[pages.length - 1] < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-amazon-blue hover:text-amazon-orange hover:underline">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Products</span>
            {category && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900">
                  {categories?.find(c => c.slug === category)?.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-amazon-navy">
              {search ? `Results for "${search}"` : category 
                ? categories?.find(c => c.slug === category)?.name || 'Products'
                : 'All Products'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {pagination?.total || 0} results
              {search && ` for "${search}"`}
            </p>
          </div>
          
          {/* View & Sort Controls */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {/* View Toggle */}
            <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-amazon-navy-light text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-amazon-navy-light text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-');
                updateSort(newSortBy, newOrder);
              }}
              className="px-4 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange"
            >
              <option value="createdAt-desc">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Active Filters Bar */}
        {hasFilters && (
          <div className="bg-white rounded-lg p-3 mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amazon-navy-light text-white text-sm rounded-full">
                {categories?.find(c => c.slug === category)?.name}
                <button onClick={() => updateFilter('category', '')} className="hover:text-amazon-orange">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amazon-navy-light text-white text-sm rounded-full">
                ₹{minPrice || '0'} - ₹{maxPrice || '∞'}
                <button onClick={() => {
                  updateFilter('minPrice', '');
                  updateFilter('maxPrice', '');
                  setPriceRange({ min: '', max: '' });
                }} className="hover:text-amazon-orange">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            {rating && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amazon-navy-light text-white text-sm rounded-full">
                {rating}+ Stars
                <button onClick={() => updateFilter('rating', '')} className="hover:text-amazon-orange">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline ml-auto"
            >
              Clear all filters
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm sticky top-24">
              {/* Mobile close button */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-bold text-amazon-navy mb-3">Department</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => updateFilter('category', '')}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        !category 
                          ? 'bg-amazon-orange/10 text-amazon-orange font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      All Departments
                    </button>
                    {categories?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateFilter('category', cat.slug)}
                        className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors flex items-center justify-between ${
                          category === cat.slug 
                            ? 'bg-amazon-orange/10 text-amazon-orange font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-gray-400">({cat.productCount || 0})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Rating Filter */}
                <div className="border-t pt-6">
                  <h3 className="font-bold text-amazon-navy mb-3">Customer Review</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => updateFilter('rating', rating === String(stars) ? '' : String(stars))}
                        className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded transition-colors ${
                          rating === String(stars) ? 'bg-amazon-orange/10' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            i < stars 
                              ? <StarSolid key={i} className="h-4 w-4 text-amazon-orange" />
                              : <StarIcon key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                        </div>
                        <span className="text-sm text-amazon-blue">& Up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="border-t pt-6">
                  <h3 className="font-bold text-amazon-navy mb-3">Price</h3>
                  {priceStats && (
                    <p className="text-xs text-gray-500 mb-3">
                      Range: ₹{priceStats.min.toLocaleString()} - ₹{priceStats.max.toLocaleString()}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full pl-6 pr-2 py-2 border rounded text-sm focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full pl-6 pr-2 py-2 border rounded text-sm focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange"
                      />
                    </div>
                  </div>
                  <button
                    onClick={applyPriceFilter}
                    className="mt-3 w-full py-2 bg-gradient-to-b from-amazon-orange to-amazon-orange-dark text-white text-sm font-medium rounded-lg hover:from-amazon-orange-dark hover:to-amazon-orange-dark transition-all"
                  >
                    Apply
                  </button>
                  {/* Quick price ranges */}
                  <div className="mt-3 space-y-1">
                    {[
                      { label: 'Under ₹100', min: '', max: '100' },
                      { label: '₹100 - ₹500', min: '100', max: '500' },
                      { label: '₹500 - ₹1000', min: '500', max: '1000' },
                      { label: 'Over ₹1000', min: '1000', max: '' },
                    ].map((range) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          setPriceRange({ min: range.min, max: range.max });
                          const newParams = new URLSearchParams(searchParams);
                          if (range.min) newParams.set('minPrice', range.min);
                          else newParams.delete('minPrice');
                          if (range.max) newParams.set('maxPrice', range.max);
                          else newParams.delete('maxPrice');
                          newParams.delete('page');
                          setSearchParams(newParams);
                        }}
                        className="block w-full text-left text-sm text-amazon-blue hover:text-amazon-orange hover:underline px-2 py-1"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="border-t pt-6">
                  <h3 className="font-bold text-amazon-navy mb-3">Availability</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-amazon-orange focus:ring-amazon-orange" />
                    <span className="text-sm text-gray-700">Include Out of Stock</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Area */}
          <div className="flex-1 min-w-0">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <span>
                Showing {((page - 1) * 12) + 1}-{Math.min(page * 12, pagination?.total || 0)} of {pagination?.total || 0} results
              </span>
            </div>

            {/* Product Display */}
            {isLoading ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : "space-y-4"
              }>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`bg-white rounded-lg border p-4 animate-pulse ${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                    <div className={`bg-gray-200 rounded-lg ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}`}></div>
                    <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1' : 'mt-4'}`}>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <ProductListItem key={product.id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FunnelIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-amazon-orange text-white rounded-lg hover:bg-amazon-orange-dark transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 mt-8">
                <button
                  onClick={() => updateFilter('page', String(page - 1))}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-1 px-4 py-2 border rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1 mx-2">
                  {getPageNumbers().map((pageNum, i) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => updateFilter('page', String(pageNum))}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pageNum === page
                            ? 'bg-amazon-orange text-white'
                            : 'bg-white border hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>
                
                <button
                  onClick={() => updateFilter('page', String(page + 1))}
                  disabled={!pagination.hasNext}
                  className="flex items-center gap-1 px-4 py-2 border rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
