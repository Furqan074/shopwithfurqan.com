import React from "react";
import ProductCard from "./ProductCard.jsx";
import PropTypes from "prop-types";

const ProductRow = React.memo(function ProductRow({ products }) {
  return (
    <div className="product-row">
      {products?.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
});

ProductRow.propTypes = {
  products: PropTypes.array,
};

ProductRow.displayName = "ProductRow";

export default ProductRow;
