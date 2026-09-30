import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedProducts, getCategories } from '../store/slices/productSlice';

export default function TestHome() {
  const dispatch = useDispatch();
  const { featuredProducts, categories, isLoading, error } = useSelector((state) => state.products);

  useEffect(() => {
    console.log('📦 TestHome mounted - Dispatching actions...');
    dispatch(getFeaturedProducts()).then(() => console.log('✅ Featured products loaded'));
    dispatch(getCategories()).then(() => console.log('✅ Categories loaded'));
  }, [dispatch]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      color: '#000000',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        🛒 Grocery Shop - Test Page
      </h1>

      {/* Status */}
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ccc'
      }}>
        <p><strong>Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</p>
        <p><strong>Categories Found:</strong> {categories?.length || 0}</p>
        <p><strong>Featured Products Found:</strong> {featuredProducts?.length || 0}</p>
        {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      </div>

      {/* Categories */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
          Categories ({categories?.length || 0})
        </h2>
        {isLoading && <p>⏳ Loading categories...</p>}
        {categories && categories.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {categories.map((cat) => (
              <div key={cat.id} style={{ 
                backgroundColor: '#f9f9f9', 
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>{cat.name}</h3>
                <p style={{ fontSize: '12px', color: '#666' }}>{cat.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999' }}>No categories loaded</p>
        )}
      </div>

      {/* Featured Products */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
          Featured Products ({featuredProducts?.length || 0})
        </h2>
        {isLoading && <p>⏳ Loading products...</p>}
        {featuredProducts && featuredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {featuredProducts.map((product) => (
              <div key={product.id} style={{ 
                backgroundColor: '#f9f9f9', 
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                {product.primaryImage && (
                  <img 
                    src={product.primaryImage} 
                    alt={product.name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                  />
                )}
                <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>{product.name}</h3>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0066c0', marginBottom: '5px' }}>
                  ₹{product.price.toFixed(2)}
                </p>
                {product.comparePrice && (
                  <p style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>
                    ₹{product.comparePrice.toFixed(2)}
                  </p>
                )}
                <p style={{ fontSize: '12px', color: '#666' }}>{product.category?.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999' }}>No featured products loaded</p>
        )}
      </div>
    </div>
  );
}
