const categoryModel = require('../../models/category.model');
const productsModel = require('../../models/products.model');
const warnings = require('../../utils/warnings/warnings.message');
exports.createCategory = (req, res) => { 
    const category = new categoryModel();
    const {name, description} = req.body;
    const user = req.user;
    if(user.rol === "ROL_ADMIN"){
        if(name, description){
            category.name = name;
            category.description = description;
            categoryModel.find({name: category.name, description: category.description}, (err, docsFound) => {
                if(err){
                    warnings.message_500(res);
                }else if(!docsFound){
                    warnings.message_404(res, 'category')
                }else if(docsFound && docsFound.length >=1){
                    warnings.message_alreadyExists(res, 'category')
                }else{
                    category.save((err, categorySaved) => {
                        if(err){
                            warnings.message_500(res)
                        }else if(!docsFound){
                            warnings.message_500(res)
                        }else{
                            res.status(200).send([{status: 200}, {categoryCreated: categorySaved}])
                        }
                    })
                }
            });
        }else{
            warnings.message_400(res)
        }
    }else{
        warnings.message_401(res)
    }
}
exports.updateCategory = (req, res) => {
    const categoryId = req.params.categoryId;
    const body = req.body;
    const user = req.user;
    if(user.rol === "ROL_ADMIN"){
        if(body && categoryId){
            categoryModel.findByIdAndUpdate(categoryId, body, {new: true}, (err, categoryUpdated) => {
                if(err){
                    warnings.message_500(res)
                }else if(!categoryUpdated){
                    warnings.message_404(res, 'category')
                }else{
                    res.status(200).send([{status: 200}, {categoryUpdated: categoryUpdated}])
                }
            });
        }else{
            warnings.message_400(res)
        }
    }else{
        warnings.message_401(res);
    }

}
exports.deleteCategory = async (req, res) => {
    const user = req.user;
    if(user.rol === "ROL_ADMIN"){
        const { categoryId } = req.params;
        await categoryModel.find({name: 'default', description: 'Default Category'}, (err, resp) => {
            if(resp && resp.length >= 1){
                productsModel.updateMany({category: categoryId}, {category: resp[0]._id}, (err, docsUpdated) => {
                    if(err){
                        warnings.message_500(res)
                    }
                    // Poner si se necesita validar si no hay productos con esa categoria
                    // }else if(docsUpdated.n === 0){
                    //     warnings.message_404(res, 'products with that category')
                    // }
                    else{
                        categoryModel.findByIdAndRemove(categoryId, (err, resp) => {
                            if(err){
                                warnings.message_500(res)
                            }else{
                                res.status(200).send([
                                    {status: 'OK, 200'},
                                    {docsUpdated},
                                    {categoryDeleted: [true, resp]}
                                ])
                            }
                        });
                    }
                });
            }else{
                warnings.message_custom('hmmmm... Sorry we cant find the default category. Please try again')
            }
        })
    }else{
        warnings.message_401(res)
    }
}
exports.getCategories = (req, res) => {
    const user = req.user;

    if(user.rol === "ROL_ADMIN" || user.rol === "ROL_CLIENT"){
        categoryModel.find((err, documents) => {
            if(err){
                warnings.message_500(res)
            }else if(!documents){
                warnings.message_404(res, 'categories')
            }else{
                res.status(200).send([{status: 200}, {categories: documents}])
            }
        })
    }else{
        warnings.message_401(res)
    }
}
exports.getCategoryByName = (req, res) => {
    const user = req.user;
    const id = req.params.categoryID
    if(user.rol === "ROL_ADMIN" || user.rol === "ROL_CLIENT"){
        categoryModel.findById(id, (err, docs) => {
            if(err){
                warnings.message_500(res)
            }else if(!docs){
                warnings.message_404(res, 'category')
            }else{
                res.status(200).send([{status: 200}, {category: docs}])
            }
        });
    }else{
        warnings.message_401(res)
    }
}
exports.getProductsOfCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    const user = req.user;
    if(user.rol === "ROL_ADMIN" || user.rol === "ROL_CLIENT"){
        productsModel.find({category: categoryId}, (err, productFound) => {
            if(err){
                warnings.message_500(res)
            }else if(!productFound){
                warnings.message_custom(res, 'Jmmm, sorry we can not get all the products')
            }else{
                res.status(200).send([{status: 200},{products: productFound}])
            }

        });
    }else{
        warnings.message_401(res)
    }
}
exports.createDefault = () => {
    const category = new categoryModel();
    category.name = 'default';
    category.description = 'Default Category';
    categoryModel.find({name: category.name, description: category.description}, (err, catFind) => {
        if(err){
            console.log('error', err)
        }else if(catFind && catFind.length >= 1){
            console.log({status: 'Default category already exists'})
        }else{
            category.save((err, resp) => {
                if(err){
                    console.log(err)
                }else if(!resp){
                    console.log(err)
                }else{
                    return resp
                }
            })
        }
    });
}