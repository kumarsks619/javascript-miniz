const video = document.querySelector('.player')
const canvas = document.querySelector('.photo')
const ctx = canvas.getContext('2d')
const strip = document.querySelector('.strip')
const snap = document.querySelector('.snap')
let interval = null

const getVideo = () => {
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((localMediaStream) => {
            video.srcObject = localMediaStream
            video.play()
        })
        .catch(() => {
            alert('Camera is required!')
        })
}

const paintToCanvas = (effect) => {
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width
    canvas.height = height

    clearInterval(interval)
    interval = setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)
        let pixels = ctx.getImageData(0, 0, width, height) // take the pixels out
        if (effect) {
            pixels = effect(pixels) // mess with pixels
        }
        ctx.putImageData(pixels, 0, 0) // put the pixels back
    }, 16)
}

const takePhoto = () => {
    // play the capture sound
    snap.currentTime = 0
    snap.play()

    // take data out of the canvas in form of image
    const data = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a')
    link.href = data
    link.setAttribute('download', 'fun-webcam')
    link.innerHTML = `<img src=${data} alt="Your Picture" />`
    strip.insertBefore(link, strip.firstChild)
}

const redEffect = (pixels) => {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100 // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50 // green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // blue
    }
    return pixels
}

const rgbSplit = (pixels) => {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 200] = pixels.data[i + 0] // red
        pixels.data[i + 100] = pixels.data[i + 1] // green
        pixels.data[i - 200] = pixels.data[i + 2] // blue
    }
    return pixels
}

const applyRedEffect = () => paintToCanvas(redEffect)

const applyRGBsplit = () => paintToCanvas(rgbSplit)

const applyGhostEffect = () => (ctx.globalAlpha = 0.1)

const removeEffect = () => paintToCanvas()

getVideo()
video.addEventListener('canplay', paintToCanvas)