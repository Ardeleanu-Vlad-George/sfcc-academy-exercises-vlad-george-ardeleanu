const server = require('server');

server.extend(module.superModule);

server.append(
    'AddProduct',
    function(req, res, next){
        if(req.currentCustomer.profile){
            const email = req.currentCustomer.profile.email;
            const Map = require('dw/util/HashMap');
            const Template = require('dw/util/Template');
            const Mail = require('dw/net/Mail');
            const ProductMgr = require('dw/catalog/ProductMgr');
            const URLUtils = require('dw/web/URLUtils');

            const message = new Mail();
            message.setSubject('Confirmation of your order');
            message.setFrom('noreply@salesforce.com');
            message.addTo(email);

            const product = ProductMgr.getProduct(req.form.pid);
            const data = new Map();
            //photo
            data.put('img', product.getImage('medium',0).getAbsURL().toString());
            data.put('name', product.getName());
            data.put('link', URLUtils.url('Product-Show','pid', req.form.pid).abs().toString());
            data.put('description', product.getShortDescription());
            data.put('price', product.getPriceModel().getPrice().getValue());
            data.put('quantity', req.form.quantity);

            const format = new Template('mail/confirmProduct');
            message.setContent(format.render(data));
            message.send();
        }
        next();
    }
);


module.exports = server.exports()