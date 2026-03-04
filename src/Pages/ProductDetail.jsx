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
              <h1 className="text-white text-4xl md:text-5xl font-Poppins font-medium leading-tight mb-2 drop-shadow-lg">
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
              <p className="text-primary text-3xl font-bold font-Poppins drop-shadow-md mb-1">
                {product.price}
              </p>
              <button 
                onClick={handleAddToCart}
                disabled={adding}
                className={`w-full relative overflow-hidden py-6 rounded-2xl font-bold text-xl transition-all duration-700 flex items-center justify-center gap-3 shadow-2xl active:scale-95
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
        <div className="mt-32 pt-20 border-t border-white/10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="text-white text-4xl font-Poppins font-medium mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 5) ? 'text-primary' : 'text-zinc-700'}`}>
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <span className="text-zinc-300 text-sm font-medium">({reviews.length} reviews)</span>
              </div>
            </div>
            {!isAuthenticated && (
              <Link to="/signin" className="bg-primary text-black hover:bg-white transition-colors text-sm font-bold border-none px-6 py-2.5 rounded-full shadow-lg">
                Sign in to write a review
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
            {/* Review Form */}
            {isAuthenticated && (
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 mb-12 shadow-2xl">
                <h3 className="text-white text-2xl font-medium mb-6">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="text-white text-xs font-bold tracking-widest uppercase mb-3 block opacity-80">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`p-1 transition-all duration-300 hover:scale-110 ${reviewForm.rating >= star ? 'text-primary' : 'text-zinc-700'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-white text-xs font-bold tracking-widest uppercase mb-3 block opacity-80">Your Experience</label>
                    <textarea
                      required
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Tell us what you loved about this piece..."
                      className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-white placeholder:text-zinc-500 focus:border-primary outline-none transition-all shadow-inner min-h-[140px] text-lg font-Poppins"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-white text-black px-12 py-4 rounded-2xl font-bold hover:bg-primary transition-all duration-300 disabled:opacity-50 shadow-xl active:scale-95"
                  >
                    {isSubmittingReview ? 'Posting...' : 'Post Your Review'}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-10">
              {reviews.length === 0 ? (
                <div className="text-center py-16 bg-black/20 rounded-3xl border border-dashed border-white/10">
                  <p className="text-zinc-300 italic text-lg">No reviews yet. Be the first to share your sparkling experience!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/5 transition-hover hover:border-white/20">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl border border-primary/30">
                            {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-lg">{review.userName}</h4>
                            <div className="flex text-primary mt-1">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1} className="w-4 h-4">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                            ))}
                            </div>
                        </div>
                      </div>
                      <span className="text-zinc-300 text-sm font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {review.createdAt instanceof Date ? review.createdAt.toLocaleDateString() : 'Mar 2026'}
                      </span>
                    </div>
                    <p className="text-white/90 font-Poppins text-lg leading-relaxed pl-16">
                      {review.comment}
                    </p>
                    
                    {review.adminReply && (
                      <div className="mt-6 ml-16 p-6 bg-primary/10 border-l-4 border-primary rounded-r-2xl">
                          <div className="flex items-center gap-3 mb-2">
                              <span className="text-primary font-bold text-xs tracking-widest uppercase">Admin Response</span>
                              <span className="text-zinc-500 text-[10px]">{review.repliedAt?.toDate ? review.repliedAt.toDate().toLocaleDateString() : 'Replied'}</span>
                          </div>
                          <p className="text-zinc-100 font-Poppins leading-relaxed">
                              {review.adminReply}
                          </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-zinc-800/50">
            <h2 className="text-white font-Great_Vibes text-6xl text-center mb-16">You May Also Love</h2>
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
                  <p className="text-zinc-500 text-sm text-center">{item.price}</p>
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
