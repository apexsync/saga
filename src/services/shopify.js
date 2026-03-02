/**
 * Shopify Service
 * 
 * This file connects to the Shopify Storefront API using the 'shopify-buy' SDK
 * and direct GraphQL queries for customer authentication and management.
 */

import Client from 'shopify-buy';

// Initialize the Shopify Client
// Make sure to set these environment variables in your .env file
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Validation for credentials
if (!domain || !storefrontAccessToken) {
  console.warn("Shopify credentials missing! Please check your .env file.");
}

export const client = Client.buildClient({
  domain: domain || 'mock-shop.myshopify.com',
  storefrontAccessToken: storefrontAccessToken || 'mock-token'
});

// Helper to format price from Shopify's format to app format
const formatPrice = (amount, currencyCode) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to normalize Shopify Product to App Product
const normalizeProduct = (product) => {
  return {
    id: product.id,
    name: product.title,
    handle: product.handle,
    image: product.images[0]?.src || '',
    price: formatPrice(product.variants[0].price.amount, product.variants[0].price.currencyCode),
    category: product.productType,
    description: product.descriptionHtml || product.description,
    variants: product.variants
  };
};

/**
 * Fetch all products
 */
export async function fetchAllProducts() {
  try {
    const products = await client.product.fetchAll();
    return products.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetch all collections
 */
export async function fetchCollections() {
  try {
    const collections = await client.collection.fetchAllWithProducts();
    return collections.map(collection => ({
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      image: collection.image ? { url: collection.image.src, altText: collection.image.altText } : null,
      products: collection.products.map(normalizeProduct)
    }));
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

/**
 * Fetch products by category (Product Type)
 * @param {string} category
 */
export async function fetchProductsByCategory(category) {
  try {
    // Note: Storefront API doesn't have a direct "fetch by product type" 
    // effectively without using a search query or iterating.
    // We will use a query here.
    const query = `product_type:${category}`;
    const products = await client.product.fetchQuery({ query: query });
    return products.map(normalizeProduct);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

/**
 * Fetch a single product by handle
 * @param {string} handle 
 */
export async function fetchProductByHandle(handle) {
  try {
    const product = await client.product.fetchByHandle(handle);
    return product ? normalizeProduct(product) : null;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

/**
 * Search products by query
 * @param {string} query 
 */
export async function searchProducts(query) {
  try {
    const products = await client.product.fetchQuery({ query: `title:*${query}*` });
    return products.map(normalizeProduct);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

/**
 * Fetch trending products
 * (Fetches a specific collection or first 8 products)
 */
export async function fetchTrendingProducts() {
  try {
    // Alternatively, fetch a specific collection by handle 'trending'
    // const collection = await client.collection.fetchByHandle('trending');
    // return collection.products.map(normalizeProduct);
    
    // For now, just return the first few products
    const products = await client.product.fetchAll(8);
    return products.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return [];
  }
}

/**
 * Fetch Festive Edit (Mock/CMS content)
 * Since this is often CMS specific, we might keep it mock or use a specific collection
 */
export async function fetchFestiveEdit() {
   // This is likely CMS content, so we might not have a direct Shopify equivalent 
   // without a Metafield or specific collection.
   // Returning the existing structure for now to keep the UI working.
   return new Promise((resolve) => {
    setTimeout(() => {
        resolve({
            items: [
                { src: '/pl2.jpg', alt: 'Festive Look 1' }, 
                { src: '/pl1.jpg', alt: 'Festive Look 2' }, 
                { src: '/pl1.jpg', alt: 'Festive Look 3' }, 
                { src: '/pl2.jpg', alt: 'Festive Look 4' }  
            ],
            banner: { src: '/stock1.jpg', alt: 'Traditional Coming Soon' } 
        });
    }, 500);
  });
}

// --- Checkout Operations ---

/**
 * Create a checkout
 */
export async function createCheckout() {
  try {
    return await client.checkout.create();
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

/**
 * Add items to checkout
 * @param {string} checkoutId 
 * @param {Array} lineItems 
 */
export async function addLineItems(checkoutId, lineItems) {
  try {
    return await client.checkout.addLineItems(checkoutId, lineItems);
  } catch (error) {
    console.error("Error adding items to checkout:", error);
    throw error;
  }
}

// --- Customer Authentication & Management (Direct GraphQL) ---

const storefrontApiUrl = `https://${domain}/api/2023-10/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const response = await fetch(storefrontApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  
  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
}

/**
 * Create a new customer (Sign Up)
 */
export async function createCustomer(email, password, firstName, lastName = '') {
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
      firstName,
      lastName
    }
  };

  const data = await shopifyFetch(mutation, variables);
  
  if (data.customerCreate.userErrors.length > 0) {
    throw new Error(data.customerCreate.userErrors[0].message);
  }

  return data.customerCreate.customer;
}

/**
 * Log in a customer and get an access token
 */
export async function loginCustomer(email, password) {
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password
    }
  };

  const data = await shopifyFetch(mutation, variables);

  if (data.customerAccessTokenCreate.userErrors.length > 0) {
    throw new Error(data.customerAccessTokenCreate.userErrors[0].message);
  }

  return {
      accessToken: data.customerAccessTokenCreate.customerAccessToken.accessToken,
      expiresAt: data.customerAccessTokenCreate.customerAccessToken.expiresAt,
      customerUser: { // Helper to match prev API
          email: email
      }
  };
}

/**
 * Fetch Customer Profile using Access Token
 */
export async function fetchCustomerProfile(accessToken) {
    // If usage is within Context that stores the token, pass it here.
    // Or we rely on the token being passed.
    // IMPORTANT: The caller usually manages the token (e.g. from cookie/state)
    const storedToken = accessToken || getCookieToken(); // Helper needed if we want implicit
    
    if (!storedToken) return null;

    const query = `
      query customer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          lastName
          email
          phone
          defaultAddress {
            id
            address1
            city
            zip
            country
          }
          addresses(first: 10) {
            edges {
              node {
                id
                address1
                city
                province
                zip
                country
                firstName
                lastName
                phone
              }
            }
          }
          orders(first: 10) {
            edges {
              node {
                id
                orderNumber
                processedAt
                financialStatus
                fulfillmentStatus
                totalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 5) {
                  edges {
                    node {
                      title
                      variant {
                        image {
                          src
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = { customerAccessToken: storedToken };
    const data = await shopifyFetch(query, variables);
    return data.customer;
}

// Helper for cookie token retrieval if needed inside service (optional)
function getCookieToken() {
    const name = 'customerAccessToken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Update Customer Profile
 */
export async function updateCustomerProfile(accessToken, updates) {
    const token = accessToken || getCookieToken();
    if (!token) throw new Error("No access token found");

    const mutation = `
        mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
            customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
                customer {
                    id
                    firstName
                    lastName
                    email
                    phone
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;
    
    const variables = {
        customerAccessToken: token,
        customer: updates
    };
    
    const data = await shopifyFetch(mutation, variables);

    
    if (data.customerUpdate.userErrors.length > 0) {
        throw new Error(data.customerUpdate.userErrors[0].message);
    }
    
    return data.customerUpdate.customer;
}

/**
 * Fetch Customer Orders (extracted from profile query usually, but standalone here)
 */
export async function fetchCustomerOrders(accessToken) {
    const profile = await fetchCustomerProfile(accessToken);
    if (!profile || !profile.orders) return [];
    
    return profile.orders.edges.map(edge => {
        const order = edge.node;
        return {
            id: order.orderNumber,
            date: new Date(order.processedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
            status: order.fulfillmentStatus,
            total: formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode),
            items: order.lineItems.edges.map(item => ({
                name: item.node.title,
                image: item.node.variant?.image?.src || ''
            }))
        };
    });
}
/**
 * Fetch Customer Addresses
 */
export async function fetchCustomerAddresses(accessToken) {
     const profile = await fetchCustomerProfile(accessToken);
     if (!profile || !profile.addresses) return [];

     return profile.addresses.edges.map(edge => {
         const addr = edge.node;
         return {
             id: addr.id,
             type: 'Home', // Logic can be improved
             name: `${addr.firstName} ${addr.lastName}`,
             street: addr.address1,
             city: addr.city,
             state: addr.province,
             zip: addr.zip,
             country: addr.country,
             phone: addr.phone,
             isDefault: profile.defaultAddress?.id === addr.id
         };
     });
}

/**
 * Add Customer Address
 */
export async function addCustomerAddress(accessToken, address) {
    const token = accessToken || getCookieToken();
    // If the first arg is actually the address object (because callees didn't pass token), handle that
    // This is a bit of a hack to support legacy calls if they existed, but better to be strict or smart.
    // Based on previous mocks: addCustomerAddress(address). 
    // So usage was likely: addCustomerAddress(newAddress). 
    // So 'accessToken' might actually be 'address' if called with 1 arg.
    
    let actualToken = token;
    let actualAddress = address;

    if (typeof accessToken === 'object' && !address) {
        actualAddress = accessToken;
        actualToken = getCookieToken();
    }
    
    if (!actualToken) throw new Error("No access token found");

    const mutation = `
        mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
            customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
                customerAddress {
                    id
                    address1
                    city
                    province
                    zip
                    country
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;
    
    const variables = {
        customerAccessToken: actualToken,
        address: {
            address1: actualAddress.street,
            city: actualAddress.city,
            province: actualAddress.state,
            zip: actualAddress.zip,
            country: 'India', // Hardcoded or dynamic
            phone: actualAddress.phone,
            firstName: actualAddress.name.split(' ')[0],
            lastName: actualAddress.name.split(' ')[1] || ''
        }
    };
    
    const data = await shopifyFetch(mutation, variables);
    
    if (data.customerAddressCreate.userErrors.length > 0) {
        throw new Error(data.customerAddressCreate.userErrors[0].message);
    }
    
    return data.customerAddressCreate.customerAddress;
}

/**
 * Update Customer Address
 */
export async function updateCustomerAddress(accessToken, addressId, address) {
    let actualToken = accessToken || getCookieToken();
    let actualId = addressId;
    let actualAddress = address;

    // Handle shift if called as updateCustomerAddress(id, address)
    if (typeof accessToken === 'string' && typeof addressId === 'object') {
         // Check if accessToken looks like an ID (usually numbers or GIDs)
         // But wait, token is also a string.
         // If generic usage was updateCustomerAddress(id, addr), then accessToken captures ID.
         // We need to be careful. 
         // Strategy: if 'address' is undefined, then args are likely (id, address)
         if (!address) {
             actualAddress = addressId;
             actualId = accessToken;
             actualToken = getCookieToken();
         }
    }

    if (!actualToken) throw new Error("No access token found");

    const mutation = `
        mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
            customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
                customerAddress {
                    id
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;
    
     const variables = {
        customerAccessToken: actualToken,
        id: actualId,
        address: {
            address1: actualAddress.street,
            city: actualAddress.city,
            province: actualAddress.state,
            zip: actualAddress.zip,
            country: 'India',
            phone: actualAddress.phone,
            firstName: actualAddress.name.split(' ')[0],
            lastName: actualAddress.name.split(' ')[1] || ''
        }
    };

    const data = await shopifyFetch(mutation, variables);

    if (data.customerAddressUpdate.userErrors.length > 0) {
        throw new Error(data.customerAddressUpdate.userErrors[0].message);
    }

    return data.customerAddressUpdate.customerAddress;
}


/**
 * Delete Customer Address
 */
export async function deleteCustomerAddress(accessToken, addressId) {
    let actualToken = accessToken || getCookieToken();
    let actualId = addressId;

    // Handle shift if called as deleteCustomerAddress(id)
    if (!addressId) {
        actualId = accessToken;
        actualToken = getCookieToken();
    }

    if (!actualToken) throw new Error("No access token found");

    const mutation = `
        mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
            customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
                deletedCustomerAddressId
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    const variables = {
        customerAccessToken: actualToken,
        id: actualId
    };

    const data = await shopifyFetch(mutation, variables);

    if (data.customerAddressDelete.userErrors.length > 0) {
        throw new Error(data.customerAddressDelete.userErrors[0].message);
    }

    return true;
}

// Payment methods are not directly exposed via Storefront API for security.
export async function fetchCustomerPaymentMethods() {
    return []; // Return empty or handle via web checkout url
}

export async function fetchCustomerSettings() {
    return {}; // Logic depends on metafields
}
