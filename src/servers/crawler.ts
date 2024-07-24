// 引入Deno的fetch API
import { DOMParser, HTMLElement, HTMLTableCellElement } from "https://esm.sh/linkedom";

async function fetchPageTitle(url: string) {
	try {
		// 发送HTTP GET请求
		const response = await fetch(url);
		const text = await response.text();

		// 使用DOMParser解析HTML
		const parser = new DOMParser();
		const doc = parser.parseFromString(text, "text/html");

		// 寻找match <td class="left textNum sentiment noWrap" title="重要性较高" data-img_key="bull3"><i class="grayFullBullishIcon"></i><i class="grayFullBullishIcon"></i><i class="grayFullBullishIcon"></i></td>的tr
		const tds = doc.querySelectorAll("td.left.textNum.sentiment.noWrap");
		// 继续寻找td里面的3个i的class都为grayFullBullishIcon的情况
		const trs = Array.from(tds).filter((td: any) => {
			const icons = td.querySelectorAll("i.grayFullBullishIcon");
			return icons.length === 3;
		}).map((td: any) => td.parentElement);

		// 继续查找tr里面的td的class为fore的样式，和td的class为prev的，还有td包含title有值的那个
		const foreTds = trs.map((tr: HTMLElement) => {
			const foreTd = tr.querySelector("td.fore");
			const prevTd = tr.querySelector("td.prev");
			const titleTd = tr.querySelector(`td.event`);
			return [foreTd.textContent, prevTd.textContent, titleTd.getAttribute('title')];
		});

		console.log(foreTds);

	} catch (error) {
		console.error("Error fetching or parsing the page:", error);
	}
}

// 使用示例
console.log(await fetchPageTitle("https://cn.investing.com/economic-calendar/"));