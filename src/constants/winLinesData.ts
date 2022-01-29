import { STRIPE_SIZE } from "./constants"

export const WIN_LINES_DATA= [
    {
		"lineGroup": 0,
		"lineMatrixBool": [
			[false, false, false, false, false],
			[true, true, true, true, true],
			[false, false, false, false, false],
		],
        "winPositions": [1, 1, 1, 1, 1]
    },
	{
		"lineGroup": 0,
		"lineMatrixBool": [
			[true, true, true, true, true],
			[false, false, false, false, false],
			[false, false, false, false, false]
		],
        "winPositions": [0, 0, 0, 0, 0]
    },
	{
		"lineGroup": 0,
		"lineMatrixBool": [
			[false, false, false, false, false],
			[false, false, false, false, false],
			[true, true, true, true, true]
		],
        "winPositions": [2, 2, 2, 2, 2]
    },
	{
		"lineGroup": 0,
		"lineMatrixBool": [
			[true, false, false, false, true],
			[false, true, false, true, false],
			[false, false, true, false, false]
		],
        "winPositions": [0, 1, 2, 1, 0]
    },
	{
		"lineGroup": 0,
		"lineMatrixBool": [
			[false, false, true, false, false],
			[false, true, false, true, false],
			[true, false, false, false, true]
		],
        "winPositions": [2, 1, 0, 1, 2]
    },
	{
		"lineGroup": 1,
		"lineMatrixBool": [
			[true, true, false, false, false],
			[false, false, true, false, false],
			[false, false, false, true, true]
		],
        "winPositions": [0, 0, 1, 2, 2]
    },
	{
		"lineGroup": 1,
		"lineMatrixBool": [
			[false, false, false, true, true],
			[false, false, true, false, false],
			[true, true, false, false, false]
		],
        "winPositions": [2, 2, 1, 0, 0]
    },
	{
		"lineGroup": 2,
		"lineMatrixBool": [
			[false, true, false, false, false],
			[true, false, true, false, true],
			[false, false, false, true, false]
		],
        "winPositions": [1, 0, 1, 2, 1]
    },
	{
		"lineGroup": 3,
		"lineMatrixBool": [
			[false, false, false, true, false],
			[true, false, true, false, true],
			[false, true, false, false, false]
		],
        "winPositions": [1, 2, 1, 0, 1]
    },
	{
		"lineGroup": 2,
		"lineMatrixBool": [
			[true, false, false, false, false],
			[false, true, true, true, false],
			[false, false, false, false, true]
		],
        "winPositions": [0, 1, 1, 1, 2]
    },
	{
		"lineGroup": 3,
		"lineMatrixBool": [
			[false, false, false, false, true],
			[false, true, true, true, false],
			[true, false, false, false, false]
		],
        "winPositions": [2, 1, 1, 1, 0]
    },
	{
		"lineGroup": 3,
		"lineMatrixBool": [
			[false, true, true, false, false],
			[true, false, false, true, false],
			[false, false, false, false, true]
		],
        "winPositions": [1, 0, 0, 1, 2]
    },
	{
		"lineGroup": 2,
		"lineMatrixBool": [
			[false, false, false, false, true],
			[true, false, false, true, false],
			[false, true, true, false, false]
		],
        "winPositions": [1, 2, 2, 1, 0]
    },
	{
		"lineGroup": 1,
		"lineMatrixBool": [
			[false, false, true, false, false],
			[true, true, false, true, false],
			[false, false, false, false, true]
		],
        "winPositions": [1, 1, 0, 1, 2]
    },
	{
		"lineGroup": 4,
		"lineMatrixBool": [
			[false, false, false, false, true],
			[true, true, false, true, false],
			[false, false, true, false, false]
		],
        "winPositions": [1, 1, 2, 1, 0]
    },
	{
		"lineGroup": 4,
		"lineMatrixBool": [
			[true, true, false, false, false],
			[false, false, true, false, true],
			[false, false, false, true, false]
		],
        "winPositions": [0, 0, 1, 2, 1]
    },
	{
		"lineGroup": 4,
		"lineMatrixBool": [
			[false, false, false, true, false],
			[false, false, true, false, true],
			[true, true, false, false, false]
		],
        "winPositions": [2, 2, 1, 0, 1]
    },
	{
		"lineGroup": 0,
		"lineMatrixBool": [
			[false, true, false, false, false],
			[true, false, true, false, false],
			[false, false, false, true, true]
		],
        "winPositions": [1, 0, 1, 2, 2]
    },
	{
		"lineGroup": 2,
		"lineMatrixBool": [
			[false, false, false, true, true],
			[true, false, true, false, false],
			[false, true, false, false, false]
		],
        "winPositions": [1, 2, 1, 0, 0]
    },
	{
		"lineGroup": 4,
		"lineMatrixBool": [
			[true, true, true, false, false],
			[false, false, false, true, false],
			[false, false, false, false, true]
		],
        "winPositions": [0, 0, 0, 1, 2]
    }
]

export const LINE_OFFSETS= [0, STRIPE_SIZE/8, -STRIPE_SIZE/8, 2*STRIPE_SIZE/8, -2*STRIPE_SIZE/8]
export const LINE_COLORS= [0xC70000, 0x0300C7, 0xFCEC00, 0x14C400, 0xFA00E5]