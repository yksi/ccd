window.$api.$$session = function (force) {
    if (force || ($cookie.get('ccd_api_token') && !/ccd/.test(window.location.search))) {
        window.location.search = '?ccd=' + $cookie.get('ccd_api_token')
    }
};


window.$api.$$login = function (data) {
    window.$api.send('login', data, 'POST').then(response => {
        if (response.ok) {
            $cookie.create('ccd_api_token', response.token);
            $api.$$session(true);
        } else {
            window.$notification.message(response.message);
        }
    });
};

window.$api.$$logout = function () {

    window.$api.send('logout', {token: $cookie.get('ccd_api_token')}, 'POST').then(
        () => {
            $cookie.remove('ccd_api_token');
            window.location.href = "/";
        }
    );
};

window.$api.$$session();