// Utility to handle chunk load errors and retry
export const handleChunkLoadError = () => {
  if (typeof window !== 'undefined') {
    // Add event listener for chunk load errors
    window.addEventListener('error', (event) => {
      // Check if it's a chunk load error
      if (
        event.message?.includes('Loading chunk') ||
        event.message?.includes('ChunkLoadError') ||
        event.filename?.includes('_next/static/chunks/')
      ) {
        console.warn('Chunk load error detected, reloading page...');
        
        // Store current path and reload
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem('chunk-error-path', currentPath);
        
        // Reload the page
        window.location.reload();
      }
    });

    // Handle unhandled promise rejections that might be chunk errors
    window.addEventListener('unhandledrejection', (event) => {
      if (
        event.reason?.message?.includes('Loading chunk') ||
        event.reason?.name === 'ChunkLoadError'
      ) {
        console.warn('Chunk load promise rejection detected, reloading page...');
        
        // Store current path and reload
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem('chunk-error-path', currentPath);
        
        // Reload the page
        window.location.reload();
        
        // Prevent the default error handling
        event.preventDefault();
      }
    });
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  // Check if we just recovered from a chunk error
  const errorPath = sessionStorage.getItem('chunk-error-path');
  if (errorPath && window.location.pathname + window.location.search === errorPath) {
    console.log('Recovered from chunk load error');
    sessionStorage.removeItem('chunk-error-path');
  }
  
  // Set up error handlers
  handleChunkLoadError();
}