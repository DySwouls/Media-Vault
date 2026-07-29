(function () {
    function initApp() {
        if (window.MediaVaultUI && typeof window.MediaVaultUI.setupLibrary === 'function') {
            window.MediaVaultUI.setupLibrary();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
