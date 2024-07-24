
export function tryCatch(target: any, key: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;

	// rewrite origin method
	descriptor.value = function (...args: any[]) {
		try {
			// 调用原始方法
			return originalMethod.apply(this, args);
		} catch (error) {
			console.error(`Caught an error in method ${key}:`, error);
		}
	};

	return descriptor;
}

