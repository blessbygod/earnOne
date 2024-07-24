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
	const __config = deepMerge({}, localConfig, readJSON(`./config/${configPath}.json`));
	openLog && console.info(`load config from ${configPath}: `, __config);
	return __config as Config;
}

