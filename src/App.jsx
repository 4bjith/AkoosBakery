import React, { useState } from 'react'
import { Star, MapPin, Phone, Mail, Award, Clock, ShoppingCart, Heart, Croissant, Menu, X } from 'lucide-react'
import './App.css'
import { useNavigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import UserMenu from './components/UserMenu'

// Existing Images
import heroCake from './assets/hero_cake.png'
import snacksBox from './assets/snacks_box.png'
import bakeryVibe from './assets/bakery_vibe.png'
import plumCake from './assets/plum_cake.png'
import bananaChips from './assets/banana_chips.png'
import eggPuffs from './assets/Egg-Puffs.webp'
// import vegPuffs from './assets/Veg-Puff-Recipe.jpg'
import chickenRoll from './assets/chicken-roll.jpg'
import teaCake from './assets/tea-cake.webp'

const PRODUCTS = [
  {
    title: 'Signature Tea Cake',
    desc: 'Soft, buttery sponge cake perfect for evening tea.',
    category: 'Cakes',
    image: teaCake,
    price: '₹150',
    rating: 4.9,
    reviews: 127,
    tag: 'Bestseller',
    tagType: 'bestseller'
  },
  {
    title: 'Rich Plum Cake',
    desc: 'Traditional recipe with rich soaked fruits and spices.',
    category: 'Cakes',
    image: plumCake,
    price: '₹450',
    rating: 4.8,
    reviews: 89,
    tag: 'Classic',
  },
  {
    title: 'Bakery Egg Puffs',
    desc: 'Golden flaky pastry with spicy egg or vegetable filling.',
    category: 'Pastries',
    image: eggPuffs,
    price: '₹25',
    rating: 4.7,
    reviews: 156,
  },
  {
    title: 'Spicy Chicken Roll',
    desc: 'Zesty chicken filling wrapped in soft, breaded pastry.',
    category: 'Pastries',
    image: chickenRoll,
    price: '₹40',
    rating: 4.9,
    reviews: 203,
    tag: 'New',
    tagType: 'new'
  },
  {
    title: 'Kerala Banana Chips',
    desc: 'Crispy, golden snacks made in pure coconut oil.',
    category: 'Snacks',
    image: bananaChips,
    price: '₹60',
    rating: 4.8,
    reviews: 342,
    tag: 'Bestseller',
    tagType: 'bestseller'
  },
  {
    title: 'Crunchy Butter Biscuits',
    desc: 'Classic sweet and savory biscuits made with pure butter.',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    price: '₹80',
    rating: 4.6,
    reviews: 74,
  }
];

const COMMUNITY_FAVORITES = [
  {
    title: 'Classic Vanilla Bean Cupcakes',
    category: 'Cupcakes',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviews: 342,
    price: '₹60',
    tag: '#1 Seller',
    quote: "These cupcakes are absolutely divine! The vanilla flavor is so rich and authentic.",
    author: "- Maria S."
  },
  {
    title: 'Double Chocolate Brownies',
    category: 'Brownies',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviews: 298,
    price: '₹90',
    tag: 'Top Rated',
    quote: "The best brownies in the city! Perfectly fudgy and incredibly rich.",
    author: "- James L."
  },
  {
    title: 'Strawberry Cheesecake Slice',
    category: 'Cheesecake',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    reviews: 156,
    price: '₹150',
    tag: 'Rising Star',
    quote: "Creamy, light, and the strawberry topping is perfection!",
    author: "- Sophie R."
  }
];

function App() {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleGoToDashboard = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard/products');
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredProducts = filter === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="page">
      {/* HEADER */}
      <header className={`site-header ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="logo-area">
          <div className="logo-circle"><Croissant size={22} /></div>
          <div className="logo-text">
            <strong>Akoos Bakery</strong>
          </div>
        </div>
        
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#pastries" onClick={() => setIsMenuOpen(false)}>Pastries</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          <div className="mobile-only-actions">
            <button onClick={handleGoToDashboard} className="btn-primary w-full">Go to Dashboard</button>
          </div>
        </nav>

        <div className="header-actions">
          <div className="contact-info">
            <div className="contact-item"><Phone size={14} /> (+91) 123-4567</div>
            <div className="contact-item"><MapPin size={14} /> Aayyappanthode</div>
          </div>
          <button onClick={handleGoToDashboard} className="btn-primary desktop-only">Go to Dashboard</button>
          <div style={{ marginLeft: '12px' }}>
            <UserMenu />
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow"><Award size={14} /> Since 2017</div>
            <h1>Artisan <span>Perfection</span> at Akoos Bakery</h1>
            <p>Where traditional craftsmanship meets authentic flavors. Every creation is handcrafted with passion, baked fresh daily using the finest ingredients.</p>
            
            <div className="stats-row">
              <div className="stat-item">
                <h3>10+</h3>
                <p>Years Crafting</p>
              </div>
              <div className="stat-item">
                <h3>999+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="stat-item">
                <h3>100+</h3>
                <p>Unique Creations</p>
              </div>
            </div>

            <div className="hero-actions">
              <button onClick={handleGoToDashboard} className="btn-primary">Explore Our Menu</button>
              <button className="btn-secondary">Watch Our Story</button>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)'}}>
              <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Clock size={14} color="var(--primary)"/> Fresh Daily</span>
              <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Star size={14} color="var(--primary)"/> Premium Quality</span>
            </div>
          </div>
          
          <div className="hero-visual">
             <div className="bento-card">
               <img src={heroCake} alt="Signature Chocolate" />
               <h4>Signature Wedding Cake</h4>
               <p>Rich tiered cake layers</p>
               <div className="price">From ₹1,200</div>
             </div>
             <div className="bento-card staggered">
               <img src="https://images.unsplash.com/photo-1557308536-ee471ef2c390?auto=format&fit=crop&q=80&w=400" alt="Wedding Collection" />
               <h4>Dessert Collection</h4>
               <p>Bespoke designs for your day</p>
               <div className="price">From ₹800</div>
             </div>
             <div className="bento-card">
               <img src={snacksBox} alt="Snacks Box" style={{ objectFit: 'contain', background: '#f9f9f9', padding: '10px' }} />
               <h4>Traditional Snacks Box</h4>
               <p>Authentic Kerala treats</p>
               <div className="price">₹250</div>
             </div>
             <div className="review-card staggered">
               <div className="card-meta">
                 <div className="stars"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                 <span>4.9/5</span>
               </div>
               <p>"The most incredible pastries I've ever tasted. Akoos has ruined all other bakeries for me!"</p>
             </div>
          </div>
        </section>

        {/* SIGNATURE MASTERPIECES */}
        <section style={{ backgroundColor: '#faf9f6' }}>
          <div className="section-header">
            <div className="eyebrow" style={{ background: 'transparent', boxShadow: 'none', border: '1px solid var(--border-light)' }}><Award size={14} /> Featured Creations</div>
            <h2>Our Signature<br/><span style={{color: 'var(--primary)'}}>Masterpieces</span></h2>
            <p>Discover our most celebrated cakes, each crafted with exceptional attention to detail and using the finest ingredients. Perfect for life's most special moments.</p>
          </div>

          <div className="masterpiece-card">
            <img src={heroCake} alt="Akoos Crown Cake" className="masterpiece-img" />
            <div className="masterpiece-content">
              <div className="tags">
                <span className="tag">Signature</span>
                <span className="tag" style={{ background: 'transparent' }}><Clock size={12}/> 48 hours preparation</span>
              </div>
              <h3>Akoos Crown Cake</h3>
              <p>A towering celebration of flavors featuring traditional sponge, crafted buttercream, and decorative accents. This is our most requested cake for special occasions.</p>
              
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>What makes it special:</div>
              <div className="features-list">
                <div className="feature-item">Custom message</div>
                <div className="feature-item">Premium packaging</div>
                <div className="feature-item">Decorative design</div>
                <div className="feature-item">Delivery available</div>
              </div>

              <div className="purchase-row">
                <div className="price">₹1,500</div>
                <div style={{display:'flex', gap:'12px'}}>
                  <button className="btn-secondary" style={{padding:'10px'}}><Heart size={18}/></button>
                  <button onClick={handleGoToDashboard} className="btn-primary">Order Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ARTISAN COLLECTION */}
        <section id="pastries">
          <div className="section-header">
            <div className="eyebrow" style={{ background: 'transparent', boxShadow: 'none', border: '1px solid var(--border-light)' }}><Star size={14} /> Handcrafted Excellence</div>
            <h2>Our Collections</h2>
            <p>Discover our carefully curated selection of handcrafted cakes, pastries, and snacks. Each creation is made with premium ingredients and traditional techniques.</p>
          </div>

          <div className="collection-filters">
            {['All', 'Cakes', 'Pastries', 'Snacks'].map(cat => (
              <button 
                key={cat} 
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((prod, i) => (
              <div className="product-card" key={i}>
                <div className="img-wrapper">
                  {prod.tag && <span className={`badge ${prod.tagType || ''}`}>{prod.tag}</span>}
                  <img src={prod.image} alt={prod.title} />
                </div>
                <div className="card-meta">
                  <span className="category">{prod.category}</span>
                  <div className="rating">
                    <Star size={14} fill="#fbbf24" color="#fbbf24" /> {prod.rating} <span className="count">({prod.reviews})</span>
                  </div>
                </div>
                <h3>{prod.title}</h3>
                <p>{prod.desc}</p>
                <div className="card-bottom">
                  <div className="price">{prod.price}</div>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMMUNITY FAVORITES */}
        <section style={{ background: '#faf9f6' }}>
          <div className="section-header">
            <div className="eyebrow" style={{ background: '#dcfce7', color: '#059669', border: 'none' }}>Customer Favorites</div>
            <h2>What Our Community<br/><span style={{color: 'var(--primary)'}}>Loves Most</span></h2>
            <p>Based on thousands of reviews and orders, these are the treats that keep our customers coming back for more. Discover why they're so special.</p>
          </div>

          <div className="community-stats">
            <div className="community-stat">
              <h3>4.8<Star fill="currentColor" size={24} style={{marginLeft: '4px', transform: 'translateY(-2px)'}}/></h3>
              <p>Average Rating</p>
            </div>
            <div className="community-stat">
              <h3>2,500+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="community-stat">
              <h3>15k+</h3>
              <p>Orders Completed</p>
            </div>
            <div className="community-stat">
              <h3>98%</h3>
              <p>Would Recommend</p>
            </div>
          </div>

          <div className="product-grid">
            {COMMUNITY_FAVORITES.map((prod, i) => (
              <div className="product-card" key={i}>
                <div className="img-wrapper">
                  <span className="badge bestseller" style={{ background: prod.tag === 'Rising Star' ? '#10b981' : '#ef4444' }}>{prod.tag}</span>
                  <img src={prod.image} alt={prod.title} />
                </div>
                <div className="card-meta">
                  <span className="category">{prod.category}</span>
                  <div className="rating">
                    <Star size={14} fill="#fbbf24" color="#fbbf24" /> {prod.rating} <span className="count">({prod.reviews})</span>
                  </div>
                </div>
                <h3 style={{ fontSize: '18px' }}>{prod.title}</h3>
                
                <div className="testimonial-box">
                  <p>{prod.quote}</p>
                  <span>{prod.author}</span>
                </div>

                <div className="card-bottom">
                  <div className="price">{prod.price}</div>
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OUR STORY */}
        <section id="about" className="about">
          <div>
            <div className="eyebrow" style={{ background: 'transparent', boxShadow: 'none', border: '1px solid var(--border-light)' }}><Heart size={14} /> Our Story</div>
            <h2>Crafting Sweet Memories at <span>Akoos Bakery</span></h2>
            <p>Since 2008, Akoos Bakery has been the heart of our community's sweetest moments. What began as a passionate pursuit of perfection has evolved into a beloved destination where authentic craftsmanship meets traditional flavors.</p>
            <p style={{marginBottom: '40px'}}>Our master bakers combine time-honored techniques with fresh culinary innovation, creating exceptional pastries, cakes, and snacks that have become the gold standard in our community. Every recipe is a testament to our commitment to quality and our love for the craft.</p>
            
            <div className="about-features">
              <div className="about-feature">
                <div className="feature-icon"><Heart size={20}/></div>
                <h4>Handcrafted with Love</h4>
                <p>Every item is made by hand using traditional techniques passed down through generations</p>
              </div>
              <div className="about-feature">
                <div className="feature-icon"><Award size={20}/></div>
                <h4>Premium Ingredients</h4>
                <p>We source the finest ingredients from trusted local farms and premium suppliers</p>
              </div>
            </div>
          </div>
          <div className="about-visual">
            <img src={bakeryVibe} alt="Bakery Process" className="about-image img-1" />
            <img src="https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?auto=format&fit=crop&q=80&w=400" alt="Baking tools" className="about-image img-2" />
            <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400" alt="Fresh Pastries" className="about-image img-3" />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact">
        <div className="newsletter-section">
          <h2>Stay Sweet with Akoos Bakery</h2>
          <p>Be the first to know about our seasonal specialties, exclusive recipes, and special offers. Join our community of pastry lovers!</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="btn-primary" style={{ background: '#cf9364' }}>Subscribe →</button>
          </div>
        </div>

        <div className="footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo-area" style={{ marginBottom: '20px' }}>
                <div className="logo-circle" style={{ background: 'var(--primary)' }}><Croissant size={22} /></div>
                <div className="logo-text" style={{ color: 'white' }}>
                  <strong style={{ color: 'white' }}>Akoos Bakery</strong>
                  <span style={{ color: '#a39b96' }}>Artisan Bakery</span>
                </div>
              </div>
              <p>Where artisan craftsmanship meets traditional flavors. Creating sweet memories since 2008 with passion, quality, and love for the craft of baking.</p>
              <div className="social-links">
                <a href="#">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.4-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
                <a href="#">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
              </div>
            </div>
            
            <div className="footer-col">
              <h4>Explore</h4>
              <div className="footer-links">
                <a href="#">Home</a>
                <a href="#">Wedding Cakes</a>
                <a href="#">Artisan Pastries</a>
                <a href="#">Our Story</a>
                <a href="#">Contact Us</a>
                <a href="#">Catering Services</a>
              </div>
            </div>

            <div className="footer-col footer-contact">
              <h4>Visit Us</h4>
              <div className="contact-item">
                <MapPin size={18} style={{marginTop: '4px', flexShrink: 0}}/>
                <div>
                  <span>123 Baker Street</span>
                  Sweet Valley, CA 90210
                  <a href="#" style={{ color: 'var(--primary)', display: 'block', marginTop: '4px', fontSize: '13px' }}>Get Directions →</a>
                </div>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <div>
                  <span>(555) 123-4567</span>
                  Call for custom orders
                </div>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <div>
                  <span>hello@akoosbakery.com</span>
                  We'd love to hear from you
                </div>
              </div>
            </div>

            <div className="footer-col footer-hours">
              <h4>Hours</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>
                <Clock size={16} /> Open Daily
              </div>
              <p><span>Monday - Friday</span> <span>6:00 AM - 8:00 PM</span></p>
              <p><span>Saturday</span> <span>7:00 AM - 9:00 PM</span></p>
              <p><span>Sunday</span> <span>8:00 AM - 6:00 PM</span></p>
              <div style={{ background: '#35302d', padding: '16px', borderRadius: '12px', marginTop: '24px' }}>
                <span style={{ display: 'block', color: 'var(--primary)', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Special Holiday Hours</span>
                <span style={{ fontSize: '13px', color: '#a39b96' }}>Extended hours during peak seasons</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2024 Akoos Bakery. Crafted with <Heart size={12} fill="var(--primary)" color="var(--primary)" style={{display:'inline', margin:'0 4px'}}/> in Sweet Valley</div>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

