/***
 * @file: 数据提供服务
 * @author ls
 * @date 2024-07-25
 * @comment
 */

class Data {
	private static instance: Data;
	private data: any;
	private constructor() {
		this.data = {};
	}
	public static getInstance(): Data {
		if (!Data.instance) {
			Data.instance = new Data();
		}
		return Data.instance;
	}
	public setData(key: string, value: any): void {
		this.data[key] = value;
	}

}