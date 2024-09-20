import axios from 'axios';

export const checkLanguageCookie = () => {
    return new Promise((resolve, reject) => {
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [name, value] = cookie.split('=');
            acc[name] = value;
            return acc;
        }, {});
        if (!cookies.language) {
            axios.get('https://ipapi.co/json/')
            .then((response) => {
                if (!['Russia', 'Belarus', 'Ukraine'].includes(response.data.country_name)) {
                    let date = new Date();
                    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
                    document.cookie = `language=en; expires=${date.toUTCString()}; path=/`;
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
        } else if (cookies.language === 'en') {
            resolve(true);
        } else {
            resolve(false);
        }
    });
};
