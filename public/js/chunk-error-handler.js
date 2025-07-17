// Chunk load error handler - runs before React initializes
(function() {
  // Handle chunk load errors globally
  window.addEventListener('error', function(event) {
    // Check if it's a chunk load error
    if (
      event.message && (
        event.message.includes('Loading chunk') ||
        event.message.includes('ChunkLoadError')
      ) ||
      event.filename && event.filename.includes('_next/static/chunks/')
    ) {
      console.warn('Chunk load error detected:', event.message);
      
      // Store current path to maintain navigation state
      try {
        sessionStorage.setItem('chunk-error-recovery', 'true');
        sessionStorage.setItem('chunk-error-path', window.location.pathname + window.location.search);
      } catch (e) {
        // Continue without session storage if it fails
      }
      
      // Reload the page after a short delay
      setTimeout(function() {
        window.location.reload();
      }, 100);
    }
  });

  // Handle unhandled promise rejections for chunk errors
  window.addEventListener('unhandledrejection', function(event) {
    if (
      event.reason &&
      event.reason.message &&
      (
        event.reason.message.includes('Loading chunk') ||
        event.reason.message.includes('ChunkLoadError')
      )
    ) {
      console.warn('Chunk load promise rejection:', event.reason.message);
      
      // Store current path to maintain navigation state
      try {
        sessionStorage.setItem('chunk-error-recovery', 'true');
        sessionStorage.setItem('chunk-error-path', window.location.pathname + window.location.search);
      } catch (e) {
        // Continue without session storage if it fails
      }
      
      // Reload the page after a short delay
      setTimeout(function() {
        window.location.reload();
      }, 100);
      
      // Prevent the default error handling
      event.preventDefault();
    }
  });

  // Check if we just recovered from a chunk error
  try {
    if (sessionStorage.getItem('chunk-error-recovery') === 'true') {
      console.log('Recovered from chunk load error');
      sessionStorage.removeItem('chunk-error-recovery');
      // Keep the path for potential navigation restoration
    }
  } catch (e) {
    // Continue without session storage if it fails
  }
})();