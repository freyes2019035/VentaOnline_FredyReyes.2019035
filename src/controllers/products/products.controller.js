const productsModel = require("../../models/products.model");
const categoryModel = require('../../models/category.model')
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
      product.quantity_sold = 0;
      categoryModel.findById(product.category, (err, categoryFound) => {
        if(err){
          warnings.message_500(res)
        }else if(!categoryFound){
          warnings.message_404(res, 'category with that id')
        }else{
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
        }
      })
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
exports.searchProductByName = async (req, res) => {
  if(req.user.rol === "ROL_CLIENT"){
    const { name } = req.body;
    await productsModel.find({ "name": {$regex: name.toString(), $options: 'i'}}, (err, document) => {
      if(err){
        warnings.message_500(res)
      }else if(document && document.length >= 1){
          res.status(200).send([{status: 'OK, 200'}, {product: document}])
      }else{
        warnings.message_404(res, 'product')
      }
    });
  }else{
    warnings.message_401(res)
  }
}
exports.productsMoreSelled = (req, res) => {
  if(req.user.rol === "ROL_ADMIN" || req.user.rol === "ROL_CLIENT"){
    productsModel.find({}).sort({quantity_sold: -1}).limit(-3).exec((err, moreSelled) => {
      if(err){
        warnings.message_500(res)
      }else if(!moreSelled){
        warnings.message_404(res, 'products')
      }else{
        res.status(200).send(moreSelled)
      }
    })
  }else{

  }
}
exports.soldOutProduct = (req, res) => {
  if(req.user.rol === "ROL_ADMIN"){
    productsModel.find({quantity: 0}, (err, productsFind) => {
      if(err){
        warnings.message_500(res)
      }else if(!productsFind){
        warnings.message_500(res)
      }else{
        res.status(200).send(productsFind)
      }
    });
  }else{
    warnings.message_401(res)
  }
}