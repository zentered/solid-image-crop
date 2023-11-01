import { createSignal } from 'solid-js'
import ImageUploadDialog from 'solid-image-crop'

function App() {
  const [isOpen, setIsOpen] = createSignal(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  async function saveImage(file) {
    // Upload the image to your server
    console.log(file)
  }

  return (
    <>
      <div class="bg-white py-24 px-6 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Image Upload Dialog
          </h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            <button
              type="button"
              onClick={openModal}
              class="rounded-md bg-indigo-50 py-2.5 px-3.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
            >
              Open Dialog
            </button>
          </p>
        </div>
      </div>
      <ImageUploadDialog
        title="Upload your logo"
        isOpen={isOpen}
        closeModal={closeModal}
        openModal={openModal}
        saveImage={saveImage}
      />
    </>
  )
}

export default App
