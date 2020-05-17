import { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../store/appContext';

export const useHttp = () => {
    const [isLoading, setLoading] = useState(false);
    const { logout } = useContext(AppContext);
    const history = useHistory();
    const [error, setError] = useState(null);

    const request = async (
        url = '',
        method = 'GET',
        body = {},
        headers = {}
    ) => {

        setLoading(true);
        let sendBody = '';

        if (body) {
            headers['Content-Type'] = 'application/json';
            sendBody = JSON.stringify(body)
        }

        try {
            const response = await fetch(url, { method, body: sendBody, headers });
            const data = await response.json();

            if (response.status === 401) {
                logout();
                history.push('/login');
                return { status: response.status };
            }

            if (!response.ok) {
                throw new Error(data.result || 'Что-то пошло не так');
            }

            setLoading(false);
            return { data, status: response.status };

        } catch (error) {
            setLoading(false);
            setError(error.message);
            return { status: 400 }
        }

    }

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return { isLoading, error, request, clearError }
}