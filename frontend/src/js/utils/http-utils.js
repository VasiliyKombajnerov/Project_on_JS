import config from "../config/config";
import {AuthUtils} from "./auth-utils";

export class HttpUtils{

    static async request (url, method = 'GET', useAuth = true, body = null) {
        const result = {
            error: false,
            response: null
        }
        let token = null

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': token
            },

        }

        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token
            }

        }

        if (body) {
            params.body = JSON.stringify(body)
        }

        let response = null
        try {
            response = await fetch(config.host + url, params);
            result.response = await response.json()
        } catch (e){
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true
            if (useAuth && response.status === 401) {

                if (!token) {
                    // 1 Нет токена
                    result.redirect = '/login'
                } else {
                    // 2 Токен устарел
                    const updateTokenResult =  await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        // Делаем запрос повторно
                        return this.request(url, method, useAuth, body)
                    } else {
                        result.redirect = '/login'
                    }
                }
            }

        }

        return result

    }
}