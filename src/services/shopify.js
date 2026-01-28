/**
 * Mock Shopify Service
 * 
 * This file acts as a mock for the Shopify Storefront API.
 * In a real application, this would use a library like 'shopify-buy' 
 * or direct GraphQL calls to fetch data from your Shopify store.
 */

// GraphQL Queries for Reference (or use with a real client)
export const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          productType
          images(first: 1) {
            edges {
              node {
                src
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

// Mock Data - mimicking what we might get and normalize from Shopify
const MOCK_COLLECTIONS = [
    { title: 'Rings', handle: 'rings', image: { url: '/ring.jpg' } },
    { title: 'Bangles', handle: 'bangles', image: { url: '/bangles.jpg' } },
    { title: 'Necklaces', handle: 'necklaces', image: { url: '/necklace.jpg' } },
    { title: 'Earrings', handle: 'earrings', image: { url: '/earring.jpg' } },
    { title: 'Bracelets', handle: 'bracelets', image: { url: '/bracelets.jpg' } },
    { title: 'Pendants', handle: 'pendants', image: { url: '/pendant.jpg' } }
];

const MOCK_PRODUCTS = [
  // Rings
  { 
    id: 'gid://shopify/Product/1', 
    title: 'Gold Ring', 
    handle: 'gold-ring',
    productType: 'Ring',
    images: [{ src: '/ring.jpg' }], 
    variants: [{ price: { amount: '25000', currencyCode: 'INR' } }] 
  },
  { 
    id: 'gid://shopify/Product/2', 
    title: 'Diamond Solitaire', 
    handle: 'diamond-solitaire',
    productType: 'Ring',
    images: [{ src: '/ring.jpg' }], 
    variants: [{ price: { amount: '65000', currencyCode: 'INR' } }] 
  },
  { 
    id: 'gid://shopify/Product/3', 
    title: 'Silver Ring', 
    handle: 'silver-ring',
    productType: 'Ring',
    images: [{ src: '/ring.jpg' }], 
    variants: [{ price: { amount: '12000', currencyCode: 'INR' } }] 
  },
  { 
    id: 'gid://shopify/Product/4', 
    title: 'Rose Gold Ring', 
    handle: 'rose-gold-ring',
    productType: 'Ring',
    images: [{ src: '/ring.jpg' }], 
    variants: [{ price: { amount: '30000', currencyCode: 'INR' } }] 
  },
  { 
    id: 'gid://shopify/Product/5', 
    title: 'Antique Ring', 
    handle: 'antique-ring',
    productType: 'Ring',
    images: [{ src: '/ring.jpg' }], 
    variants: [{ price: { amount: '40000', currencyCode: 'INR' } }] 
  },
  { 
    id: 'gid://shopify/Product/6', 
    title: 'Platinum Ring', 
    handle: 'platinum-ring',
    productType: 'Ring',
    images: [{ src: '/ring.jpg' }], 
    variants: [{ price: { amount: '55000', currencyCode: 'INR' } }] 
  },
  // Necklaces
  { 
    id: 'gid://shopify/Product/7', 
    title: 'Gold Necklace', 
    handle: 'gold-necklace',
    productType: 'Necklace',
    images: [{ src: '/necklace.jpg' }], 
    variants: [{ price: { amount: '85000', currencyCode: 'INR' } }] 
  },
  { 
    id: 'gid://shopify/Product/8', 
    title: 'Diamond Necklace', 
    handle: 'diamond-necklace',
    productType: 'Necklace',
    images: [{ src: '/necklace.jpg' }], 
    variants: [{ price: { amount: '125000', currencyCode: 'INR' } }] 
  },
  // Bangles
  { 
    id: 'gid://shopify/Product/9', 
    title: 'Gold Bangle', 
    handle: 'gold-bangle', 
    productType: 'Bangle', 
    images: [{ src: '/bangles.jpg' }], 
    variants: [{ price: { amount: '45000', currencyCode: 'INR' } }] 
  },
  { 
    id: 'gid://shopify/Product/10', 
    title: 'Diamond Bangle', 
    handle: 'diamond-bangle', 
    productType: 'Bangle', 
    images: [{ src: '/bangles.jpg' }], 
    variants: [{ price: { amount: '65000', currencyCode: 'INR' } }] 
  },
  // Earrings
    { 
    id: 'gid://shopify/Product/11', 
    title: 'Gold Earrings', 
    handle: 'gold-earrings', 
    productType: 'Earring', 
    images: [{ src: '/earring.jpg' }], 
    variants: [{ price: { amount: '15000', currencyCode: 'INR' } }] 
  },
  // Bracelets
  { 
    id: 'gid://shopify/Product/12', 
    title: 'Gold Bracelet', 
    handle: 'gold-bracelet', 
    productType: 'Bracelet', 
    images: [{ src: '/bracelets.jpg' }], 
    variants: [{ price: { amount: '45000', currencyCode: 'INR' } }] 
  },
  { 
    id: 'gid://shopify/Product/13', 
    title: 'Diamond Bracelet', 
    handle: 'diamond-bracelet', 
    productType: 'Bracelet', 
    images: [{ src: '/bracelets.jpg' }], 
    variants: [{ price: { amount: '65000', currencyCode: 'INR' } }] 
  },
  // Pendants
  { 
    id: 'gid://shopify/Product/14', 
    title: 'Gold Pendant', 
    handle: 'gold-pendant', 
    productType: 'Pendant', 
    images: [{ src: '/pendant.jpg' }], 
    variants: [{ price: { amount: '15000', currencyCode: 'INR' } }] 
  },
  { 
    id: 'gid://shopify/Product/15', 
    title: 'Diamond Pendant', 
    handle: 'diamond-pendant', 
    productType: 'Pendant', 
    images: [{ src: '/pendant.jpg' }], 
    variants: [{ price: { amount: '35000', currencyCode: 'INR' } }] 
  },
];

// Helper to format price
const formatPrice = (amount, currencyCode) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to normalize Shopify data to our app's internal format
const normalizeProduct = (product) => {
  return {
    id: product.id,
    name: product.title,
    handle: product.handle,
    image: product.images[0]?.src || '',
    price: formatPrice(product.variants[0].price.amount, product.variants[0].price.currencyCode),
    category: product.productType,
  };
};

/**
 * Fetch all products
 */
export async function fetchAllProducts() {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS.map(normalizeProduct));
    }, 800);
  });
}

