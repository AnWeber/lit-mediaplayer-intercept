
const bc = new BroadcastChannel("test_channel");
const load = async (request) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  try {
    const response = await fetch(request.clone());

    const range = response.headers.get("TestRange");
    console.info(range)
    bc.postMessage(range);
    return response;
  } catch (err) {
    console.error(err);
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(load(event.request));
});
