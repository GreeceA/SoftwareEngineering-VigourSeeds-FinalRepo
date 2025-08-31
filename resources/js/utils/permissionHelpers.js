import { router } from '@inertiajs/react';

export const refreshUserData = () => {
    // Force a reload of user data without refreshing the entire page
    router.reload({ only: ['auth'] });
};

export const performActionWithRefresh = (action, callback = null) => {
    return action.then(() => {
        // Refresh user permissions after the action
        refreshUserData();
        if (callback) callback();
    }).catch((error) => {
        console.error('Action failed:', error);
        if (callback) callback(error);
    });
};
