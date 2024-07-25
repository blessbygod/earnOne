/**
 * @file 根据加密货币的价格数组prices和时间数组times计算斜率
 * @date 2024-07-25
 * @comment
 */

export function slope(prices: number[], times: number[]): number {
	const n = prices.length;
	const sumX = times.reduce((sum, x) => sum + x, 0);
	const sumY = prices.reduce((sum, y) => sum + y, 0);
	const sumXY = times.reduce((sum, x, i) => sum + x * prices[i], 0);
	const sumXX = times.reduce((sum, x) => sum + x * x, 0);
	const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	return slope;
}