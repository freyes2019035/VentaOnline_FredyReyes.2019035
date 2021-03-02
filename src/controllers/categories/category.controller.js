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
    const { categoryId } = req.params;
    let defaultCategory = 0;
    await categoryModel.find({name: 'default', description: 'Default Category'}, (err, resp) => {
        console.log(err)
        if(resp && resp.length >= 1){
            console.log({status: 'Default Category already exists'})
            defaultCategory = resp[0]._id
        }else{
            createDefault().then(doc => {
                defaultCategory = doc._id
            });
        }
    })
    productsModel.find({category: categoryId}, (err, docsFound) => {
        if(err){
            warnings.message_500(res)
        }else if(!docsFound){
            warnings.message_404(res, 'products')
        }else if(docsFound && docsFound.length >= 1){
            let recordUpdated = 0;
            docsFound.forEach(product => {
                recordUpdated+=1;
                let newDefaultCategory = defaultCategory;
                productsModel.findByIdAndUpdate(product.id, {$set: {category: newDefaultCategory}}, (err, resp) => {
                    if(err){
                        console.log(err)
                    }
                });
            });
            categoryModel.findByIdAndRemove(categoryId, (err, resp) => {
                if(err){
                    warnings.message_500(res)
                }else{
                    res.status(200).send([
                        {status: 200},
                        {countRecordsUpdated: ` ${recordUpdated} records Updated `},
                        {categoryDeleted: [true, resp]}
                    ])
                }
            });
        }else{
            warnings.message_404(res,'products with that ID')
        }
    })
    
}
exports.getCategories = (req, res) => {
    const user = req.user;

    if(user.rol === "ROL_ADMIN"){
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

const createDefault = () => {
    const category = new categoryModel();
    category.name = 'default';
    category.description = 'Default Category';
    return new Promise((resolve, reject) => {
        category.save((err, resp) => {
            if(err){
                reject(err)
            }else if(!resp){
                reject(err)
            }else{
                resolve(resp)
            }
        })
    })
}