/**
 * @description: logger with file and console handler
 *
 *
 */

import { ensureDir } from "https://deno.land/std@0.180.0/fs/mod.ts";
import { getLogger, LogRecord } from "https://deno.land/std@0.182.0/log/mod.ts";
import { ConsoleHandler, FileHandler } from "https://deno.land/std@0.182.0/log/handlers.ts";
import moment from "moment";
import { getConfig } from "./config.ts";
import { animate } from "./tools.ts";
import { DateTimeFormat, Config } from "../types/index.ts";

// if logs, csvs folder not exists, create it
await ensureDir("./logs");
await ensureDir("./csvs");

let consoleHandler!: ConsoleHandler,
	fileHandler!: FileHandler,
	errorHandler!: FileHandler,
	warningHandler!: FileHandler;

function getConsoleHandler(config: Config) {
	if (consoleHandler) {
		consoleHandler.destroy();
	}
	consoleHandler = new ConsoleHandler(config.logger.level, {
		formatter: (logRecord: LogRecord) => {
			const timestamp = moment().format(DateTimeFormat.YMDHMSS);
			return `[${timestamp}], ${logRecord.msg}`;
		},
	});
	consoleHandler.setup();
	return consoleHandler;
}

function getFileHandler(config: Config) {
	if (fileHandler) {
		fileHandler.destroy();
	}
	fileHandler = new FileHandler(config.logger.level, {
		filename: `./logs/${moment().format(DateTimeFormat.YMD)}-${config.name}.log`,
		formatter: (logRecord: LogRecord) => {
			const timestamp = moment().format(DateTimeFormat.YMDHMSS);
			return `[${timestamp}], ${logRecord.msg}`;
		},
	});
	fileHandler.setup();
	return fileHandler;
}

function getErrorHandler(config: Config) {
	if (errorHandler) {
		errorHandler.destroy();
	}
	errorHandler = new FileHandler('ERROR', {
		filename: `./logs/${moment().format(DateTimeFormat.YMD)}.error.log`,
		formatter: (logRecord: LogRecord) => {
			const timestamp = moment().format(DateTimeFormat.YMDHMSS);
			return `[${timestamp}], ${logRecord.msg}`;
		},
	});
	errorHandler.setup();
	return errorHandler;
}
// 用warning日志来做分析
function getWarningHandler(config: Config) {
	if (warningHandler) {
		warningHandler.destroy();
	}
	warningHandler = new FileHandler('CRITICAL', {
		filename: `./csvs/${moment().format(DateTimeFormat.YMD)}.csv`,
		formatter: (logRecord: LogRecord) => {
			const timestamp = moment().format(DateTimeFormat.YMDHMSS);
			return `[${timestamp}], ${logRecord.msg}`;
		},
	});
	warningHandler.setup();
	return warningHandler;
}

const logger = getLogger();

// 每隔一段时间检查日期是否发生变化，如果发生变化则创建新的日志文件
setTimeout(() => {
	animate(async () => {
		const configName = sessionStorage.getItem('configName') ?? 'acc-1';
		const config: Config = await getConfig(configName);
		config.name = configName;
		if (!config.name) return;
		logger.handlers = [
			await getConsoleHandler(config),
			await getFileHandler(config),
			await getErrorHandler(config),
			await getWarningHandler(config)
		]
	}, 60 * 1000);
}, 200);

export {
	logger
}