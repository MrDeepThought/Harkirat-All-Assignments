## Local Storage V/S Session Storage

localStorage and sessionStorage are both web storage options available in JavaScript for storing data on the client-side. While they have some similarities, there are a few key differences between them:

1. Data Persistence: localStorage stores data with no expiration date, meaning the data persists even after the browser is closed and reopened. It remains in the browser until explicitly removed or cleared. On the other hand, sessionStorage stores data for a single browsing session. Once the browser window or tab is closed, the data is cleared and not available for future sessions.

2. Scope: localStorage data is accessible across all tabs and windows of the same origin (i.e., same domain and protocol). This allows data to be shared between different pages of a website or web application. sessionStorage, however, is limited to the specific window or tab that created it. Data stored in sessionStorage is not accessible to other tabs or windows.

3. Storage Limit: Both localStorage and sessionStorage have a storage limit, typically around 5MB per origin. However, the actual limit may vary across browsers. If the limit is exceeded, attempting to store more data may throw an error.

4. Storage Lifetime: localStorage and sessionStorage data remains available until explicitly removed or cleared. They are not affected by page reloads or navigating to different pages within the same origin. However, if the browser's cache is cleared, the stored data will be removed as well.

In general, localStorage is commonly used for long-term data storage, such as user preferences or cached data. sessionStorage is often used for temporary data storage, such as maintaining state during a user session or storing data that should not persist beyond the current browsing session.