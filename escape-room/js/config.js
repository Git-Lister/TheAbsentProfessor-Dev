let appConfig = null;

function loadConfig() {
    return fetch('data/config.json')
        .then(response => response.json())
        .then(data => {
            appConfig = data;
            return data;
        });
}