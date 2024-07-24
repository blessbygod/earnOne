import { LevelName } from "https://deno.land/std@0.182.0/log/mod.ts";

export type Config = {
	name: string;
	logger: {
		level: LevelName
	}
}