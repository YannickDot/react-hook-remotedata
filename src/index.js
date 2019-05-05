import { useState, useCallback } from "react";
import daggy from "daggy";

const RemoteData = daggy.taggedSum("RemoteData", {
  NotAsked: [],
  Loading: [],
  Failure: ["error"],
  Success: ["data"]
});

export function useRemoteData() {
  const [remoteData, setRemoteData] = useState(RemoteData.NotAsked);
  const setNotAsked = useCallback(() => setRemoteData(RemoteData.NotAsked), []);
  const setLoading = useCallback(() => setRemoteData(RemoteData.Loading), []);
  const setFailure = useCallback(
    error => setRemoteData(RemoteData.Failure(error)),
    []
  );
  const setSuccess = useCallback(
    data => setRemoteData(RemoteData.Success(data)),
    []
  );
  return [
    remoteData,
    {
      setNotAsked,
      setLoading,
      setFailure,
      setSuccess
    }
  ];
}

export function useFetchRemoteData(fetcher) {
  if (!fetcher)
    throw Error(
      "Please pass a Promise-returning function to useFetchRemoteData."
    );

  const [data, { setLoading, setSuccess, setFailure }] = useRemoteData();

  const runFetch = useCallback(async () => {
    setLoading();
    try {
      const json = await fetcher();
      setSuccess(json);
    } catch (error) {
      setFailure(error);
    }
  }, []);

  return [data, runFetch];
}
