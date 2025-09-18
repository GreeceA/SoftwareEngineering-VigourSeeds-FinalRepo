import { useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

export const usePermissionRefresh = () => {
    const { flash } = usePage().props;

    useEffect(() => {
        // If we get a refresh_permissions flag, reload the user data
        if (flash?.refresh_permissions) {
            // Small delay to ensure the backend has processed the changes
            setTimeout(() => {
                router.reload({ only: ['auth'] });
            }, 100);
        }
    }, [flash?.refresh_permissions]);
};

export default usePermissionRefresh;
