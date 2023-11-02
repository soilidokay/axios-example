import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { HttpService } from '../Http'
import { ProcessRepose, PushError } from '../Http/helper'

interface ErrorModel {
    [key: string]: string[]
}
const ProcessError = (err: AxiosError<ErrorModel>) => {
    const errorMessages = Object.values(err.response?.data ?? {})
        .filter((x) => x.length > 0)
        .map((x) => x[0])
    if (errorMessages.length < 1) return
    //alert error
    PushError(errorMessages.join('\n'))
}

//có thể lấy từ localStorage
export const GetToken = () => {
    return Promise.resolve('')
}

export default class ServiceBase {
    _http = HttpService
    /**
     *
     */
    constructor(http?: AxiosInstance) {
        if (http) {
            this._http = http
        }
        this.MapResponse()
    }
    MapResponse = () => {
        this._http.interceptors.response.use((res) => res, ProcessRepose)
    }

    addToken = async (config?: AxiosRequestConfig) => {
        const _token = await GetToken()
        if (_token) {
            if (!config) {
                config = { headers: {} }
            }
            if (!config.headers) {
                config.headers = {}
            }
            config.headers.Authorization = 'Bearer ' + _token
        }
        return config
    }
    async Get<TModel>(url: string, config?: AxiosRequestConfig | undefined) {
        const response = await this._http.get<TModel>(url, await this.addToken(config))
        return response.data
    }
    async TryGet<TModel>(url: string, config?: AxiosRequestConfig | undefined) {
        try {
            return this.Get<TModel>(url, config)
        } catch {
            return null
        }
    }
    async Post<TModel>(url: string, data?: any, config?: AxiosRequestConfig | undefined) {
        const response = await this._http.post<TModel>(url, data, await this.addToken(config))
        return response.data
    }
    async Put<TModel>(url: string, data?: any, config?: AxiosRequestConfig | undefined) {
        const response = await this._http.put<TModel>(url, data, await this.addToken(config))
        return response.data
    }

    async TryPut<TModel>(url: string, data?: any, config?: AxiosRequestConfig | undefined) {
        try {
            await this.addToken(config)
            return await this.Put<TModel>(url, data, config)
        } catch (error) {
            // const err = error as AxiosError
            return null
        }
    }
    async TryPost<TModel>(url: string, data?: any, config?: AxiosRequestConfig | undefined) {
        try {
            return await this.Post<TModel>(url, data, config)
        } catch (error) {
            // const err = error as AxiosError
            return null
        }
    }
    async Delete<TModel>(url: string, config?: AxiosRequestConfig | undefined) {
        const response = await this._http.delete<TModel>(url, await this.addToken(config))
        return response.data
    }
    async TryDelete<TModel>(url: string, config?: AxiosRequestConfig | undefined) {
        try {
            return await this.Delete<TModel>(url, await this.addToken(config))
        } catch (error) {
            ProcessError(error as any)
            return null
        }
    }
    async PushNotify<TFunc extends (...param: any[]) => any>(action: TFunc, ...p: Parameters<TFunc>): Promise<ReturnType<TFunc>> {
        try {
            return await action.bind(this)(...p)
        } catch (err) {
            const error = err as AxiosError
            const data = error.response?.data as any
            if (data) {
                const keys = Object.keys(data)
                keys.forEach((key) => {
                    const errors = data[key] as string[]
                    if (Array.isArray(errors)) {
                        errors.forEach(PushError)
                    }
                })
            }
            throw error
        }
    }
}

export class CancelAction extends AbortController {
    cancel = () => {
        this.trigger && this.trigger()
        super.abort()
    }
    trigger?: () => void
}
