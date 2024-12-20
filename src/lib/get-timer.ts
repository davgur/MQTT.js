import isBrowser, { isWebWorker, isReactNativeBrowser } from './is-browser'
import { clearInterval as clearI, setInterval as setI } from 'worker-timers'
import type { TimerVariant } from './shared'
import * as BackgroundTimer from 'react-native-background-timer'

// don't directly assign globals to class props otherwise this throws in web workers: Uncaught TypeError: Illegal invocation
// See: https://stackoverflow.com/questions/9677985/uncaught-typeerror-illegal-invocation-in-chrome

export interface Timer {
	set: typeof setI
	clear: typeof clearI
}

const workerTimer: Timer = {
	set: setI,
	clear: clearI,
}

const nativeTimer: Timer = {
	set: (func, time) => {
		console.log('get timer use BackgroundTimer')
		return BackgroundTimer.setInterval(func, time)
	},
	clear: (timerId) => BackgroundTimer.clearInterval(timerId),
}

const getTimer = (variant: TimerVariant): Timer => {
	switch (variant) {
		case 'native': {
			return nativeTimer
		}
		case 'worker': {
			return workerTimer
		}
		case 'auto':
		default: {
			return isBrowser && !isWebWorker && !isReactNativeBrowser
				? workerTimer
				: nativeTimer
		}
	}
}

export default getTimer
