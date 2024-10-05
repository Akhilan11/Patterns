export interface Product {
    _id : string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    quantity: number; 
}
  
// Define a separate interface for new products without _id
export interface NewProduct {
    imageUrl: string;
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number; 
}