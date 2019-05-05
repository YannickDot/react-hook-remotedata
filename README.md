# react-hook-remotedata

A set of react hooks to fetch remote data following the pattern exposed in [Slaying a UI Antipattern in Fantasyland](https://medium.com/javascript-inside/slaying-a-ui-antipattern-in-fantasyland-907cbc322d2a)

## Install

```
npm install --save daggy react react-hook-remotedata
```

## Examples

### useRemoteData

This hook gives you a RemoteData object + a set of callbacks to update its state

```js
import React, { useEffect } from "react";
import { useRemoteData } from "react-hook-remotedata";

function App() {
  const [data, { setLoading, setSuccess, setFailure }] = useRemoteData();

  useEffect(() => {
    setLoading();
    fetchSomething().then(json => setSuccess(json), err => setFailure(err));
  }, []);

  return (
    <div className="App">
      <h1>RemoteData Hook</h1>
      {data.cata({
        NotAsked: () => <p>Please start</p>,
        Loading: () => <p>Loading</p>,
        Failure: error => <p>Error: {JSON.stringify(error)}</p>,
        Success: data => <code>{JSON.stringify(data, null, 2)}</code>
      })}
    </div>
  );
}

function fetchSomething() {
  return new Promise(res => setTimeout(res, 3000))
    .then(() => fetch("https://jsonplaceholder.typicode.com/todos/1"))
    .then(response => response.json());
}
```

### useFetchRemoteData

For this hook, you provide a promise returning function, and when you call `runFetch()`, the RemoteData object state is updated for you.

```js
import React, { useEffect } from "react";
import { useFetchRemoteData } from "react-hook-remotedata";

function App() {
  const [data, runFetch] = useFetchRemoteData(() => fetchSomething());

  useEffect(() => {
    runFetch();
  }, []);

  return (
    <div className="App">
      <h1>RemoteData Hook</h1>
      {data.cata({
        NotAsked: () => <p>Please start</p>,
        Loading: () => <p>Loading</p>,
        Failure: error => <p>Error: {JSON.stringify(error)}</p>,
        Success: data => <code>{JSON.stringify(data, null, 2)}</code>
      })}
    </div>
  );
}

function fetchSomething() {
  return new Promise(res => setTimeout(res, 3000))
    .then(() => fetch("https://jsonplaceholder.typicode.com/todos/1"))
    .then(response => response.json());
}
```
