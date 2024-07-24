import { LogLevels } from "https://deno.land/std@0.182.0/log/levels.ts";
import { logger } from "../utils/logger.ts";

type LogLevelsWithoutNotSet = Exclude<LogLevels, LogLevels.NOTSET>;

// 将 LogLevelsWithoutNotSet 成员转换为小写字符串
function logLevelToString(logLevel: LogLevelsWithoutNotSet): "debug" | "info" | "warning" | "error" | "critical" {
	switch (logLevel) {
		case LogLevels.DEBUG:
			return "debug";
		case LogLevels.INFO:
			return "info";
		case LogLevels.WARNING:
			return "warning";
		case LogLevels.ERROR:
			return "error";
		case LogLevels.CRITICAL:
			return "critical";
		default:
			return "info";
	}
}


// 为了方便调用，我们可以定义一个装饰器函数Log
export function Log(logType: LogLevelsWithoutNotSet = LogLevels.INFO) {
	return function (target: any, key: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;
		const logTypeString = logLevelToString(logType);
		// rewrite origin method
		descriptor.value = function (...args: any[]) {
			logger[logTypeString](`Calling Method {${key}} with arguments: [${args}]`);
			const result = originalMethod.apply(this, args);
			logger[logTypeString](`Executed {${key}}, result: ${result}`);

		};

		return descriptor;
	}
}