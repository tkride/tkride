var Ajax = {

    defaultErrorCb: function(error) {
        console.error('Ajax Error :', error);
    },

    post: function(url, headers, query, successCb, errorCb, asynchro=true, timeout=3000) {
        console.log('Ajax.post: ' + url + ", " + query + ", " + successCb + ", " + errorCb + ", timeout: " + timeout);

        if ((errorCb == undefined) || (errorCb == null)) {
            errorCb = this.defaultErrorCb;
        }

        $.ajax({
            type:Const.POST_ID,
            url:url, 
            data:query,
            async: asynchro,
            timeout: timeout,
            headers: headers,
            success: successCb,
            error: errorCb,
        });
    },
}