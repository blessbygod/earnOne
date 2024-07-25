/***
 * @desc: deno puppeteer
 * @comment
 * 1、 chrome会提示手动自动测试软件的控制
 * 2、 用es.sh/@chrome-launcher也解决不了问题，有的方法没有对deno实现，toDenoStdio
 * 3、 先关注gateio等api交易所吧
 */

import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { logger } from "../utils/logger.ts";
import { noop, sleep } from '../utils/index.ts';
import { Config } from "../types/config.ts";
import EventEmitter from "https://deno.land/x/events@v1.0.0/mod.ts";
import { Browser } from "https://deno.land/x/puppeteer@16.2.0/vendor/puppeteer-core/puppeteer/common/Browser.js";
import { Page } from "https://deno.land/x/puppeteer@16.2.0/vendor/puppeteer-core/puppeteer/common/Page.js";


export class Puppeteer extends EventEmitter {
	url!: string;
	browser!: Browser;
	pages!: Page[];
	page!: Page;

	constructor(public port = 8888) {
		super();
		this.url = `http://127.0.0.1:${port}`;
	}

	async initPage() {
		let resp = {
			text: noop
		}, browserWSEndpoint = '';
		try {
			resp = await fetch(this.url);
			browserWSEndpoint = await resp.text();
			this.browser = await puppeteer.connect({ browserWSEndpoint, ignoreHTTPSErrors: true });
		} catch (ex) {
			logger.error([`webAPI依赖的浏览器实例初始化失败,`, ex.message]);
		}
	}

	async initThisPage(url: string) {
		this.pages = await this.browser.pages();
		const pages: Page[] = [];
		for (let idx = 0; idx < this.pages.length; idx++) {
			const page = this.pages[idx] as Page;
			const pageUrl = await page.url();
			if (pageUrl === url) {
				pages.push(page);
				break;
			}
		}

		this.page = pages.length ? pages[0] : this.pages[0];
	}

	async goToFuturePage(page: Page, url: string, config: Config) {
		await page.goto(url);
		await page.setDefaultNavigationTimeout(0);
		await page.bringToFront();
		if (config.market.enableWebWsListen) {
			this.onListenWebSocket(page);
		}
	}

	async onListenWebSocket(page: Page) {
		const client = await page.target().createCDPSession();
		await client.send('Network.enable');
		client.on('Network.webSocketFrameReceived', (params: any) => {
			this.emit('puppeteer:wsMessage', params);
		});

	}

	async replacePage(url: string, config: Config) {
		await this.initThisPage(url);
		const page = await this.browser.newPage();
		this.pages = await this.browser.pages();
		this.pages.forEach(_page => {
			_page.setViewport({
				width: 1620,
				height: 1080
			});
		})
		await this.goToFuturePage(page, url, config);
		const pageUrl = await this.page.url();
		if (pageUrl === url) {
			this.page?.close();
		}
		this.page = page;
		return this.page;

	}

	setTitle(configPath: string) {
		// 监听页面title变化，修改为显示acc-1, acc-2, acc-3, acc-4
		this.page.evaluate((configPath) => {
			const $title = document.querySelector('title');
			new MutationObserver(function (mutations) {
				const text = $title?.textContent;
				if (text?.includes('acc') === false) {
					$title.textContent = configPath;
				}
			}).observe(
				$title,
				{ subtree: true, characterData: true, childList: true }
			)
		}, configPath);
	}
}