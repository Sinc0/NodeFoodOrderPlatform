const Product = require('../models/product');
const User = require('../models/user');
const mongodb = require('mongodb');
const fs = require('fs');
const Order = require('../models/order');
const path = require('path');

const ObjectId = mongodb.ObjectId;

function deleteFile(filePath)
{
    fs.unlink(filePath, (err) => {
        if(err)
        {
            throw(err);
        }
    });
}

function parseLoginCookie(cookieId)
{
    var findLoginCookie = cookieId;

    if(findLoginCookie == null)
    {
        return null;
    }
    
    var regexFindLoginCookieId = /(?!\sloginCookie=id:)\d.\d*(?=email)/g;

    if(regexFindLoginCookieId == null)
    {
        return null;
    }

    var loginCookieId = findLoginCookie.match(regexFindLoginCookieId);
    //var regexFindLoginCookieEmail = /(?!email:)[\w\d]*@.*\.\w*/g;
    //var loginCookieEmail = findLoginCookie.match(regexFindLoginCookieEmail);

    var cookieId = parseFloat(loginCookieId);
    //console.log(String(loginCookieId));
    //console.log(String(loginCookieEmail))

    if(cookieId != null)
    {
        return cookieId;
    }

    else
    {
        return null;
    }
}

exports.addProduct = (req, res, next) => {
    //console.log('In the middleware');
    //res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));

    console.log('getAdminAddProducts');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        res.render('admin/add-product', { 
            pageTitle: 'Add Product',
            path: 'admin/add-product',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
            statusText: "Image max size: 5MB"
        });
    }

    else
    {
        res.redirect('/');
    }

}

exports.postProduct =  (req, res, next) => {

    console.log('postAddAdminProduct >');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        const id = req.body.id;
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        const imageUrl = req.file;
        //console.log(imageUrl);
        //console.log(imageUrl.path);
        let imageSize = null;
        let imageSizeLimit = 5000000;

        if(imageUrl != null)
        {
            imageSize = imageUrl.size;
        }
        
        //console.log(imageUrl);

        if(imageSize > imageSizeLimit)
        {
            console.log('add product: file too large');
            console.log('add product: failed');
            res.render('admin/add-product', {
                path: '/add-product',
                pageTitle: 'Add Product',
                statusText: 'Error: file to large' 
            })
        }

        else if(!imageUrl) {
            const imagePath = '../images/standardImage.jpg';

            const product = new Product(title, price, description, imagePath);

            product
                .save()
                .then(result => {
                    //console.log(result)
                    console.log('add product: ' + title + ' added sucessfully');
                    //console.log(product);
                    res.redirect('/admin/product-list')
                })
                .catch(err => console.log(err));

            /*
            console.log('add product: file type not supported');
            console.log('add product: failed')
            res.redirect('/admin/add-product');
            */
        }

        else
        {   
            const imagePath = imageUrl.path;

            const product = new Product(title, price, description, imagePath);

            product
                .save()
                .then(result => {
                    //console.log(result)
                    console.log('add product: ' + title + ' added sucessfully');
                    //console.log(product);
                    res.redirect('/admin/product-list')
                })
                .catch(err => console.log(err));
        }

    }

    else
    {
        res.redirect('/');
    }

}

exports.getProducts = (req, res, next) => {
    
    console.log('getAdminProductList');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Product.fetchAll()
        .then(products => {
            res.render('admin/product-list', { 
                admin: validation.isAdmin,
                loggedIn: true,
                prods: products,
                path: '/products',
                pageTitle: 'Admin Products'
            });
        })
        .catch(err => console.log(err));
        //console.log('In the middleware');
        //console.log('shop.js', products);
        //res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    }

    else
    {
        res.redirect('/');
    }

}

exports.getEditProduct = (req, res, next) => {

    console.log('getAdminEditProduct');
    const prodId = req.params.productId;
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {

        Product
        .findById(prodId)
        .then(product => { 
            res.render('admin/edit-product', {
                pageTitle: product.title,
                product: product,
                path: '/edit-product'
            });
        })
        .catch(err => console.log(err));
    }

    else
    {
        res.redirect('/');
    }

    /*
    const prodId = req.params.productId;
    Product
    .findById(prodId)
    .then(product => {
        res.render('shop/product-detail', {
            product: product,
            path: '/products'
        });
    })
    .catch(err => console.log(err));
    */
}

