server = require('server');

server.extend(module.superModule);

server.append(
    'Show',
    function(req, res, next){
        const BasketMgr = require('dw/order/BasketMgr');
        let data = res.getViewData();
        data.cartTotal = BasketMgr.getCurrentBasket().getTotalGrossPrice();
        data.threshhold = dw.system.Site.getCurrent().getPreferences().custom.Exer_03_cart_total_upper_limit;
        res.setViewData(data);
        next();
    }
);

module.exports = server.exports();