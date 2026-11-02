import * as React from "react";
import { loadSampleData } from "../sampleData";

/** React demos: `true` once the sample CSV exchange is registered and a chart can be created. */
export function useSampleData(): { loaded: boolean; error: unknown } {
    const [loaded, setLoaded] = React.useState(false);
    const [error, setError] = React.useState<unknown>();

    React.useEffect(() => {
        let live = true;
        loadSampleData().then(
            () => live && setLoaded(true),
            (e) => live && setError(e)
        );
        return () => {
            live = false;
        };
    }, []);

    return { loaded, error };
}
