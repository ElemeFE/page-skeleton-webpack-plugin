export const addBlick = () => {
  const style = document.createElement('style')
  const styleContent = `
      @keyframes blink {
        0% {
          opacity: .4;
        }

        50% {
          opacity: 1;
        }

        100% {
          opacity: .4;
        }
      }
      .blink {
        animation-duration: 2s;
        animation-name: blink;
        animation-iteration-count: infinite;
      }
    `
  style.innerHTML = styleContent
  document.head.appendChild(style)
  document.body.firstElementChild.classList.add('blink')
}

export const addShine = () => {
  const style = document.createElement('style')
  const styleContent = `
      body {
        overflow: hidden;
      }
      @keyframes flush {
        0% {
          left: -100%;
        }
        50% {
          left: 0;
        }
        100% {
          left: 100%;
        }
      }
      .sk-loading {
        animation: flush 2s linear infinite;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background: linear-gradient(to left, 
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, .85) 50%,
          rgba(255, 255, 255, 0) 100%
        )
      }
    `
  style.innerHTML = styleContent
  const load = document.createElement('div')
  load.classList.add('sk-loading')
  document.head.appendChild(style)
  document.body.appendChild(load)
}

export const addSpin = () => {
  const style = document.createElement('style')
  const styleContent = `
      @keyframes loading-rotate {
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes loading-dash {
        0% {
          stroke-dasharray: 1, 200;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -40px;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -120px;
        }
      }

      .sk-loading-spinner {
        top: 50%;
        margin-top: -0.5rem;
        width: 100%;
        text-align: center;
        position: absolute;
      }

      .sk-loading-spinner .circular {
        height: 1rem;
        width: 1rem;
        animation: loading-rotate 2s linear infinite;
      }

      .sk-loading-spinner .path {
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90,150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: #409eff;
        stroke-linecap: round;
      }
    `
  style.innerHTML = styleContent
  document.head.appendChild(style)
  const spinContainer = document.createElement('div')
  spinContainer.classList.add('sk-loading-spinner')
  spinContainer.innerHTML = `<svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>`
  document.body.appendChild(spinContainer)
}