/**
 * Fetch all collections/categories
 */
export async function fetchCollections() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app: use COLLECTIONS_QUERY
      resolve(MOCK_COLLECTIONS);
    }, 600);
  });
}

/**
 * Fetch Festive Edit Images (Mocking a content query)
 */
export async function fetchFestiveEdit() {
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve({
            items: [
                { src: '/pl2.jpg', alt: 'Festive Look 1' }, // Local image
                { src: '/pl1.jpg', alt: 'Festive Look 2' }, // Local image
                { src: '/pl1.jpg', alt: 'Festive Look 3' }, // Local image
                { src: '/pl2.jpg', alt: 'Festive Look 4' }  // Local image
            ],
            banner: { src: '/stock1.jpg', alt: 'Traditional Coming Soon' } // Local image
        });
    }, 500);
  });
}

/**
 * Fetch products by category (Product Type)
 * @param {string} category 
 */
export async function fetchProductsByCategory(category) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = MOCK_PRODUCTS.filter(p => p.productType.toLowerCase() === category.toLowerCase());
      resolve(filtered.map(normalizeProduct));
    }, 800);
  });
}

/**
 * Fetch a single product by handle
 * @param {string} handle 
 */
export async function fetchProductByHandle(handle) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_PRODUCTS.find(p => p.handle === handle);
      resolve(product ? normalizeProduct(product) : null);
    }, 500);
  });
}

/**
 * Search products by query
 * @param {string} query 
 */
export async function searchProducts(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim();
      if (!lowerQuery) { // Early exit if empty after trim
          resolve([]);
          return;
      }
      const filtered = MOCK_PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.productType.toLowerCase().includes(lowerQuery)
      );
      resolve(filtered.map(normalizeProduct));
    }, 600);
  });
}

/**
 * Fetch trending products
 * Returns a subset of products to be displayed in the trending section
 */
export async function fetchTrendingProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return specific items or just the first few as "trending"
      // In a real app, this might query a specific collection
      resolve(MOCK_PRODUCTS.slice(0, 7).map(normalizeProduct));
    }, 700);
  });
}

/**
 * Create a checkout
 */
export async function createCheckout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'gid://shopify/Checkout/mock-checkout-id',
        webUrl: 'https://mock-shop.myshopify.com/checkouts/mock-checkout-id',
        lineItems: []
      });
    }, 500);
  });
}

/**
 * Add items to checkout
 * @param {string} checkoutId 
 * @param {Array} lineItems 
 */
export async function addLineItems(checkoutId, lineItems) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return updated checkout object
      resolve({
        id: checkoutId,
        webUrl: 'https://mock-shop.myshopify.com/checkouts/mock-checkout-id',
        lineItems: lineItems // In real app, this would be the actual line items from Shopify
      });
    }, 500);
  });
}