exports.postEditProduct = (req, res, next) => {

    console.log('postEditAdminProduct >');
    let validation = res.locals.validation;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        const productId = req.body.id;
        const updatedTitle = req.body.title;
        const updatedPrice = req.body.price;
        const updatedDescription = req.body.description;
        const updatedImageUrl = req.file;
        const standardImage = "../images/standardImage.jpg";
        let imageCheck = req.body.imageCheck;
        let imageSize = null;
        let imageSizeLimit = 5000000;

        //console.log(updatedImageUrl);
        //console.log(imageCheck);
        //console.log(imageSize);
        
        if(updatedImageUrl != null)
        {
            imageSize = updatedImageUrl.size;
        }
        
        if(imageCheck == null || imageCheck == "")
        {
            imageCheck = null;
        }  
     
        //if image is selected
        if(updatedImageUrl != null && imageSize < imageSizeLimit)
        {
            const updatedImagePath = updatedImageUrl.path;
            
            //const product = new Product(updatedId, updatedTitle, updatedPrice, updatedDescription, updatedImagePath);
    
            Product
                .update(productId, updatedTitle, updatedPrice, updatedDescription, updatedImageUrl.path)
                .then(result => {
                    //console.log(result.title)
                    //console.log('Product Updated')
                    console.log('edit product: ' + productId + ' successful')
                    res.redirect('/admin/product-list')
                })
                .catch(err => console.log(err));
        }

        //if no image is selected and product have image from before
        else if(updatedImageUrl == null && imageCheck != null && imageSize < imageSizeLimit)
        {
            const updatedImagePath = imageCheck;
    
            Product
                .update(productId, updatedTitle, updatedPrice, updatedDescription, updatedImagePath)
                .then(result => {
                    //console.log(result.title)
                    //console.log('Product Updated')
                    console.log('edit product: ' + productId + ' successful')
                    res.redirect('/admin/product-list')
                })
                .catch(err => console.log(err));
        }

        //if no image selected and product have no image from before
        else if(updatedImageUrl == null && imageCheck == null && imageSize < imageSizeLimit) 
        {   
            const updatedImagePath = standardImage;
    
            Product
                .update(productId, updatedTitle, updatedPrice, updatedDescription, updatedImagePath)
                .then(result => {
                    //console.log(result.title)
                    //console.log('Product Updated')
                    console.log('edit product: ' + productId + ' successful')
                    res.redirect('/admin/product-list')
                })
                .catch(err => console.log(err));
        }

        else
        {
            if(imageSize > imageSizeLimit)
            {
                console.log('edit product: image file to large')
                console.log('edit product: failed');
                res.redirect('/admin/edit-product/' + productId);
            }

            else
            {
                console.log('edit product: image file type not supported');
                console.log('edit product: failed');
                res.redirect('/admin/edit-product/' + productId);
            }
        
        }

    }

    else
    {
        res.redirect('/');
    }

}

exports.postDeleteProduct = (req, res, next) => {
    
    console.log('postDeleteAdminProduct >');
    const productId = req.params.productId;
    let validation = res.locals.validation;
    let productImagePath = null;
    let deleteSuccessful = 1;

    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Product.findById(productId)
        .then(result => {

            //console.log(result)
            productImagePath = result.imageUrl;

            if(productImagePath.includes('standardImage.jpg') == false)
            {
                fs.unlink(productImagePath, (err) => {
                    if(err)
                    {
                        console.log(err);
                        //console.log('delete product: image file deleted failed');
                        console.log('delete product: ' + productId + ' failed');
                        res.redirect('/admin/product-list');
                    }
    
                    else
                    {
    
                        //console.log('delete product: image file deleted successfully');
                        Product
                        .delete(productId)
                        .then(result => {
                            
                            //console.log(result);
                            //console.log(deleteSuccessful);
                            
                            if(result == deleteSuccessful)
                            {
                                console.log('delete product: ' + productId + ' successful');
                                res.redirect('/admin/product-list');
                            }
                
                            else
                            {
                                console.log('delete product: ' + productId + ' failed');
                                res.redirect('/admin/product-list');
                            }
                            
                        })
                        .catch(err => console.log(err))
                    }
                })
            }

            else
            {
                Product
                .delete(productId)
                .then(result => {
                    
                    //console.log(result);
                    //console.log(deleteSuccessful);
                    
                    if(result == deleteSuccessful)
                    {
                        console.log('delete product: ' + productId + ' successful');
                        res.redirect('/admin/product-list');
                    }
        
                    else
                    {
                        console.log('delete product: ' + productId + ' failed');
                        res.redirect('/admin/product-list');
                    }
                    
                })
                .catch(err => console.log(err))
            }                
        })
        .catch(err => {console.log(err)})
    }

    //anon user
    else
    {
        res.redirect('/');
    }

}

exports.postDeleteOrder = (req, res, next) => {

    console.log('postDeleteOrder >');
    const orderId = req.params.orderId;
    let validation = res.locals.validation;
    let productImagePath = null;
    let deleteSuccessful = 1;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        productImagePath = path.join(__dirname, '..', 'public', 'orderReciepts', '/Reciept=' + orderId + '.pdf');

        fs.unlink(productImagePath, (err) => {
            if(err)
            {
                console.log(err);
                //console.log('delete product: image file deleted failed');
                console.log('delete order: ' + orderId + ' failed');
                res.redirect('/admin/product-list');
            }

            else
            {
                Order.deleteOne(orderId)
                .then(result => {
                            
                    //console.log(result);
                    //console.log(deleteSuccessful);
                    res.redirect('/admin/order-list');

                })
                .catch(err => console.log(err))
            }
        });
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}

exports.getOrderList = (req, res, next) => {
    console.log('getOrderList');
    let validation = res.locals.validation;
    
    //user is admin
    if(validation.status == true && validation.isAdmin == true)
    {
        Order.fetchAll()
        .then(orders => {
            res.render('admin/order-list', { 
                admin: validation.isAdmin,
                loggedIn: true,
                orders: orders,
                path: '/orders',
                pageTitle: 'Order List'
            });
        })
        .catch(err => console.log(err));
    }

    //anon user 
    else
    {
        res.redirect('/');
    }
}