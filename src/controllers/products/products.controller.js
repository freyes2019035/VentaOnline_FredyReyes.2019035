const productsModel = require("../../models/products.model");
const warnings = require("../../utils/warnings/warnings.message");

exports.createProduct = (req, res) => {
  const product = new productsModel();
  const { name, price, quantity, category} = req.body;
  if (req.user.rol === "ROL_ADMIN") {
    if (name && price && quantity && category) {
      product.name = name;
      product.price = price;
      product.quantity = quantity;
      product.category = category;
      productsModel.find(
        { name: product.name, price: product.price, quantity: product.quantity, category: product.category },
        (err, doc) => {
          if (err) {
            warnings.message_404(res, "products");
          } else if (doc && doc.length >= 1) {
            warnings.message_alreadyExists(res, "product");
          } else {
            product.save((err, document) => {
              if (err) {
                warnings.message_404(res, "product");
              } else if (!document) {
                warnings.message_500(res);
              } else {
                res.status(200).send([{ status: 200 }, { product: document }]);
              }
            });
          }
        }
      );
    } else {
      warnings.message_400(res);
    }
  } else {
    warnings.message_401(res);
  }
};
exports.deleteProduct = (req, res) => {
  if (req.user.rol === "ROL_ADMIN") {
    const id = req.params.id;
    if (id) {
      productsModel.findByIdAndRemove(id, (err, document) => {
        if (err) {
          warnings.message_500(res);
        } else if (!document) {
          warnings.message_404(res, "product");
        } else {
          res.status(200).send([{ status: 200 }, { productRemoved: document }]);
        }
      });
    } else {
      warnings.message_400(res);
    }
  } else {
    warnings.message_401(res);
  }
};
exports.updateProduct = (req, res) => {
  if (req.user.rol === "ROL_ADMIN") {
    const id = req.params.id;
    const body = req.body;
    productsModel.findByIdAndUpdate(id,body,{new: true},(err, doc) => {
        if (err) {
          warnings.message_500(res);
        } else if (!doc) {
          warnings.message_404(res, "product");
        } else {
          res.status(200).send([{ status: 200 }, { productUpdated: doc }]);
        }
      }
    );
  } else {
    warnings.message_401(res);
  }
};
exports.getProducts = (req, res) => {
    if(req.user.rol === "ROL_ADMIN"){
        productsModel.find((err, docs) => {
            if(err){
                warnings.message_500(res)
            }else if(!docs){
                warnings.message_404(res, 'products')
            }else{
              res.status(200).send([{status: 200},{products: docs}])
            }
        })
    }else{
        warnings.message_401(res)
    }
}
exports.getProduct = (req, res) => {
    if(req.user.rol === "ROL_ADMIN"){
        const id = req.params.id;
        console.log(id)
        productsModel.findById(id, (err, document) => {
            if(err){
                warnings.message_500(res);
            }else if(!document){
                warnings.message_404(res,'product')
            }else{
                res.status(200).send([{status: 200}, {product: document}])
            }
        }).populate('category');
    }else{
        warnings.message_401(res);
    }
}