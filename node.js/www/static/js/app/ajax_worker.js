
/** ajax_worker.js */


addEventListener('message', e => {
    var data = e.data;
    if(data.target && (data.target.includes('metamask'))) return;
    
    // console.log('AJAX WEB WORKER:', data, data.headers);
    var request = new XMLHttpRequest();
    request.timeout = data.timeout;
    let method = data.method;

    //Definimos el tratamiento del callback de la petición AJAX
    request.onreadystatechange = function() {
        //Si la petición terminó el proceso
        if(request.readyState == XMLHttpRequest.DONE) {
            //Si el estado final de la petición es OK (==200)
            if(request.status == 200) {
                postMessage({status:200, data: request.responseText});
            }
            //Si el estado final de la petición es ERROR (==400)
            else if(request.status == 400) {
                console.error('Ajax Error :', request.responseText);
            }
            //Si el estado final de la petición es ERROR (==403) redirecciona
            else if(request.status == 403) {
                console.error('Ajax Error :', request.responseText);
                postMessage({ status: 403, data: request.responseText});
            }
            //Si el estado final de la petición es ERROR (==404)
            else if(request.status == 404) {
                console.error('Ajax Error :', request.responseText);
            }
            else {
                console.error("Unexpected Result for:", e.data);
            }
        }
    }; //on ready state change
    request.open((method) ? method : "POST", data.url, true); //data.async); //Definimos la petición AJAX propiamente
    if(data.query) {
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(data.query); //Envía la petición
    }
    else {
        request.send();
    }
    
console.log('REQUEST: ', request, 'URL: ', data.url);

}, true); //false);
