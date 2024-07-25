/**
 * @file config decorator
 */

import {
	Config
} from '../types/index.ts';
import { getConfig } from '../utils/index.ts';

export function InjectConfig(originClass: Function) {
	const configPath = sessionStorage.getItem('configPath') || 'default';
	originClass.prototype.config = getConfig(configPath);
}