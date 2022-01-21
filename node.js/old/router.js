
const conf = require('./serverSettings.json');

var router = {};
router.handle = {};


router.route = (path, req, res, payload) => {
    console.log(router.handle);

    console.log(conf.route_msg + path);
    if((router.handle[path]) && (typeof router.handle[path][req.method] === 'function')) {
        
        router.handle[path][req.method](req, res, payload);
    }
    else {
        console.log(conf.router_msg_error_path + path);
        return conf.ERROR_404;
    }
}

router.bind = (path, method, handler) => {
    console.log('ROUTER: ', path, ' ==> ', method, '[', handler, ']: ');
    router.handle[path] = { [method]: handler };
}

module.exports = router;
