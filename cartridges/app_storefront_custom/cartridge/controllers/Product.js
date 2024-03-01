let server = require('server');

server.extend(module.superModule);

server.append('Show', function(req, res, next){
    //get the product
    const ProductMgr = require('dw/catalog/ProductMgr');
    const prod = ProductMgr.getProduct(req.querystring.pid);

    //get product's primary category and pass it to the searcher
    const ProductSearchModel = require('dw/catalog/ProductSearchModel');
    let searcher = new ProductSearchModel();
    searcher.setCategoryID(prod.primaryCategory.ID);

    //search the products from the primary category
    searcher.search();
    //demand only orderable products be accessed
    searcher.setOrderableProductsOnly(true);

    //get the appropriate 'dw.catalog.SortingRule' and use it for our results
    const CatalogMgr = require('dw/catalog/CatalogMgr');
    const sorter = CatalogMgr.getSortingRule('price-low-to-high');//id gotten from Bussines Manager
    searcher.setSortingRule(sorter);

    //now get the products as a list, then convert it to an array, than extract only the IDs
    const initList = searcher.getProducts().asList().toArray().map(p => p.getID());

    //get the length
    const productCount = initList.length;

    //start to compute the four random products
    //each one is extracted from another 'slice' of the initial list
    //the 'slices' are equal in size, except for the last one, which takes
    //the extra elements, which couldn't be equally divided among all four

    const sliceSize = Math.floor(initList.length / 4);
    const extraElem = initList.length % 4;

    let shownProducts = [];
    shownProducts.push(initList[
        Math.floor(Math.random()*sliceSize)
    ]);
    shownProducts.push(initList[
        Math.floor(Math.random()*sliceSize)+sliceSize
    ]);
    shownProducts.push(initList[
        Math.floor(Math.random()*sliceSize)+2*sliceSize
    ]);
    shownProducts.push(initList[
        Math.floor(Math.random()*(sliceSize+extraElem))+3*sliceSize
    ]);

    //get the view data
    const data = res.getViewData();
    //extract from the products just
    data._4extraProducts = shownProducts;
    //reset the data
    res.setViewData(data);

    next();
});

module.exports = server.exports();