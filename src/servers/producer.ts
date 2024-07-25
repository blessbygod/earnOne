/**
 * @file 生产者
 *
 */

import { InjectConfig } from "../decorators/config.ts";

import EventEmitter from "https://deno.land/x/events@v1.0.0/mod.ts";
import { Config } from "../types/config.ts";

@InjectConfig
class Producer extends EventEmitter { // 通过多重继承的方式，将 Config 的属性注入到 Producer 中
	public config!: Config;

	public constructor() {
		super();
	}

}

export default Producer;