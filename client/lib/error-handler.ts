import { AxiosError } from 'axios';
import { toast } from 'sonner';

export function errorHandler(error: unknown): void {
    if (error instanceof AxiosError) {
        const message = error.response?.data?.message ?? error.message;
        toast.error(Array.isArray(message) ? message.join('\n') : message);
        return;
    }
    if (error instanceof Error) {
        toast.error(error.message);
        return;
    }
    toast.error('Something went wrong');
}