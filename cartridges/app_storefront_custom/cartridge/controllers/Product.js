let server = require('server');

server.extend(module.superModule);

server.append('Show', function(req, res, next){
    let data = res.getViewData();
    data.extendedField = 'Adding data to the view';
    res.setViewData();
    next();
});

module.exports = server.exports();