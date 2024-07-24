// Usage: import { noop, between, animate } from './utils/tools';

export function noop(...args: any): any { console.debug(args) }

export async function animate(callback = noop, timeInterval = 1000, reduceObj?: Record<string, number>, reduceKey = 'closeCount') {
	let timer = 0, isCanceled = false;

	async function recursive() {
		if (!isCanceled) {
			let nextDisabled = false;
			nextDisabled = await callback();
			timeInterval = reduceObj ? (2 * reduceObj[reduceKey]) * timeInterval : timeInterval;

			if (!nextDisabled) {
				timer = setTimeout(recursive, timeInterval);
			}
		}
	}

	await recursive();

	return {
		clear() {
			if (timer) {
				isCanceled = true;
				clearTimeout(timer);
			}
		}
	}
}
export async function sleep(millions = 1000) {
	return await new Promise((resolve) => {
		setTimeout(() => {
			resolve(0);
		}, millions);
	});
}

export function deepMerge(
	...objects: Record<string, any>[]
): Record<string, any> {
	const isObject = (obj: any) => obj && typeof obj === "object";

	return objects.reduce(
		(prev: Record<string, any>, obj: Record<string, any>) => {
			Object.keys(obj).forEach((key) => {
				const pVal = prev[key];
				const oVal = obj[key];

				if (Array.isArray(pVal) && Array.isArray(oVal)) {
					// prev[key] = pVal.concat(...oVal);  // Array不要merge
					prev[key] = oVal;
				} else if (isObject(pVal) && isObject(oVal)) {
					prev[key] = deepMerge(pVal, oVal);
				} else {
					prev[key] = oVal;
				}
			});

			return prev;
		},
		{},
	);
}