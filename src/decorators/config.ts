/**
 * @file config decorator
 */

import {
	Config
} from '../types/index.ts';
import { getConfig } from '../utils/index.ts';

export function InjectConfig<T extends { new(...args: any[]): {} }>(originClass: T) {
	const configPath = sessionStorage.getItem('configPath') || 'default';
	const ConfigClass = class extends originClass {
		public config: Config = getConfig(configPath);

		constructor(...args: any[]) {
			super(...args);
		}
	};

	return ConfigClass;
}