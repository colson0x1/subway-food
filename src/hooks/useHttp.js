// need to create custom hook because we've two components: checkout and meals component.
// both needs to send requests even though those requrest are sent at different
// points in time, but they both do it. And they then also, both in the end need
// to deal with different request states: failing requests, loading requests and
// requests that succeeded.
// So we've that same logic which we in the end need in two different components
// to update the UI. And since its some stateful logic that should impact the
// UI and where changes should impact the UI, we need a custom hook because
// just creating the custom standard function won't do the trick.

import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

// custom hooks must start with `use` to signal the react that the special
// rules of hooks should apply here

// this function is for in general dealing with sending requests
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || 'Something went wrong, failed to send request.',
    );
  }

  return resData;
}

export default function useHttp(url, config, initialData) {
  // we want to manage data too as state because in the end thats our success case
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // this function is about updating some state based on the requests status
  // sendRequest can be a async func, this is possible in custom hooks
  const sendRequest = useCallback(
    async function sendRequest() {
      // set loading to true because we're about to send a request
      setIsLoading(true);
      // we should also wrap in try catch because this might fail here
      // because in sendHttpRequest(), we're throwing an error if we got an
      // error response code, we would also get an error if sending the request
      // fails in the first place because we've no internet connection or something like this
      // so we definately wanna try this and catch error that might occur.
      // and now we also have to manage some state to reflect those different requests
      // states in the UI
      // because the idea of this custom hook in the end will be to use it in a component.
      try {
        const resData = await sendHttpRequest(url, config);
        setData(resData);
      } catch (error) {
        setError(error.message || 'Something went wrong!');
      }
      // no matter if we have an error or not, we're definately not loading anymore
      setIsLoading(false);
    },
    [url, config],
  );

  useEffect(() => {
    // sendRequest whenever the component that uses this hooks loads.
    // while that is what we want for the Meals component but its ofcourse not
    // what we want for the Checkout component.
    // Therefore, we should add check that sendRequest is not always getting sent.
    // One way to deal with this for Checkout component is to see config object request method
    // And if its GET or no config object was provided in the first place since GET is default,
    // we wanna sent the request right away!
    if ((config && (config.method === 'GET' || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);

  // the idea behind this custom hooks is now we can return an object where
  // we expose the data, isLoading and error state to whichever component
  // is using this custom hook
  // also sendRequest function and execute whenever we want ex when a form is submitted
  return {
    data,
    isLoading,
    error,
    sendRequest,
  };
}
