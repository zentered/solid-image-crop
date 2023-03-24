import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  DialogOverlay
} from 'solid-headless'
import { createStore } from 'solid-js/store'
import ImageDrop from './ImageDrop.jsx'

export default function ImageUploadDialog(props) {
  const [state, setState] = createStore({
    error: null,
    loading: false,
    file: {}
  })

  return (
    <Transition appear show={props.isOpen()}>
      <Dialog
        isOpen
        class="fixed inset-0 z-10 overflow-y-auto"
        onClose={props.closeModal}
      >
        <div class="min-h-screen px-4 flex items-center justify-center">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogOverlay class="fixed inset-0 bg-gray-900 bg-opacity-50" />
          </TransitionChild>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                {props.title}
              </DialogTitle>
              <ImageDrop saveImage={props.saveImage} setState={setState} />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