// Placeholder for real Shopify Client initialization
// import Client from 'shopify-buy';
// export const client = Client.buildClient({
//   domain: 'your-shop-name.myshopify.com',
//   storefrontAccessToken: 'your-storefront-access-token'
// });

/**
 * Create a new customer (Sign Up)
 * @param {string} email 
 * @param {string} password 
 * @param {string} firstName 
 */
export async function createCustomer(email, password, firstName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate simple validation
      if (email.includes('error')) {
        reject(new Error('Email already exists.'));
      } else {
        // Update MOCK_CUSTOMER
        MOCK_CUSTOMER.firstName = firstName;
        MOCK_CUSTOMER.lastName = ''; 
        MOCK_CUSTOMER.email = email;
        
        saveMockData();

        resolve({
          id: 'gid://shopify/Customer/123',
          email: email,
          firstName: firstName
        });
      }
    }, 1000);
  });
}

/**
 * Log in a customer and get an access token
 * @param {string} email 
 * @param {string} password 
 */
export async function loginCustomer(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate simple validation
      if (password === 'wrong') {
        reject(new Error('Invalid email or password.'));
      } else {
        
        // For the purpose of this mock demo:
        // If the user logs in with an email that is DIFFERENT from the current mock data,
        // we update the mock data to reflect this "new" user session.
        if (MOCK_CUSTOMER.email !== email) {
            MOCK_CUSTOMER.email = email;
            // Optionally clear name if it's a "fresh" login for a different email, 
            // but keeping it simple by just updating email for now or resetting to default "User"
            if (!MOCK_CUSTOMER.firstName) MOCK_CUSTOMER.firstName = "User";
            saveMockData();
        }

        resolve({
          accessToken: 'mock-customer-access-token',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 1 day
          customerUser: {
              name: MOCK_CUSTOMER.firstName + (MOCK_CUSTOMER.lastName ? ' ' + MOCK_CUSTOMER.lastName : ''),
              email: MOCK_CUSTOMER.email
          }
        });
      }
    }, 800);
  });
}

// Mock Customer Data
// Load from local storage or use default
const storedCustomer = localStorage.getItem('mock_customer_data');
const DEFAULT_MOCK_CUSTOMER = {
  id: 'gid://shopify/Customer/1',
  firstName: 'Alwin',
  lastName: 'Tom',
  email: 'alwin.tom@example.com',
  phone: '+91 98765 43210',
  defaultAddress: {
      id: 'gid://shopify/MailingAddress/1',
      address1: '123 Main St, Apartment 4B',
      city: 'Kochi',
      province: 'Kerala',
      zip: '682001',
      country: 'India',
      phone: '+91 98765 43210'
  }
};

const MOCK_CUSTOMER = storedCustomer ? JSON.parse(storedCustomer) : {
  ...DEFAULT_MOCK_CUSTOMER,
  addresses: [
      {
          id: 'gid://shopify/MailingAddress/1',
          address1: '123 Main St, Apartment 4B',
          city: 'Kochi',
          province: 'Kerala',
          zip: '682001',
          country: 'India',
          phone: '+91 98765 43210',
          firstName: 'Alwin',
          lastName: 'Tom'
      },
      {
          id: 'gid://shopify/MailingAddress/2',
          address1: 'Tech Park, Building 3',
          city: 'Trivandrum',
          province: 'Kerala',
          zip: '695001',
          country: 'India',
          phone: '+91 98765 43210',
          firstName: 'Alwin', 
          lastName: 'Tom'
      }
  ],
  orders: [
      {
          id: 'gid://shopify/Order/1',
          orderNumber: '1001',
          processedAt: '2023-10-24T10:00:00Z',
          financialStatus: 'PAID',
          fulfillmentStatus: 'FULFILLED',
          totalPrice: { amount: '4599.00', currencyCode: 'INR' },
          lineItems: [
              { title: 'Gold Plated Necklace', originalTotalPrice: { amount: '4599.00', currencyCode: 'INR' }, variant: { image: { src: '/necklace.jpg' } } }
          ]
      },
      {
          id: 'gid://shopify/Order/2',
          orderNumber: '1002',
          processedAt: '2023-09-10T14:30:00Z',
          financialStatus: 'PAID',
          fulfillmentStatus: 'IN_PROGRESS',
          totalPrice: { amount: '1299.00', currencyCode: 'INR' },
          lineItems: [
              { title: 'Silver Earrings', originalTotalPrice: { amount: '599.00', currencyCode: 'INR' }, variant: { image: { src: '/earring.jpg' } } },
              { title: 'Bracelet', originalTotalPrice: { amount: '700.00', currencyCode: 'INR' }, variant: { image: { src: '/bracelets.jpg' } } }
          ]
      }
  ],
  paymentMethods: [
      {
          id: 'pm_1',
          type: 'CreditCard',
          brand: 'VISA',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 26
      },
      {
          id: 'pm_2',
          type: 'CreditCard',
          brand: 'MasterCard',
          last4: '8888',
          expiryMonth: 9,
          expiryYear: 25
      }
  ],
  settings: {
     marketing: true,
     orderUpdates: true,
     newsletter: false
  }
};

