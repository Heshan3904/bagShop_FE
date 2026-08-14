import api from "../api/api"

//get all product

export const getAllProducts = async () => {
    try {
        const response = await api.get("/products");
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            message: "Failed to fetch products."
        };
    }
};

// Get Product By ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch product.",
      }
    );
  }
};
// Get products by category
export const getProductsByCategory = async (category) => {
  try{
    const response = await api.get(`/products/category/${encodeURIComponent(category)}`);
    return response.data;
  } catch (error){
    throw(
        error.response?.data || {
        success: false,
        message: "Failed to fetch product.",
    }
);
}
};


//add product

export const addProduct = async (productData) => {
    try {
    const response = await api.post("/products", productData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                success: false,
                message: "Failed to add product.",
            }
        );
    }
};

//update product

export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`/products/${id}`, productData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
        } catch (error) {
            throw(
                error.response?.data || {
                    success: false,
                    message: "Failed to update product.",
                }
            );
        }
};

//delete product
export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw(
            error.response?.data || {
                success: false,
                message: "Failed to delete product.",
            }
        );
    }
};

