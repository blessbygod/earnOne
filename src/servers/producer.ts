/**
 * @file 生产者
 *
 */

import { InjectConfig } from "../decorators/config.ts";

import EventEmitter from "https://deno.land/x/events@v1.0.0/mod.ts";

@InjectConfig
class Producer extends EventEmitter {
	private static instance: Producer;
	private constructor() {
		super();
	}

	public static getInstance(): Producer {
		if (!Producer.instance) {
			Producer.instance = new Producer();
		}
		return Producer.instance;
	}
	public produce(message: string): void {
		this.emit('message', message);
	}

}

export default Producer;