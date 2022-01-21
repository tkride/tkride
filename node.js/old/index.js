
const conf = require('./serverSettings.json');
const db = require('./conf/db');
const fs = require('fs');

var routers = {};

const remove_extension = (filename) => {
    return filename.split('.').shift();
}


fs.readdirSync(__dirname).filter((file) => {
    let name = remove_extension(file);
    let skip = ['index'].includes(name);
    if(!skip) {
        console.log('ROUTING => ', name);
    }
});

// var controllersInit = {};
// const load_routers = () => {
//     routers.forEach(router => {
//         try {
//             let router_path = conf.router_path + router;
//             controllersInit[router] = require(router_path);
//             if(controllersInit[router]) {
//                 controllersInit[router].init();
//             }
//             else {
//                 throw(conf.router_msg_error_undefined);
//             }
//         }
//         catch(err) {
//             console.log(conf.router_msg_error_init, err);
//         }
//     });
// }


module.exports = { routers }