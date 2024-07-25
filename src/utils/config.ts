/**
 * @desc Configs
 * @date 2023/03/16 13:51
 *
 */

import { deepMerge } from '../utils/tools.ts';
import * as mod from "https://deno.land/std@0.193.0/jsonc/mod.ts";
import { existsSync } from "https://deno.land/std@0.224.0/fs/exists.ts";
import {
	Config
} from '../types/index.ts';

export const configMap: {
	[x: string]: Config
} = {};

// 读取json文件， 如果没有，则读取jsonc文件
export function readJSON(filePath: string) {
	let json = {};
	const isExists = existsSync(filePath);
	let fileText = '';
	try {
		if (isExists) {
			fileText = Deno.readTextFileSync(filePath);
		} else {
			fileText = Deno.readTextFileSync(filePath.replace('.json', '.jsonc'));
		}
		json = mod.parse(fileText) || '{}';
	} catch (ex) {
		console.error(ex.message);
	}
	return json;
}


const localConfig = readJSON('./config/default.jsonc');


export function getConfig(configPath = 'default', openLog = false) {
	// 如果当前路径下的配置文件已经获取过一次，直接返回反序列化的对象
	if (configMap[configPath]) {
		return configMap[configPath];
	}

	const __config = deepMerge({}, localConfig, readJSON(`./config/${configPath}.json`));
	configMap[configPath] = __config as Config;
	openLog && console.info(`load config from ${configPath}: `, __config);

	return configMap[configPath];
}
