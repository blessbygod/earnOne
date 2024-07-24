import { logger } from "../utils/logger.ts";

export function Logger(target: any, key: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;

	// rewrite origin method
	descriptor.value = function (...args: any[]) {
		originalMethod.apply(this, args);
	};

	return descriptor;
}

