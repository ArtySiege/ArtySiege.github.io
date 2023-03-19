import { readable, Subscriber, writable } from 'svelte/store'

let checkedPermission = false
const hasPermission = writable(false)

const getRawOrientation = function (e?: DeviceOrientationEvent) {
  if (!e) {
    return { alpha: 0, beta: 0, gamma: 0 }
  } else {
    return { alpha: e.alpha, beta: e.beta, gamma: e.gamma }
  }
}

let firstReading = true
let baseOrientation = getRawOrientation()

type Orientation = {
  absolute: {
    alpha: any
    beta: any
    gamma: any
  }
  relative: {
    alpha: number
    beta: number
    gamma: number
  }
}

const getOrientationObject = (e?: DeviceOrientationEvent): Orientation => {
  const orientation = getRawOrientation(e)
  return {
    absolute: orientation,
    relative: {
      alpha: orientation.alpha - baseOrientation.alpha,
      beta: orientation.beta - baseOrientation.beta,
      gamma: orientation.gamma - baseOrientation.gamma,
    },
  }
}

const resetBaseOrientation = () => {
  // console.log("Resetting Base Orientation");
  requestPermission()
  firstReading = true
  baseOrientation = getRawOrientation()
}

const handleOrientation = (e: DeviceOrientationEvent, set: Subscriber<Orientation>) => {
  window.requestAnimationFrame(() => {
    if (firstReading) {
      firstReading = false
      baseOrientation = getRawOrientation(e)
      // console.log("Starting Orientation from: ", baseOrientation );
    }

    const o = getOrientationObject(e)
    // console.log("Setting Orientation to: ", o );
    set(o)
  })
}

// TODO: Storing this here is probably bad practice
let orientationSet: Subscriber<Orientation>

const orientation = readable(getOrientationObject(), (set) => {
  orientationSet = set
  return function stop() {
    window.removeEventListener('deviceorientation', (e) => handleOrientation(e, set), true)
    // console.log('Stopping Orientation Tracking')
  }
})

const requestPermission = () => {
  // console.log('requesting perms')
  if (!checkedPermission) {
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      checkedPermission = true
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response == 'granted') {
            hasPermission.set(true)
            // console.log('Granted permission')
          }
        })
        .catch(console.error)
    } else {
      checkedPermission = true
      // console.log('Granted permission')
      hasPermission.set(true)
    }

    if (hasPermission) {
      window.addEventListener('deviceorientation', (e) => handleOrientation(e, orientationSet), true)
    }
  }
}

const isSafari =
  navigator.vendor &&
  navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') == -1 &&
  navigator.userAgent.indexOf('FxiOS') == -1

export { orientation, resetBaseOrientation, requestPermission, isSafari }
