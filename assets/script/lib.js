let Api = function () {
    const request = new XMLHttpRequest();

    this.send = function (url, data, method = "GET") {
        request.open(method, "/" + url, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(typeof data === 'object' ? JSON.stringify(data) : data);
        return new Promise(
            resolve => {
                request.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        resolve(JSON.parse(this.response));
                    }
                }
            }
        );
    }

};

let Form = function () {
     
    this.getData = function (domElement) {
        const result = new FormData;
        for (const input of domElement.querySelectorAll('input')) {
            if (input.name) {
                result.append(input.name, input.value);
            }
        }

        return result;
    };

    this.getJsonData = function (domElement) {
        const result = {};
        for (const input of domElement.querySelectorAll('input')) {
            if (input.name) {
                result[input.name] = input.value;
            }
        }

        return result;
    };

    this.getDataBySelector = function (selector) {
        return this.getData(document.querySelector(selector));
    };

    this.getJsonDataBySelector = function (selector) {
        return this.getJsonData(document.querySelector(selector));
    };

};

let Cookie = function () {

    /**
     * @param {string}             name
     * @param {string}             value
     * @param {string|number|Date} [expires]
     * @param {string}             [path]
     * @param {string}             [domain]
     */
    this.create = function (name, value, expires, path, domain) {
        let cookie = name + "=" + encodeURI(value) + ";";

        if (expires) {
            // If it's a date
            if(expires instanceof Date) {
            // If it isn't a valid date
            if (isNaN(expires.getTime()))
                expires = new Date();
            } else {
                expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);
            }
                
            cookie += "expires=" + expires.toGMTString() + ";";
        }

        if (path)cookie += "path=" + path + ";";
        if (domain) cookie += "domain=" + domain + ";";
    
        document.cookie = cookie;
    };

    this.get = function (cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    this.remove = function (sKey, sPath, sDomain) {
        document.cookie = encodeURIComponent(sKey) + 
            "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + 
            (sDomain ? "; domain=" + sDomain : "") + 
            (sPath ? "; path=" + sPath : "");
    }
};

let Notification = function () {
    this.messageBox = document.getElementById('MessageBox');
    this.counter = 0;

    this.message = function (text) {
        if (this.messageBox.querySelector('.text').innerText === text) {
            this.counter ++;
        } else {
            this.counter = 1;
        }
        this.messageBox.querySelector('.text').innerText = text;
        this.messageBox.style.display = 'block';

        if (this.counter > 1) {
            document.getElementById('MessageCounter').style.display = 'inline';
            document.getElementById('MessageCounter').innerText = this.counter.toString();
        } else {
            document.getElementById('MessageCounter').style.display = 'none';
        }
    };

    this.close = function () {
        this.messageBox.querySelector('.text').innerText = '';
        this.messageBox.style.display = 'none';
    };
};

(function () {
    window.$api = new Api;
    window.$form = new Form;
    window.$cookie = new Cookie;
    window.$notification = new Notification;
})();