const saveMockData = () => {
    localStorage.setItem('mock_customer_data', JSON.stringify(MOCK_CUSTOMER));
};

/**
* Fetch Customer Profile
*/
export async function fetchCustomerProfile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
         firstName: MOCK_CUSTOMER.firstName,
         lastName: MOCK_CUSTOMER.lastName,
         email: MOCK_CUSTOMER.email,
         phone: MOCK_CUSTOMER.phone,
         imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300' // Placeholder
      });
    }, 600);
  });
}

export async function updateCustomerProfile(updates) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (updates.firstName) MOCK_CUSTOMER.firstName = updates.firstName;
      if (updates.lastName) MOCK_CUSTOMER.lastName = updates.lastName;
      if (updates.email) MOCK_CUSTOMER.email = updates.email;
      if (updates.phone) MOCK_CUSTOMER.phone = updates.phone;
      
      saveMockData();

      resolve({
         firstName: MOCK_CUSTOMER.firstName,
         lastName: MOCK_CUSTOMER.lastName,
         email: MOCK_CUSTOMER.email,
         phone: MOCK_CUSTOMER.phone,
         imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300'
      });
    }, 600);
  });
}

/**
* Fetch Customer Orders
*/
export async function fetchCustomerOrders() {
   return new Promise((resolve) => {
    setTimeout(() => {
      const orders = MOCK_CUSTOMER.orders.map(order => ({
        id: order.orderNumber, // Using number as ID for display
        date: new Date(order.processedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
        status: order.fulfillmentStatus === 'FULFILLED' ? 'Delivered' : 'In Transit', // Mapping status
        total: formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode),
        items: order.lineItems.map(item => ({
            name: item.title,
            image: item.variant?.image?.src || ''
        }))
      }));
      resolve(orders);
    }, 700);
  });
}

/**
* Fetch Customer Addresses
*/
export async function fetchCustomerAddresses() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const addresses = MOCK_CUSTOMER.addresses.map((addr, index) => ({
          id: index + 1,
          type: index === 0 ? 'Home' : 'Work', // Mocking logic for type
          name: `${addr.firstName} ${addr.lastName}`,
          street: addr.address1,
          city: addr.city,
          state: addr.province,
          zip: addr.zip,
          phone: addr.phone,
          isDefault: addr.id === MOCK_CUSTOMER.defaultAddress.id
      }));
      resolve(addresses);
    }, 500);
  });
}

/**
* Fetch Customer Payment Methods
* NOTE: Shopify Storefront API does not expose saved payment methods directly for security.
* This is a mock to simulate stored cards if using a vaulted payment provider integration.
*/
export async function fetchCustomerPaymentMethods() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_CUSTOMER.paymentMethods);
        }, 600);
    });
}

/**
 * Fetch Customer Settings
 * NOTE: Often stored in Customer Metafields in Shopify
 */
export async function fetchCustomerSettings() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_CUSTOMER.settings);
        }, 400);
    });
}

/**
 * Add a new customer address
 * @param {object} address 
 */
export async function addCustomerAddress(address) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAddress = {
          id: `gid://shopify/MailingAddress/${Date.now()}`,
          address1: address.street,
          city: address.city,
          province: address.state,
          zip: address.zip,
          country: 'India',
          phone: address.phone,
          firstName: address.name.split(' ')[0] || 'User',
          lastName: address.name.split(' ')[1] || 'Name'
      };
      
      // In a real app we'd push to MOCK_CUSTOMER here
      // MOCK_CUSTOMER.addresses.push(newAddress);

      resolve({
          ...address,
          id: Date.now(), // Generate a temp ID for frontend 
          type: address.type || 'Other'
      });
    }, 600);
  });
}

/**
 * Delete a customer address
 * @param {string} addressId 
 */
export async function deleteCustomerAddress(addressId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

/**
 * Update a customer address
 * @param {string} addressId 
 * @param {object} updatedAddress 
 */
export async function updateCustomerAddress(addressId, updatedAddress) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would update the address on Shopify
      // For mock, we'll just return the updated address
       resolve({
          ...updatedAddress,
          id: addressId
      });
    }, 600);
  });
}
