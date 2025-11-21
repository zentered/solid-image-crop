import {
  createEffect,
  createSignal,
  Show,
  on,
  untrack
} from 'solid-js'
import { createStore } from 'solid-js/store'
import 'cropperjs'
import { Icon } from 'solid-heroicons'
import { cloudArrowUp, photo } from 'solid-heroicons/solid'

/**
 * ImageDrop component provides a drag-and-drop interface for uploading and cropping images.
 *
 * @param {Object} props - Component props
 * @param {Function} props.saveImage - Callback function called when the user saves the cropped image. Receives the state object containing error, loading, file, and croppedImage.
 * @param {number} [props.aspectRatioWidth=1] - Initial aspect ratio width
 * @param {number} [props.aspectRatioHeight=1] - Initial aspect ratio height
 * @param {string[]} [props.acceptedFileTypes=['image/jpeg', 'image/png', 'image/webp', 'image/gif']] - Array of accepted file MIME types
 * @param {number} [props.maxFileSizeMB=10] - Maximum file size in megabytes
 * @param {Function} [props.onError] - Optional callback function called when an error occurs. Receives the error message as a string.
 * @returns {JSX.Element} The ImageDrop component
 */
export default function ImageDrop(props) {
  let cropperImage
  let cropperSelection

  // Set default values for validation props
  const acceptedFileTypes = props.acceptedFileTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxFileSizeMB = props.maxFileSizeMB || 10
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024

  const [state, setState] = createStore({
      error: null,
      loading: false,
      file: {},
      croppedImage: null
    }),
    [aspectRatioWidth, setAspectRatioWidth] = createSignal(1),
    [aspectRatioHeight, setAspectRatioHeight] = createSignal(1),
    [dropZoneActive, setDropZoneActive] = createSignal(false),
    [uploading, setUploading] = createSignal(false),
    [preview, setPreview] = createSignal(null),
    noPropagate = (e) => {
      e.preventDefault()
    },
    handleError = (message) => {
      setState('error', message)
      if (props.onError) {
        props.onError(message)
      }
    },
    uploadFile = async (file) => {
      if (!file) return

      // Reset error state
      setState('error', null)

      // Validate file type
      if (!acceptedFileTypes.includes(file.type)) {
        const message = `Invalid file type. Please upload one of: ${acceptedFileTypes.join(', ')}`
        handleError(message)
        return
      }

      // Validate file size
      if (file.size > maxFileSizeBytes) {
        const message = `File size exceeds ${maxFileSizeMB}MB limit. Current file: ${(file.size / 1024 / 1024).toFixed(2)}MB`
        handleError(message)
        return
      }

      setUploading(true)
      setState('loading', true)
      setState('file', file)
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target.result)
        }
        reader.readAsDataURL(file)
      } catch (e) {
        console.error('upload failed', e)
        const message = e instanceof Error ? e.message : String(e)
        handleError(message)
      }
      setState('loading', false)
      setUploading(false)
    },
    setAspectRatio = (width, height) => {
      setAspectRatioWidth(width)
      setAspectRatioHeight(height)
      if (cropperSelection) {
        cropperSelection.aspectRatio = aspectRatioWidth() / aspectRatioHeight()
      }
    },
    handleFileDrop = async (e) => {
      e.preventDefault()
      setDropZoneActive(false)
      uploadFile(e.dataTransfer.files[0])
    },
    handleFileInput = async (e) => {
      e.preventDefault()
      uploadFile(e.currentTarget.files[0])
    }

  createEffect(() => {
    if (props.aspectRatioWidth >= 1 && props.aspectRatioHeight >= 1) {
      setAspectRatio(props.aspectRatioWidth, props.aspectRatioHeight)
    }
  })

  createEffect(
    on(preview, () => {
      if (cropperImage && preview()) {
        cropperImage.src = preview()
      }
    })
  )

  return (
    <>
      <Show when={preview() !== null}>
        <div>
          <div>
            <cropper-canvas background class="">
              <cropper-image
                ref={cropperImage}
                rotatable
                scalable
                skewable
                translatable
                alt="cropper"
              />
              <cropper-handle action="select" plain />
              <cropper-selection
                ref={cropperSelection}
                initial-coverage="0.5"
                dynamic
                movable
                resizable
                zoomable
              >
                <cropper-grid role="grid" covered></cropper-grid>
                <cropper-crosshair centered></cropper-crosshair>
                <cropper-handle
                  action="select"
                  theme-color="rgba(255, 255, 255, 0.35)"
                ></cropper-handle>
                <cropper-handle action="n-resize"></cropper-handle>
                <cropper-handle action="e-resize"></cropper-handle>
                <cropper-handle action="s-resize"></cropper-handle>
                <cropper-handle action="w-resize"></cropper-handle>
                <cropper-handle action="ne-resize"></cropper-handle>
                <cropper-handle action="nw-resize"></cropper-handle>
                <cropper-handle action="se-resize"></cropper-handle>
                <cropper-handle action="sw-resize"></cropper-handle>
              </cropper-selection>
            </cropper-canvas>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2"
            onClick={async () => {
              setState(
                'croppedImage',
                await cropperSelection()
                  ?.$toCanvas()
                  .then((canvas) => {
                    return canvas.toDataURL(untrack(state).file.type)
                  })
              )
              props.saveImage(state)
            }}
          >
            <Icon
              path={cloudArrowUp}
              class="-ml-0.5 h-5 w-5"
              aria-hidden="true"
            />
            Save
          </button>
        </div>
      </Show>
      <Show when={preview() === null}>
        <form class="min-h-96 min-w-96">
          <div
            id="dropzone"
            class={`${dropZoneActive() ? 'bg-green-100' : ''} ${
              uploading() && 'opacity-50'
            } place-content-center place-items-center h-96 w-96 border-2 border-gray-300 border-dashed rounded-md sm:flex p-2 m-2`}
            onDragEnter={() =>
              uploading() ? undefined : setDropZoneActive(true)
            }
            onDragLeave={() => setDropZoneActive(false)}
            onDragOver={noPropagate}
            onDrop={(event) =>
              uploading() ? noPropagate(event) : handleFileDrop(event)
            }
          >
            <div class="">
              <Icon path={photo} class="h-48 w-48 text-gray-300" />
            </div>
            <input
              id="image-upload"
              name="file"
              type="file"
              accept={acceptedFileTypes.join(',')}
              disabled={uploading()}
              multiple={false}
              onInput={handleFileInput}
              class="sr-only"
            />
          </div>
          <Show when={state.error}>
            <div class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p class="text-sm">{state.error}</p>
            </div>
          </Show>
          <div class="h-8" />
        </form>
      </Show>
    </>
  )
}
