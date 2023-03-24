<p align="center">
  <img src=".github/assets/header.png">
</p>

# Solid Image Crop

Solid.js simple image crop tool using
[Cropper.js](https://github.com/fengyuanchen/cropperjs).

## Installation

    pnpm i @zentered/solid-image-crop
    # or npm install @zentered/solid-image-crop
    # or yarn add @zentered/solid-image-crop

## Usage

```jsx
import { createSignal } from 'solid-js'
import ImageUploadDialog from '@zentered/solid-image-crop'

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
      <button type="button" onClick={openModal}>
        Open Dialog
      </button>
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
```

### Uploading the cropped image

The `saveImage` function receives a `file` object with the cropped image data
encoded in `base64`. If you need a blob/buffer, check out this
[b64toBlob function](https://stackoverflow.com/a/16245768)

### Special Thanks

- projw-the-lessful, https://codepen.io/projw-the-lessful/pen/bJZKVW
