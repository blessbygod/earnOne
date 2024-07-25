/**
 * @file 生产者
 *
 */

import EventEmitter from "https://deno.land/x/events@v1.0.0/mod.ts";

class Producer extends EventEmitter {
	private static instance: Producer;

	@Config
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