import { useEffect, useRef } from "react";

export function useInitVadPause(vad: any, setVadPaused: (val: boolean) => void) {
	const initialPauseDone = useRef(false);

	useEffect(() => {
		if (!vad.loading && !vad.errored && !initialPauseDone.current) {
			vad.pause();
			setVadPaused(true);
			initialPauseDone.current = true;
		}
	}, [vad.loading, vad.errored, vad, setVadPaused]);
}
