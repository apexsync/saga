import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProductsByCategory } from '../services/products';
import { fetchReviewsByProduct, addReview } from '../services/reviews';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import CircularHorizontalScroll from '../Components/CircularHorizontalScroll';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const getProductData = async () => {
      setLoading(true);
      try {
        const [productData, reviewsData] = await Promise.all([
          fetchProductById(productId),
          fetchReviewsByProduct(productId)
        ]);

        if (productData) {
          setProduct(productData);
          setReviews(reviewsData);
          // Fetch related products from the same category
          const related = await fetchProductsByCategory(productData.category);
          setRelatedProducts(related.filter(item => item.id !== productData.id).slice(0, 4));
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    getProductData();
    window.scrollTo(0, 0);
  }, [productId, navigate]);

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 1500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const newReview = await addReview({
        productId,
        userName: user?.name || 'Anonymous',
        userEmail: user?.email || '',
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setReviews([newReview, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-zinc-400 text-xl font-Poppins tracking-widest uppercase">Fetching Elegance...</div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20">
      <CircularHorizontalScroll />
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 mb-8 text-zinc-300 text-sm font-medium">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2 text-zinc-500">•</span>
        <Link to={`/${product.category.toLowerCase()}s`} className="hover:text-primary transition-colors">{product.category}</Link>
        <span className="mx-2 text-zinc-500">•</span>
        <span className="text-white drop-shadow-sm">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] gap-12 lg:gap-16 items-start">
          
          {/* Image Gallery Section */}
          <div className="flex flex-col gap-6">
            <div className="relative group">
              <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
                {product.media && product.media.length > 0 && product.media[activeMediaIndex].type === 'video' ? (
                  <div className="w-full h-full bg-black/80 flex items-center justify-center p-8">
                     <iframe 
                        className="w-full aspect-video rounded-xl shadow-2xl"
                        src={product.media[activeMediaIndex].url.replace('watch?v=', 'embed/')} 
                        title="Product Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                     ></iframe>
                  </div>
                ) : (
                  <img 
                    src={product.media && product.media.length > 0 ? product.media[activeMediaIndex].url : product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                )}
              </div>
              {/* Aesthetic decorative element */}
              <div className="absolute -bottom-6 -right-6 w-40 h-40 border-r-2 border-b-2 border-primary/40 rounded-br-[3rem] -z-10 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 border-l-2 border-t-2 border-primary/40 rounded-tl-[3rem] -z-10 group-hover:scale-110 transition-transform duration-700"></div>
            </div>
            
            {/* Media Thumbnails */}
            {product.media && product.media.length > 0 && (
              <div className="flex flex-wrap gap-4 px-2">
                {[...product.media].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeMediaIndex === idx ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-primary">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ) : (
                      <img src={item.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col space-y-6">
            <div>
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block drop-shadow-md">
                {product.category} COLLECTION
              </span>
              <h1 className="text-white font-Great_Vibes text-4xl md:text-5xl tracking-wider font-medium leading-tight mb-2 drop-shadow-lg">
                {product.name}
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-2 opacity-100 flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-primary"></span>
                    The Story
                </h3>
                <p className="text-zinc-100 text-lg font-Poppins leading-relaxed drop-shadow-sm">
                  {product.description || "A masterfully crafted piece designed to capture the essence of sophistication and grace. Every curve and detail has been meticulously considered to create a harmony between tradition and modern style."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-white/10">
                {product.material && (
                  <div>
                      <h3 className="text-zinc-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Material</h3>
                      <p className="text-white font-medium text-base">{product.material} {product.purity && `(${product.purity})`}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                      <h3 className="text-zinc-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Weight</h3>
                      <p className="text-white font-medium text-base">{product.weight}</p>
                  </div>
                )}
                {product.metalColor && (
                  <div>
                      <h3 className="text-zinc-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Metal Color</h3>
                      <p className="text-white font-medium text-base">{product.metalColor}</p>
                  </div>
                )}
                {product.gemstones && product.gemstones !== 'None' && (
                  <div>
                      <h3 className="text-zinc-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Gemstones</h3>
                      <p className="text-white font-medium text-base">{product.gemstones}</p>
                  </div>
                )}
                {product.sizes && (
                  <div className="col-span-2">
                      <h3 className="text-zinc-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Available Sizes</h3>
                      <p className="text-white font-medium text-base">{product.sizes}</p>
                  </div>
                )}
                <div>
                    <h3 className="text-zinc-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Authenticity</h3>
                    <p className="text-white font-medium text-base">Guaranteed Pure</p>
                </div>
                <div>
                    <h3 className="text-zinc-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Stock</h3>
                    <p className="text-white font-medium text-base">{product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-white border-t border-white/10 p-4 text-2xl font-bold font-Poppins drop-shadow-md mb-1">
                {product.price}
              </p>
              <button 
                onClick={handleAddToCart}
                disabled={adding}
                className={`w-full relative overflow-hidden font-poppins text-white py-6 rounded-2xl font-bold text-xl transition-all duration-700 flex items-center justify-center gap-3 shadow-2xl active:scale-95
                  ${adding 
                    ? 'bg-green-600 text-white' 
                    : 'bg-primary text-black hover:bg-white hover:shadow-[0_20px_40px_rgba(251,112,16,0.4)]'
                  }`}
              >
                {adding ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-7 h-7 animate-bounce">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Added to Bag
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    Add to Bag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 pt-20 border-t border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20">
            
            {/* Left: Summary & Form */}
            <div className="flex flex-col gap-12 sticky top-32 self-start">
              <div>
                <h2 className="text-white text-4xl font-Poppins tracking-widest uppercase mb-4">Reviews</h2>
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-white text-7xl font-light font-Poppins leading-none">
                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0'}
                  </span>
                  <div className="pb-1">
                    <div className="flex text-primary mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 5) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1} className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white/60 text-xs tracking-widest uppercase">{reviews.length} Experiences</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-white/20"></div>

              {/* Form */}
              <div>
                {!isAuthenticated ? (
                  <div className="text-white">
                    <p className="text-white/80 mb-6 font-light">Sign in to share your experience with this piece.</p>
                    <Link to="/signin" className="inline-block border border-white px-8 py-3 text-white hover:bg-white hover:text-black transition-colors text-xs font-bold tracking-widest uppercase">
                      Sign In to Review
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-8">
                    <div>
                      <label className="text-[10px] text-white font-bold tracking-widest uppercase mb-4 block">Select Rating</label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`transition-all duration-300 ${reviewForm.rating >= star ? 'text-primary/90 scale-110' : 'text-white/20 hover:text-white/50'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={reviewForm.rating >= star ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1} className="w-8 h-8">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-white text-[10px] font-bold tracking-widest uppercase mb-4 block">Your Review</label>
                      <textarea
                        required
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Tell us what you loved..."
                        className="w-full bg-transparent border-b border-white/20 pb-4 text-white placeholder:text-white/30 focus:border-white outline-none transition-colors resize-none text-sm font-light min-h-[80px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full bg-white text-black hover:bg-primary hover:text-white py-4 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Reviews List */}
            <div className="flex flex-col gap-12 pt-4">
              {reviews.length === 0 ? (
                <div className="py-4 md:py-12 border border-white/20 text-center">
                  <p className="text-white/60 font-light font-Great_Vibes text-3xl tracking-wide">Be the first to leave a review.</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="group">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h4 className="text-white font-medium tracking-wide uppercase text-sm mb-2">{review.userName}</h4>
                        <div className="flex text-white gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1} className={`w-3.5 h-3.5 ${i >= review.rating && 'text-white/20'}`}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-white/40 text-[10px] tracking-widest uppercase">
                        {review.createdAt instanceof Date ? review.createdAt.toLocaleDateString() : 'Mar 2026'}
                      </span>
                    </div>
                    <p className="text-white/80 font-light text-lg leading-relaxed mb-6 gap-x-2">
                      "{review.comment}"
                    </p>
                    
                    {review.adminReply && (
                      <div className="pl-6 border-l w-full border-white/20 ml-2">
                        <div className="mb-2 text-white text-[9px] font-bold tracking-[0.2em] uppercase">
                            Saga Studio
                        </div>
                        <p className="text-white/60 font-light text-sm italic">
                            "{review.adminReply}"
                        </p>
                      </div>
                    )}
                    <div className="w-full h-px bg-white/10 mt-12 transition-colors duration-500 group-hover:bg-white/40"></div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-white/50">
            <h2 className="text-white font-Great_Vibes text-4xl md:text-6xl text-center mb-16">You May Also Love</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <Link 
                  to={`/product/${item.id}`} 
                  key={item.id}
                  className="group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-900/40 mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-white font-medium group-hover:text-primary transition-colors text-center">{item.name}</h3>
                  <p className="text-white/70 text-sm text-center">{item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
