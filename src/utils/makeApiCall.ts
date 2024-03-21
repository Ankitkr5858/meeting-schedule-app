import axios, { AxiosResponse, AxiosError } from "axios";
import { NextResponse } from "next/server";

const baseUrl = 'http://localhost:3000/api/';

export const makeApiCall = async <T>({
    endpoint,
    method = 'GET',
    data,
    ...config
}: {
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    data?: any,
}): Promise<T> => {
    const url = `${baseUrl}${endpoint}`;
    try {
        const response: AxiosResponse<T> = await axios({ method, url, data, ...config });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data.message
        } else {
            throw new Error('Unexpected Error Occurred')
        }
    }
};
