export function PerformanceMonitor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;

	descriptor.value = function (...args: any[]) {
		console.time(propertyKey); // 开始计时

		const result = originalMethod.apply(this, args);

		console.timeEnd(propertyKey); // 结束计时

		return result;
	};

	return descriptor;
}