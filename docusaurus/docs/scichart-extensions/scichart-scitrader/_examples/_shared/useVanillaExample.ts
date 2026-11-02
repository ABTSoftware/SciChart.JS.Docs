import * as React from "react";
import { SciFinanceChart } from "scichart-scitrader";
import { useSciTraderTheme } from "scichart-scitrader-react";

/** Anything a vanilla demo's draw function returns that needs tearing down. */
export interface ICleanup {
    cleanup(): void;
}

/**
 * Mount a vanilla (non-React) demo into a div: call `draw(container)` once, and `cleanup()` on the
 * result when the page unmounts — including when it unmounts before `draw` has finished.
 *
 * Returns a ref for the host div, the value `draw` resolved with (for toolbar buttons that drive
 * the chart), and any error it threw.
 */
export function useVanillaExample<T extends ICleanup>(
    draw: (container: HTMLDivElement) => Promise<T>
): { containerRef: React.RefObject<HTMLDivElement>; api: T | undefined; error: unknown } {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [api, setApi] = React.useState<T>();
    const [error, setError] = React.useState<unknown>();

    React.useEffect(() => {
        let disposed = false;
        let result: T | undefined;

        draw(containerRef.current)
            .then((value) => {
                result = value;
                if (disposed) {
                    value.cleanup();
                } else {
                    // For e2e specs and console poking; not part of the demo.
                    (window as unknown as { __example?: T }).__example = value;
                    setApi(value);
                }
            })
            .catch((e) => {
                console.error(e);
                if (!disposed) {
                    setError(e);
                }
            });

        return () => {
            disposed = true;
            result?.cleanup();
        };
        // `draw` is a module-level function in every demo; run once per mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep the demo's chart on the Sandbox theme: applied as soon as the chart exists, and again
    // whenever the header switch changes it. Demos return either a panel or `{ panel, … }`.
    const theme = useSciTraderTheme();
    React.useEffect(() => {
        const chart = financeApiOf(api);
        if (chart && chart.theme !== theme) {
            chart.setTheme(theme);
        }
    }, [api, theme]);

    return { containerRef, api, error };
}

function financeApiOf(api: unknown): SciFinanceChart | undefined {
    const value = api as { financeApi?: SciFinanceChart; panel?: { financeApi?: SciFinanceChart } } | undefined;
    return value?.financeApi ?? value?.panel?.financeApi;
}
