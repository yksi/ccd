window.$api.$$deploy = function () {
    const data = {
        token: window.$cookie.get('ccd_api_token'),
        command: document.getElementById('CommandInput').value,
    };

    const callback = (response = {ok: false, message: ''}) => {
        const commandOutput = document.getElementById('DeployConsole').querySelector('div');
        commandOutput.innerHTML += `$ ${data.command}<pre>${response.message}</pre>`;

        if (data.command === 'clear') {
            window.$api.$$clear();
        }

        window.scrollTo(0,document.body.scrollHeight);
        document.getElementById('CommandInput').value = '';
    };

    if (data.command === '') {
        callback();
        return;
    }

    window.$api.send('deploy-app', data, 'POST').then(callback);
};

window.$api.$$focus = function () {
    document.getElementById('CommandInput').focus();
};

window.$api.$$clear = function () {
    const commandOutput = document.getElementById('DeployConsole').querySelector('div');
    commandOutput.innerHTML = '';
};

let control = false;
window.onkeydown = function (e) {
    if (e.key === 'Control') {
        control = true;
    }

    if (e.key === 'l' && control) {
        e.preventDefault();
        window.$api.$$clear();
    }
};

window.onkeyup = function (e) {
    if (e.key === 'Control') {
        control = false;
    }
};