/**
 * @file config decorator
 */

import { getConfig } from '../utils/index.ts';

export function Config() {
	return function (target: any, key: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;
		const configPath = sessionStorage.getItem('configPath') || 'default';
		const config = getConfig(configPath);
		// 正常情况下，获取全局的配置传入
		// rewrite origin method
		descriptor.value = function (...args: any[]) {
			return originalMethod.apply(this, [config, ...args]);
		};

		return descriptor;
	}
}