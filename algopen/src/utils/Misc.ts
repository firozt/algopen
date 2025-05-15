/*
    General purpose functions used throughout the project
*/


/**
 * Gets the height of a node within a binary tree, array format
 *
 * @param index - index of the node within the array
 * @returns height of node specified at index
 */
export function getLevel(index: number): number {
    return Math.floor(Math.log2(index + 1));
}



/**
 * Generates random number between lower and upperbound (inclusive)
 *
 * @param lower - lower bound (inclusive)
 * @param upper - upper bound (inclusive)
 * @returns height of node specified at index
 */

export function randomInt(lower: number,upper: number){
	return Math.floor(Math.random()*(upper-lower))+lower
}

