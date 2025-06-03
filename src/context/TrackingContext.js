import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const TrackingContext = createContext();

export const STAGES = [
  { name: 'In Warehouse', duration: 0 },
  { name: 'Shipped', duration: 5000 }, 
  { name: 'Arrived in Country', duration: 10000 }, 
  { name: 'At Post Office', duration: 15000 }, 
  { name: 'Delivered', duration: 20000 }, 
];

const trackingReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ORDER":
      console.error("=== TRACKING CONTEXT DEBUG ===");
      console.error("Current state orders:", JSON.stringify(state.orders, null, 2));
      console.error("Incoming orders payload:", JSON.stringify(action.payload, null, 2));
      
      const newOrders = action.payload.map(order => {
        console.error("Processing order in context:", JSON.stringify(order, null, 2));
        console.error("Order products:", JSON.stringify(order.products, null, 2));
        
        const processedOrder = {
          ...order,
          id: order.id || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          status: 'In Warehouse',
          products: order.products.map(product => {
            console.error("Processing product in context:", JSON.stringify(product, null, 2));
            const processedProduct = {
              ...product,
              id: product.id || `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              status: 'In Warehouse',
              image: product.image || 'https://via.placeholder.com/300x200',
              title: product.title || 'Product',
              price: product.price || 0
            };
            console.error("Processed product:", JSON.stringify(processedProduct, null, 2));
            return processedProduct;
          })
        };
        
        console.error("Processed order:", JSON.stringify(processedOrder, null, 2));
        return processedOrder;
      });

      console.error("All processed orders:", JSON.stringify(newOrders, null, 2));
      console.error("Number of orders being added:", newOrders.length);

      const updatedOrders = [...newOrders, ...state.orders];
      console.error("Final orders array:", JSON.stringify(updatedOrders, null, 2));
      console.error("Total number of orders:", updatedOrders.length);
      console.error("=== END TRACKING CONTEXT DEBUG ===");
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return { ...state, orders: updatedOrders };

    case "UPDATE_ORDER_STATUS":
      const ordersWithUpdatedStatus = state.orders.map(order => {
        if (order.id === action.payload.id) {
          const elapsed = Date.now() - order.timestamp;
          const currentStage = STAGES.find(stage => elapsed < stage.duration) || STAGES[STAGES.length - 1];
          
          if (order.status !== currentStage.name) {
            return {
              ...order,
              status: currentStage.name,
              products: order.products.map(product => ({
                ...product,
                status: currentStage.name
              }))
            };
          }
        }
        return order;
      });

      localStorage.setItem('orders', JSON.stringify(ordersWithUpdatedStatus));
      return { ...state, orders: ordersWithUpdatedStatus };

    case "DELETE_ORDER":
      const filteredOrders = state.orders.filter(order => order.id !== action.payload);
      localStorage.setItem('orders', JSON.stringify(filteredOrders));
      return { ...state, orders: filteredOrders };

    case "LOAD_ORDERS":
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        return { ...state, orders: storedOrders };
      } catch (error) {
        console.error('Error loading orders:', error);
        localStorage.removeItem('orders');
        return { ...state, orders: [] };
      }

    default:
      return state;
  }
};

export const TrackingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(trackingReducer, { orders: [] });
  const ordersRef = useRef(state.orders);

  useEffect(() => {
    ordersRef.current = state.orders;
  }, [state.orders]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    dispatch({ type: "LOAD_ORDERS", payload: storedOrders });

    const interval = setInterval(() => {
      ordersRef.current.forEach(order => {
        const elapsed = Date.now() - order.timestamp;
        const currentStage = STAGES.find(stage => elapsed < stage.duration) || STAGES[STAGES.length - 1];
        
        if (order.status !== currentStage.name) {
          dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id: order.id } });
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <TrackingContext.Provider value={{ state, dispatch }}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};